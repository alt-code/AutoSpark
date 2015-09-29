import os.path
from pyspark import SparkConf, SparkContext
from pyspark.sql import SQLContext


def main():
    # Setting the cluster configuration parameters
    conf = SparkConf()
    conf.setMaster("spark://localhost:7077")
    conf.setAppName("Tweet App")
    conf.set("spark.executor.memory", "3g")
    conf.set("spark.driver.memory", "4g")

    # Creating a Spark Context with conf file
    sc = SparkContext(conf=conf)

    # Creating and SQL context to perform SQL queries
    sqlContext = SQLContext(sc)

    # Define the data path
    curr_path = os.path.dirname(os.path.abspath(__file__))
    json_name = "out.json"

    json_file_path = os.path.join(curr_path +
                                  "/../Spark_Jobs/data/",
                                  json_name)

    parquet_file_path = createSQLContext(json_file_path, sqlContext)
    print(parquet_file_path)

    # Read from parquet file
    parquetFile = sqlContext.read.parquet(parquet_file_path)
    parquetFile.registerTempTable("tweets")
    counter = sqlContext.sql("SELECT count(*) as cnt FROM tweets")
    print("============= Count =================")
    print("Count:: " + str(counter.collect()[0].cnt))


def createSQLContext(json_file_path, sqlContext):

    # Saving the Tweets data as parquet
    curr_path = os.path.dirname(os.path.abspath(__file__))
    parq_tweets_name = "tweets.parquet"
    parq_file_path = os.path.join(curr_path +
                                  "/../Spark_Jobs/data/",
                                  parq_tweets_name)
    if os.path.exists(parq_file_path) is True:
        print("===========Parquet File exists=============")
        print("===========Skipping Parquet creation============")
    else:
        print("===========Parquet file doesnot exist=============")
        print("=========Creating parquet file===========")
        # Read the data into a data frame
        tweets_df = sqlContext.read.json(json_file_path)
        # Print the JSON Schema
        tweets_df.printSchema()
        tweets_df.write.parquet(parq_file_path)

    return parq_file_path


# Tokenizes text
def tokenizer(data):
    return data.split()


# Word counter
def word_count(sc, json_file_path, curr_path):
    data = sc.textFile(json_file_path)
    wc_data = data.flatMap(tokenizer)
    wc = wc_data.map(lambda x: (x, 1)).reduceByKey(lambda x, y: x + y)
    output_file_path = os.path.join(curr_path +
                                    "/../Spark_Jobs/data/",
                                    "out")
    wc.saveAsTextFile(output_file_path)


if __name__ == "__main__":
    main()
