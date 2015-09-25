
current_dir="$(pwd)"

# Moving to python dir
cd "$current_dir/../aws_cluster_launch/python"

# pip install requirements
sudo pip install -r requirements.txt

# Executing python command
python ec2_connector.py --name spark001 --count 4 --type t2.micro --region us-west-2 --key_name ansible_key --security_group spark_cluster

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
