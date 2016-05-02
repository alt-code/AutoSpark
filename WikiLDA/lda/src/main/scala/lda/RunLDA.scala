package lda

import breeze.linalg.{DenseMatrix => BDenseMatrix, DenseVector => BDenseVector,
SparseVector => BSparseVector}

import java.io._

import lda.ParseWikipedia._

import org.apache.spark.{SparkContext, SparkConf}
import org.apache.spark.SparkContext._
import org.apache.spark.mllib.linalg._
import org.apache.spark.mllib.linalg.Vector
import org.apache.spark.mllib.linalg.distributed.RowMatrix
import org.apache.spark.rdd.RDD

import org.apache.log4j.{Level, Logger}
//import scopt.OptionParser

import org.apache.spark.ml.Pipeline
import org.apache.spark.ml.feature.{CountVectorizer, CountVectorizerModel, StopWordsRemover}
import org.apache.spark.mllib.clustering.{DistributedLDAModel, EMLDAOptimizer, LDA, OnlineLDAOptimizer}

import org.apache.spark.sql.{Row, SQLContext}

import scala.collection.Map
import scala.collection.mutable.ArrayBuffer

object RunLDA {
  
  def main(args: Array[String]) {
    run(args)
  }
  
  private def run(args: Array[String]) {
    val inputFilePath = args(0)
    val outputFileFullPath = args(1)
    val numTerms = if (args.length > 2) args(2).toInt else 20000
    val numTopics = if (args.length > 3) args(3).toInt else 30
    
    val fw = new FileWriter(outputFileFullPath, true)
    
    try{
      val conf = new SparkConf().setAppName(s"Wiki LDA")
      val sc = new SparkContext(conf)
      
      Logger.getRootLogger.setLevel(Level.WARN)
      
      val preprocessStart = System.nanoTime()
      
      val (corpus, vocabArray, actualNumTokens) = preprocessing(inputFilePath, numTerms, sc)
      corpus.cache()
      
      val actualCorpusSize = corpus.count()
      val actualVocabSize = vocabArray.length
      
      val preprocessElapsed = (System.nanoTime() - preprocessStart) / 1e9
      
      fw.write("\n")
      fw.write(s"Corpus summary:\n")
      fw.write(s"\t Training set size: $actualCorpusSize documents\n")
      fw.write(s"\t Vocabulary size: $actualVocabSize terms\n")
      fw.write(s"\t Training set size: $actualNumTokens tokens\n")
      fw.write(s"\t Preprocessing time: $preprocessElapsed sec\n")
      fw.write("\n")
      
      // Run LDA.
      val lda = new LDA()
  
      val  checkpointDir: Option[String] = None
      val optimizer = "online".toLowerCase match {
        case "em" => new EMLDAOptimizer
        // add (1.0 / actualCorpusSize) to MiniBatchFraction be more robust on tiny datasets.
        case "online" => new OnlineLDAOptimizer().setMiniBatchFraction(0.05 + 1.0 / actualCorpusSize)
        case _ => throw new IllegalArgumentException(
          s"Only em, online are supported but got em.")
      }
  
      lda.setOptimizer(optimizer)
        .setK(numTopics)
        .setMaxIterations(10)
        .setDocConcentration(-1)
        .setTopicConcentration(-1)
        .setCheckpointInterval(10)
      if (checkpointDir.nonEmpty) {
        sc.setCheckpointDir(checkpointDir.get)
      }
  
      val startTime = System.nanoTime()
      val ldaModel = lda.run(corpus)
      val elapsed = (System.nanoTime() - startTime) / 1e9
  
      fw.write(s"Finished training LDA model.  Summary:\n")
      fw.write(s"\t Training time: $elapsed sec\n")
  
      if (ldaModel.isInstanceOf[DistributedLDAModel]) {
        val distLDAModel = ldaModel.asInstanceOf[DistributedLDAModel]
        val avgLogLikelihood = distLDAModel.logLikelihood / actualCorpusSize.toDouble
        fw.write(s"\t Training data average log likelihood: $avgLogLikelihood\n")
        fw.write("\n")
      }
  
      // Print the topics, showing the top-weighted terms for each topic.
      val topicIndices = ldaModel.describeTopics(maxTermsPerTopic = 10)
      val topics = topicIndices.map { case (terms, termWeights) =>
        terms.zip(termWeights).map { case (term, weight) => (vocabArray(term.toInt), weight) }
      }
      fw.write(s"${numTopics} topics:\n")
      topics.zipWithIndex.foreach { case (topic, i) =>
        fw.write(s"TOPIC $i\n")
        topic.foreach { case (term, weight) =>
          fw.write(s"$term\t$weight\n")
        }
        fw.write("\n")
      }
      sc.stop()
    }finally{
      fw.close()
    }
  }
  
  def printToFile(f: java.io.File)(op: java.io.PrintWriter => Unit) {
    val p = new java.io.PrintWriter(f)
    try { op(p) } finally { p.close() }
  }

  /**
   * Returns an RDD of rows of the document-term matrix, a mapping of column indices to terms, and a
   * mapping of row IDs to document titles.
   */
  def preprocessing(path: String, numTerms: Int, sc: SparkContext)
      : (RDD[(Long, Vector)], Array[String], Long) = {
    
    val sqlContext = SQLContext.getOrCreate(sc)
    
    val pages = readFile(path, sc)

    val plainText = pages.filter(_ != null).flatMap(wikiXmlToPlainText)

   // val stopWords = sc.broadcast(loadStopWords(stopFile)).value

    val lemmatized = plainText.mapPartitions(iter => {
      val pipeline = createNLPPipeline()
      iter.map{ case(title, contents) => (title, plainTextToLemmas(contents, pipeline))}
    })
    
    val filtered = lemmatized.filter(_._2.size > 1)
    
    import sqlContext.implicits._
    
    val df = filtered.map(x => Tuple1(x._2)).toDF("rawTokens")
    
     val stopWordsRemover = new StopWordsRemover()
      .setInputCol("rawTokens")
      .setOutputCol("tokens")
    
    val countVectorizer = new CountVectorizer()
                          .setVocabSize(numTerms)
                          .setInputCol("tokens")
                          .setOutputCol("features")

    val pipeline = new Pipeline().setStages(Array(stopWordsRemover, countVectorizer))
    val model = pipeline.fit(df)
    
    val documents = model.transform(df).select("features").rdd.map { case Row(features: Vector) => features }.zipWithIndex().map(_.swap)
    val vocab = model.stages(1).asInstanceOf[CountVectorizerModel].vocabulary
    val tokenCount = documents.map(_._2.numActives).sum().toLong
    
    (documents,vocab,tokenCount)
  }
}
