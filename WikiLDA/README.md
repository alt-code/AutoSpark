# WikiLDA

==Requirements==  
Spark 1.5+  
Maven 3.0+  
Hadoop 2.6  


1. Create a Spark cluster on VCL by following the instructions at [this](https://github.com/amritbhanu/Spark_VCL) repository.
2. Git clone this repository.
3. Run mvn package to build an assembly jar. It will download parent dependencies as well the dependencies for modules lda & xml.
4. After running step, an assembly jar LDA-1.0.2-jar-with-dependencies.jar should be present in lda/target folder. Transfer this jar to Spark master.
5. Download the Wikipedia XML BZip2 file. Uncompress it and transfer to HDFS.
