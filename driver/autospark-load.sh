

# Acceptig the spark url and data path
spark_url=$1
data_file_path=$2

echo "Spark URL provided"
echo $spark_url

# Applying regex to get the spark master IP
re="spark://([^/]+):7077"
if [[ $spark_url =~ $re ]]; then

  spark_master_ip=${BASH_REMATCH[1]};
  echo "Executing"
  echo "$data_file_path $spark_master_ip:/spark/spark_latest/bin/$data_file_path"
  scp $data_file_path $spark_master_ip:/spark/spark_latest/bin/$data_file_path

else
	echo "Incorrect spark url format"
fi
