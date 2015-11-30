# Steps to build and run Docker Image

```
docker build https://github.com/alt-code/AutoSpark.git#master:docker -t saurabhsvj/autospark
docker run -it saurabhsvj/autospark /bin/bash
docker-bash $: ssh-keygen -t rsa
```
Run below commands on the docker bash prompt
```
docker-bash $: mkdir /ssh_keys
docker-bash $: cp ~/.ssh/id_rsa /ssh_keys/id_rsa
docker-bash $: cp ~/.ssh/id_rsa.pub /ssh_keys/id_rsa.pub
docker-bash $: echo "StrictHostKeyChecking no" >> /etc/ssh/ssh_config
```
#### Running the logscanner job using docker

Initial setup
```
sudo apt-get install wget
wget ftp://ita.ee.lbl.gov/traces/NASA_access_log_Jul95.gz
gzip -d NASA_access_log_Jul95.gz
mv NASA_access_log_Jul95 nasalogs
```

Loading data
```
node node autospark-load.js
Follow instructions on cmd line
```

Submitting the job
```
node autospark-submit.js
Follow the instructions on cmd line
```
