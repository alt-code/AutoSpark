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

## Instructions to run on Docker

### Steps to build and run Docker Image

```
docker build https://github.com/alt-code/AutoSpark.git#master:docker -t saurabhsvj/autospark
docker run -it saurabhsvj/autospark /bin/bash
```
This step should start a bash prompt inside docker to run the below commands

### Execute commands on docker container bash
These create the necessary folders for ssh_keys
```
docker-bash $: ssh-keygen -t rsa
docker-bash $: mkdir /ssh_keys
docker-bash $: cp ~/.ssh/id_rsa /ssh_keys/id_rsa
docker-bash $: cp ~/.ssh/id_rsa.pub /ssh_keys/id_rsa.pub
docker-bash $: echo "StrictHostKeyChecking no" >> /etc/ssh/ssh_config
```

### Running the logscanner job using docker

Initial setup to get datasets
```
sudo apt-get install wget
wget ftp://ita.ee.lbl.gov/traces/NASA_access_log_Jul95.gz
gzip -d NASA_access_log_Jul95.gz
mv NASA_access_log_Jul95 nasalogs
```

### Loading the data onto the cluster
```
node autospark-load.js

Note: Follow the instructions on command line
```

### Submitting the job to spark cluster
```
node autospark-submit.js

Note: Follow the instructions on command line
```

### Tear down the cluster
```
node autospark-teardown.js

Note: Follow the instructions on command line
```


## Instructions for launching clusters using Ubuntu OS

1. Updates the driver machine
```
sudo apt-get update -y
```
2. Install git on the system
```
sudo apt-get install git
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
6. Clone the AutoSpark Repo
```
git clone https://github.com/alt-code/AutoSpark.git
```
7. If ssh key pair is not present create it. Copy it to a known folder e.g. ssh_keys
```
ssh-keygen -t rsa
mkdir /home/ubuntu/ssh_keys
cp ~/.ssh/id_rsa /home/ubuntu/ssh_keys/id_rsa
cp ~/.ssh/id_rsa.pub /home/ubuntu/ssh_keys/id_rsa.pub
```
8. Edit ssh_config file - set Stricthost checking to no
```
vi /etc/ssh/ssh_config

Set: 

StrictHostKeyChecking=no
```

## AutoSpark Usage:

### Install AutoSpark Dependencies

```
cd AutoSpark/driver

npm install

```

### Launch cluster
```
node autospark-cluster-launcher.js

Note: Follow Instructions. Keep the AWS keys and digital ocean tokens handy.
```

### Load Data onto the cluster
```
node autospark-load.js

```

### Submit Spark Job on the cluster
```
node autospark-submit.js

```

### Tear down the cluster
```
node autospark-teardown.js

Note: Follow Instructions. Keep the AWS keys and digital ocean tokens handy.
```


## Notes:
###### Detailed Steps for setting up a Spark Cluster in Standalone mode:

https://docs.google.com/document/d/1RrwooqTfAZzn0L8kq4EvvGLNYQBRi_FNeyB4C221qMo/edit#
