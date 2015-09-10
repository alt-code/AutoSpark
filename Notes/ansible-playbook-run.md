### Commands to run Ansible playbook for master and slaves

Currently Ansible uses SSH credentials of the machine from which playbooks are run.

#####Hosts File:
```
/etc/ansible/hosts
```

#####Master
```
ansible-playbook -s --extra-vars 'MASTER_YES="true" SPARK_URL=""' sparkplaybook.yml
```

#####Slave
```
ansible-playbook -s --extra-vars 'MASTER_YES="false" SPARK_URL="spark://ip-<IP Address of Master>:7077"' sparkplaybook.yml
```
