from pyspark import SparkConf, SparkContext
import sys
import os


CURR_DIR = os.path.dirname(os.path.abspath(__file__))


class AccessLog:

    def __init__(self, access_log_str):
        log_parts = access_log_str.split(' ')
        self.status = log_parts[len(log_parts) - 2]
        self.remote_addr = log_parts[0]

    def get_status(self):
        return self.status

    def get_remote_addr(self):
        return self.remote_addr


def main(args):

    if len(args) < 2:
        sys.exit(1)

    # Setting the cluster configuration parameters
    spark_master = args[0]
    spark_data_file_name = args[1]
    file_path = CURR_DIR + "/" + spark_data_file_name

    conf = SparkConf()
    conf.setMaster(spark_master)
    conf.setAppName("Log Scanner")

    # Creating a Spark Context with conf file
    sc = SparkContext(conf=conf)

    txt_logs = sc.textFile(file_path).filter(lambda line: check(line))
    access_logs = txt_logs.map(lambda line: AccessLog(line))

    #  Getting response_codes from log objects and caching it
    response_codes = access_logs.map(lambda log: log.get_status()).cache()
    log_count = response_codes.count()
    print("Total Resonse Codes: " + str(log_count))
    cnt = response_codes.map(lambda x: (x, 1)).reduceByKey(lambda x, y: x + y)
    response200 = cnt.filter(lambda x: x[0] == "200").map(lambda (x, y): y).collect()
    print("###########################")
    print("##  Success Rate : " + str(int(response200[0])*100/log_count) + " %  ##")
    print("###########################")


def check(line):
    if line is None or line == "" or line == "\n" or line == "\t":
        return False
    else:
        return True


if __name__ == "__main__":
    main(sys.argv[1:])
