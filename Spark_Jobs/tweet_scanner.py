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

    createSQLContext(json_file_path, sqlContext)

    # test(json_file_path, sqlContext)
    # word_count(sc, json_file_path, curr_path)


def test(json_file_path, sqlContext):
    tweets = sqlContext.jsonFile(json_file_path)
    tweets.printSchema()


def createSQLContext(json_file_path, sqlContext):

    print("=========Inside SQL Context Creator ===========")
    # Read the data into a data frame
    dataframe = sqlContext.read.json(json_file_path)

    # Print the JSON Schema
    dataframe.printSchema()


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
