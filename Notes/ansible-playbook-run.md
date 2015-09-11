### Commands to run Ansible playbook for master and slaves

Currently Ansible uses SSH credentials of the machine from which playbooks are run.

#####Hosts File:
```
/etc/ansible/hosts
```
### AWS

#####Master
```
ansible-playbook -s --extra-vars 'MASTER_YES="true" USER="ubuntu" SPARK_URL=""' sparkplaybook.yml
```

#####Slave
```
ansible-playbook -s --extra-vars 'MASTER_YES="false" USER="ubuntu" SPARK_URL="spark://ip-<IP Address of Master>:7077"' sparkplaybook.yml
```

### Digital ocean

#####Master
```
ansible-playbook -s --extra-vars 'MASTER_YES="true" USER="root" SPARK_URL="" MASTER_IP="<pubic-ip>"' sparkplaybook.yml
```

#####Slave
```
ansible-playbook -s --extra-vars 'MASTER_YES="false" USER="root" SPARK_URL="spark://<public-ip>:7077" MASTER_IP=""' sparkplaybook.yml
```
