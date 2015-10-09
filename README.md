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

### Copying the SSH & API keys to AutoSpark settings

1. ###### Copy the contents of id_rsa.pub and paste it into the below to files
  - /aws_cluster_launch/python/settings.py
  - /digitalocean_cluster_launch/js/settings.js

2. ###### Copy the AWS Secret and Access keys to the below file
  - /aws_cluster_launch/python/settings.py

3. ###### Copy the Digital Ocean token in the below file
  - /digitalocean_cluster_launch/js/settings.js

### Launch the cluster in interactive mode

```
cd AutoSpark/scripts
./main_launcher.sh
```

##### Notes:
###### Detailed Steps for setting up a Spark Cluster in Standalone mode:

https://docs.google.com/document/d/1RrwooqTfAZzn0L8kq4EvvGLNYQBRi_FNeyB4C221qMo/edit#
