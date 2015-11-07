import os
import subprocess

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MASTER_INVENTORY = BASE_DIR + "/../Ansible/playbooks/master_inventory"
SLAVE_INVENTORY = BASE_DIR + "/../Ansible/playbooks/slave_inventory"

# Accepting input
data_file_path = input('Enter full data file path: ')
data_file_name_dest = input('Enter Filename to use at Destination: ')

nodes_array = []
with open(MASTER_INVENTORY) as master_file:

    count = 0
    for line in master_file:
        if count != 0:
            ip_addr = line.split(" ")[0]
            nodes_array.append(ip_addr)

        count += 1

with open(SLAVE_INVENTORY) as slave_file:

    count = 0
    for line in slave_file:
        if count != 0:
            ip_addr = line.split(" ")[0]
            nodes_array.append(ip_addr)

        count += 1


print("Loading data into all cluster nodes")
print(nodes_array)

# Executing load on all nodes
cmd_format = "scp {0} {1}:/home/ubuntu/{2}"
for node in nodes_array:
    cmd = cmd_format.format(data_file_path, node, data_file_name_dest)
    subprocess.call(cmd, shell=True)
