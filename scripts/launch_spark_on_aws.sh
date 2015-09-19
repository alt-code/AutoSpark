
current_dir="$(pwd)"

# Moving to python dir
cd "$current_dir/../aws_cluster_launch/python"

# Executing python command
python ec2_connector.py --name spark001 --count 3 --type t2.micro --region us-west-2 --key_name ansible_key --security_group spark_cluster

# Sleep for machine to be accesible
sleep 100

# Moving to ansible directory
cd "$current_dir/../Ansible/playbooks"

# Executing master script
./master.sh

# Sleep for master to get setup
sleep 120

# Executing slave script
./slave.sh
