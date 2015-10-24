#########################################################
#                       Launch Notes
#
#./launch_spark_on_do.sh <cluster name> <number of nodes> <size> <full key_path>
#########################################################

#Running the machine setup script
./setup_machine.sh

current_dir="$(pwd)"

# Moving to python dir
cd "$current_dir/../connector/digital_ocean"

# Setting up node modules
npm install -r package.json

#Getting a unique key_name
key_name=$(ip route get 8.8.8.8 | awk '{print $NF; exit}')

#Setting region
region="nyc3"

# Executing node command
node digitalocean_connector.js $1 $2 $3 $region $key_name $4
node create_shell_scripts.js

# Sleep for machine to be accesible
echo "Waiting for digital ocean instances to be ready for SSH..."
sleep 120

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
