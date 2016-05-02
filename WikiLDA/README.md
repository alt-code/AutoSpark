##WikiLDA

Running Latent Dirichlet Allocation(LDA) on Wikipedia data on a Spark cluster.

####Requirements on localhost
Maven 3.0+  
```sudo apt-get install maven```

Hadoop 2.6+
```
wget http://mirrors.sonic.net/apache/hadoop/common/hadoop-2.6.0/hadoop-2.6.0.tar.gz
tar -xvzf hadoop-2.6.0.tar.gz
ln -s hadoop-2.6.0.tar.gz hadoop
```

####Add environment variables
Add following environment variables to one of the two files from **/etc/environment** or **~/.bashrc** depending on your preferences(if you want to set it up for all users or current user). This is required to run Hadoop commands on localhost to transfer a file directly to HDFS (see step 4 in set up)
```
export JAVA_HOME=<java_installation_directory> {e.g. /usr/lib/jvm/java-7-openjdk-amd64}
export HADOOP_INSTALL=<hadoop_installation_directory>  {e.g. /home/agohil/hadoop}
export PATH=$PATH:$HADOOP_INSTALL/bin
export PATH=$PATH:$HADOOP_INSTALL/sbin
```

####Set Up
1. Create a Spark cluster on VCL by following the instructions at [this](https://github.com/amritbhanu/Spark_VCL) repository. A Spark cluster on any of the cloud providers like AWS can also be used.

2. Download the English Wikipedia XML BZip2 file. It can be downloaded in one of the two ways:  
  a) as torrent from [dump torrents] (https://meta.wikimedia.org/wiki/Data_dump_torrents#enwiki)  
  b) direct download as multiple BZIP2 streams from the [dump](https://dumps.wikimedia.org/enwiki/)

3. Uncompress the bzip2 file using the below command. The uncompressed file is over 50GB. So make sure there is enough disk space. Uncompressing will take some time.
  ```
  bzip2 -dk <filename>.bz2
  ```

4. Tranfer the uncompressed XML file to HDFS using the below command. This may take a lot of time (well over 8 hours).

  ```hadoop fs -cp file:///<absolute_file_path_on_localhost> hdfs://<name_node_ip>/<directory_on_hdfs>```
  
  e.g. hadoop fs -cp file:///home/agohil/Programs/alt-code/WikiDump/enwiki-latest-pages-articles.xml hdfs://152.46.20.100/user/agohil/In

5. Git clone this repository.

6. Run the command ```mvn package``` to build an assembly jar. It will download parent dependencies as well the dependencies for modules lda & xml.

7. After running the above step, an assembly jar **LDA-1.0.2-jar-with-dependencies.jar** would be created in **lda/target** folder. Transfer this jar to Spark master. You can use scp to do this.
  ```
  scp <path_to_lda_jar> <user>@<SparkMaster_IP>:<path_on_master>
  ```
  
  e.g. scp ~/alt-code/WikiLDA/lda/target/LDA-1.0.2-jar-with-dependencies.jar agohil@152.46.20.100:/home/agohil

####Submit Spark job
- ssh to Spark master. After running the set up (step 1), the Spark package should already be there in the folder **~/spark/spark_latest**
- Submit the Spark job by issuing the following command
  ```
  spark/spark_latest/bin/spark-submit --class lda.RunLDA --master spark://<SparkMaster_IP>:7077 --executor-memory 6G --driver-memory 6G <path_to_lda_jar> <runtime_args>
  ```
  
  e.g. spark/spark_latest/bin/spark-submit --class lda.RunLDA --master spark://152.46.18.84:7077 --executor-memory 6G --driver-memory 6G LDA-1.0.2-jar-with-dependencies.jar hdfs://152.46.18.84/user/agohil/In/enwiki-latest-pages-articles.xml /home/agohil/output.txt
  
The following runtime args needs to be passed:
1. Path to input XML on HDFS (mandatory)
2. Path to output file which will have the topics and runtimes of different modules (mandatory)
3. Number of top terms per document to reduce dimensions (optional, default 20000)
4. Number of topics (optional, default 30)

The Spark configuration parameters like executor memory and driver memory can be changed as per node's memory limit. On Spark VCL image, 6 GB was optimal.
