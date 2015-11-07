
# Accepting the spark job path and spark master url
echo -n "Enter spark_context_url > "
read spark_context_url

echo -n "Enter spark job file path > "
read spark_job_file_path

echo -n "Enter filename to use at destination"
read job_name_at_destination


# Applying regex to get the spark master IP
re="spark://([^/]+):7077"
if [[ $spark_context_url =~ $re ]]; then

  spark_master_ip=${BASH_REMATCH[1]};

  echo "Executing the command... "
  echo "scp $spark_job_file_path $spark_master_ip:/spark/spark_latest/bin/$job_name_at_destination"
  scp $spark_job_file_path $spark_master_ip:/spark/spark_latest/bin/$job_name_at_destination

  echo "ssh -l ubuntu $spark_master_ip /spark/spark_latest/bin/$job_name_at_destination $spark_context_url"
  ssh -l ubuntu $spark_master_ip /spark/spark_latest/bin/$job_name_at_destination $spark_context_url

else
	echo "Incorrect spark url format"
fi
