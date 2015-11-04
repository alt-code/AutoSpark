# AutoSpark

Auto spinning spark clusters for text analysis and machine learning.

## Setting up AutoSpark

### Setup AWS Access Keys
1. Go to AWS console
2. Add a new user and copy the AWS ACCESS KEY and SECRET KEYS
3. Add the user to the Administrator Access group (Required to launch instances using boto API)
4. Copy the AWS SECRET AND ACCESS Keys to a safe place

### Setup Digital Ocean token
1. Login to digital ocean
2. Go to the API tab
3. Generate a new token
4. Copy the token to a safe place

### Instructions for launching clusters using Ubuntu
1. Install git on the system
```
sudo apt-get install git
```
2. Updates the instances
```
sudo apt-get update -y
```

3. Install pip
```
sudo apt-get install python-pip -y
```

4. Setting up node and npm
```
sudo apt-get install npm -y
sudo apt-get install nodejs-legacy -y
sudo ln -s /usr/bin/nodejs /usr/sbin/node
```

5. Install ansible
```
sudo apt-get install software-properties-common -y
sudo apt-add-repository ppa:ansible/ansible -y
sudo apt-get install ansible -y
```

2. Clone the AutoSpark Repo
```
git clone https://github.com/alt-code/AutoSpark.git
```

3. If ssh key pair is not present create it. Copy it to a known folder e.g. ssh_keys
```
ssh-keygen -t rsa
mkdir /home/ubuntu/ssh_keys
cp ~/.ssh/id_rsa  to /home/ubuntu/ssh_keys/id_rsa
cp ~/.ssh/id_rsa.pub to /home/ubuntu/ssh_keys/id_rsa.pub
```

### Launch the cluster in interactive mode

```
cd AutoSpark/driver

npm install

node interactive_launcher.js
```

##### Notes:
###### Detailed Steps for setting up a Spark Cluster in Standalone mode:

https://docs.google.com/document/d/1RrwooqTfAZzn0L8kq4EvvGLNYQBRi_FNeyB4C221qMo/edit#
