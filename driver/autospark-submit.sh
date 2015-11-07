
# Accepting the spark job path and spark master url
echo -n "Enter Spark Master IP > "
read spark_master_ip

echo -n "Enter spark_context_url > "
read spark_context_url

echo -n "Enter spark job file path > "
read spark_job_file_path

echo -n "Enter filename to use at destination"
read job_name_at_destination

echo -n "Enter datapath to use at destination"
read data_path_destination

echo "Executing the command... "
echo "scp $spark_job_file_path $spark_master_ip:/spark/spark_latest/bin/$job_name_at_destination"
scp $spark_job_file_path $spark_master_ip:/spark/spark_latest/bin/$job_name_at_destination

ssh -l ubuntu $spark_master_ip 'sudo /spark/spark_latest/bin/pyspark /spark/spark_latest/bin/$job_name_at_destination $spark_context_url $data_path_destination'
