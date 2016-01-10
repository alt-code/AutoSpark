#Install Spark on HPC
##A Quick Guide for HPC
First of all, get started with HPC real quick from this [link](https://github.com/ai-se/HPC-Clusters)

1. Login to the HPC using
  ```
  ssh -X <your-unity-id>@login01.hpc.ncsu.edu
  ```
2. Navigate to `/share/<your-unity-id>`

  ```
  cd /share/<your-unity-id>
  ```


##Install Java
1. Download JDK packege

  ```
  wget --no-check-certificate --no-cookies --header "Cookie: oraclelicense=accept-securebackup-cookie" http://download.oracle.com/otn-pub/java/jdk/8u65-b17/jdk-8u65-linux-x64.tar.gz
  ```
2. Unpack

  ```
  tar xzvf jdk-8u65-linux-x64.tar.gz 
  ```
3. Link JDK

  ```
  ln -s jdk1.8.0_65/ jdk
  ```
  
##Add Java to your local Environment Variables
1. Navigate `home` directory

  ```
  cd ~
  ```
2. Open `.tcshrc`.

  ```
  vi .tcshrc
  ```
  append `set path= ($path /share/<your-unity-id>/java/jdk/bin/ $home/bin/)` to it.

  
3. Change shell to `tcsh`

  ```
  tcsh
  ```
4. Test

  ```
  java -version
  ```
  You should see something similar
  ```
  openjdk version "1.8.0_31"
  OpenJDK Runtime Environment (build 1.8.0_31-b13)
  OpenJDK 64-Bit Server VM (build 25.31-b07, mixed mode)
  ```
  
  
  
##Install Spark
1. Navigate to `/share/<your-unity-id>`
  
  ```
  cd /share/<your-unity-id>
  mkdir spark
  cd spark
  ```
2. Get the pre-built version of Spark package

  ```
  wget http://mirror.symnds.com/software/Apache/spark/spark-1.6.0/spark-1.6.0-bin-hadoop2.6.tgz
  ```
3. Unpack
  
  ```
  tar -xzvf spark-1.6.0-bin-hadoop2.6.tgz
  ```
4. Go into the unpacked folder
  
  ```
  cd spark-1.6.0-bin-hadoop2.6
  ```
5. Run the test
  
  ```
  ./bin/run-example SparkPi 10
  
  ```

##Done!
