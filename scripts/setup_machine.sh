# Updates the instances
sudo apt-get update -y

# Install pip
sudo apt-get install python-pip -y

# Setting up npm
sudo apt-get install npm -y

# Setting up node js
sudo apt-get install nodejs-legacy -y
sudo ln -s /usr/bin/nodejs /usr/sbin/node

# Install ansible
sudo apt-get install software-properties-common -y
sudo apt-add-repository ppa:ansible/ansible -y
sudo apt-get update -y
sudo apt-get install ansible -y
