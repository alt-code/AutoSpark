//referenced from https://gist.github.com/jkbradley/ab8ae22a8282b2c8ce33

import scala.collection.mutable
import org.apache.spark.mllib.clustering.LDA
import org.apache.spark.mllib.linalg.{Vector, Vectors}
import org.apache.spark.rdd.RDD

val corpus: RDD[String] = sc.wholeTextFiles("jones.txt").map(_._2)

val tokenized: RDD[Seq[String]] =
  corpus.map(_.toLowerCase.split("\\s")).map(_.filter(_.length > 3).filter(_.forall(java.lang.Character.isLetter)))

val termCounts: Array[(String, Long)] =
  tokenized.flatMap(_.map(_ -> 1L)).reduceByKey(_ + _).collect().sortBy(-_._2)

val numStopwords = 20
val vocabArray: Array[String] =
  termCounts.takeRight(termCounts.size - numStopwords).map(_._1)

val vocab: Map[String, Int] = vocabArray.zipWithIndex.toMap

val documents: RDD[(Long, Vector)] =
  tokenized.zipWithIndex.map { case (tokens, id) =>
    val counts = new mutable.HashMap[Int, Double]()
    tokens.foreach { term =>
      if (vocab.contains(term)) {
        val idx = vocab(term)
        counts(idx) = counts.getOrElse(idx, 0.0) + 1.0
      }
    }
    (id, Vectors.sparse(vocab.size, counts.toSeq))
  }

val numTopics = 10
val lda = new LDA().setK(numTopics).setMaxIterations(10)

val ldaModel = lda.run(documents)
val avgLogLikelihood = ldaModel.logLikelihood / documents.count()

val topicIndices = ldaModel.describeTopics(maxTermsPerTopic = 10)
topicIndices.foreach { case (terms, termWeights) =>
  println("TOPIC:")
  terms.zip(termWeights).foreach { case (term, weight) =>
    println(s"${vocabArray(term.toInt)}\t$weight")
  }
  println()
}
