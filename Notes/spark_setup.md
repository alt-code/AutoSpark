# Spark Cluster Setup

## Steps to setup a Spark Cluster on AWS or Digital Ocean
1. Launch Ubuntu 14.04 Nodes on AWS or Digital Ocean
2. Perform machine updates

    ```
    sudo apt-get update
    ```
3. Add wget util on all nodes

    ```
    sudo apt-get install wget
    ```
4. Go to machines root

    ```
    cd /
    ```
5. Create a directory to download spark

    ```
    sudo mkdir spark
    cd spark
    ```
6. wget the spark setup on all nodes ( one of the two)

    ```
    sudo wget http://www.webhostingjams.com/mirror/apache/spark/spark-1.4.1/spark-1.4.1-bin-hadoop2.6.tgz
    sudo wget http://apache.mirrors.hoobly.com/spark/spark-1.4.1/spark-1.4.1-bin-hadoop2.6.tgz
    ```
7. Untar the setup

    ```
    sudo tar -xvzf spark-1.4.1-bin-hadoop2.6.tgz
    ```
8. Move the setup to spark_latest folder

    ```
    sudo mv spark-1.4.1-bin-hadoop2.6 spark_latest
    ```
9. Setup JRE

    ```
    sudo apt-get install -y openjdk-7-jre
    ```
10. Move to the desired directory

    ```
    cd /spark/spark_latest/sbin
    ```
11. Start the master or slave script

    ```
    sudo ./start-master.sh or sudo ./start-slave.sh
    ```
12. The spark master is at public IP of master: 8080 find actual spark URL using curl

    ```
    Add image here
    ![Spark]()
    ```
13. Repeat for all slaves
