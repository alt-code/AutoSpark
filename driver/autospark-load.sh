
# Accepting the spark url and data path
echo -n "Enter spark_context_url > "
read spark_url

echo -n "Enter Data File Path > "
read data_file_path

echo -n "Enter Filename to use at Destination"
read filename_at_destination

echo "Spark URL provided -- $spark_url"

# Applying regex to get the spark master IP
re="spark://([^/]+):7077"
if [[ $spark_url =~ $re ]]; then

  spark_master_ip=${BASH_REMATCH[1]};
  echo "Executing the below command... "
  echo "scp $data_file_path $spark_master_ip:/spark/spark_latest/bin/$filename_at_destination"
  scp $data_file_path $spark_master_ip:/spark/spark_latest/bin/$filename_at_destination

else
	echo "Incorrect spark url format"
fi
