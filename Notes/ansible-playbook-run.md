### Commands to run Ansible playbook for master and slaves

Currently Ansible uses SSH credentials of the machine from which playbooks are run.

#####Hosts File:
```
/etc/ansible/hosts
```
### AWS

#####Master
```
ansible-playbook -s --extra-vars 'MASTER_YES="true" USER="ubuntu" SPARK_URL="" MASTER_IP="ec2-xx-xx-xx-xx.us-west-2.compute.amazonaws.com"' sparkplaybook.yml -i hosts
```

#####Slave
```
ansible-playbook -s --extra-vars 'MASTER_YES="false" USER="ubuntu" MASTER_IP="" SPARK_URL="spark://xx-xx-xx-xx.us-west-2.compute.amazonaws.com:7077"' sparkplaybook.yml -i hosts
```

### Digital ocean

#####Master
```
ansible-playbook -s --extra-vars 'MASTER_YES="true" USER="root" SPARK_URL="" MASTER_IP="<pubic-ip>"' sparkplaybook.yml -i hosts
```

#####Slave
```
ansible-playbook -s --extra-vars 'MASTER_YES="false" USER="root" SPARK_URL="spark://<public-ip>:7077" MASTER_IP=""' sparkplaybook.yml -i hosts
```
