
# Accepting the spark url and data path
echo -n "Enter spark_master_ip > "
read spark_master_ip

echo -n "Enter Data File Path > "
read data_file_path

echo -n "Enter Filename to use at Destination > "
read filename_at_destination

echo "Executing the below command... "
echo "scp $data_file_path $spark_master_ip:/spark/spark_latest/bin/$filename_at_destination"
scp $data_file_path $spark_master_ip:/spark/spark_latest/bin/$filename_at_destination
