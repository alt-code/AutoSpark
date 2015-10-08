#########################################################
#                       Launch Notes
#
#./launch_spark_on_aws.sh <cluster name> <number of nodes> <AWS_type of instance> <full key_path>
#########################################################

current_dir="$(pwd)"

# Moving to python dir
cd "$current_dir/../aws_cluster_launch/python"

# pip install requirements
sudo pip install -r requirements.txt

#Getting a unique key_name
key_name=$(ip route get 8.8.8.8 | awk '{print $NF; exit}')

#Setting region
region="us-west-2"

# Executing python command
python ec2_connector.py --name $1 --count $2 --type $3 --key_path $4 --region $region --key_name $key_name

# Sleep for machine to be accesible
echo "Waiting for ec2 instances to be ready for SSH..."
sleep 100

# Moving to ansible directory
cd "$current_dir/../Ansible/playbooks"

# For non interactive experience
export ANSIBLE_HOST_KEY_CHECKING=False

# Executing master script
echo "Info: Setting up Spark Master"
./master.sh

# Sleep for master to get setup
sleep 60

# Executing slave script
echo "Info: Setting up Spark Slaves"
./slave.sh
