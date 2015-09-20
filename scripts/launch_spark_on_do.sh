
current_dir="$(pwd)"

# Moving to python dir
cd "$current_dir/../digitalocean_cluster_launch/js"

# Executing node command
node digitalocean_connector.js
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
