#!/usr/bin/python

import boto.ec2
import getopt
import settings
import sys
import time
import os.path

# Globals
ACCESS_KEY = settings.ACCESS_KEY
SECRET_KEY = settings.SECRET_KEY
PUBLIC_SSH_KEY = settings.PUBLIC_SSH_KEY.encode('utf-8')
cluster_structure = {"masters": [], "slaves": []}
master_file_name = "master_inventory"
slave_file_name = "slave_inventory"
shell_script_master_name = "master.sh"
shell_script_slave_name = "slave.sh"
# User inputs constant for each run
CLUSTER_NAME = "spark"
COUNT = 3
INSTANCE_TYPE = "t2.micro"
REGION = "us-west-2"
# KEY_NAME = "spark_cluster_manager"
KEY_NAME = "ansible_key"
KEY_PATH = "~/.ssh/id_rsa"
SECURITY_GROUPS = ["spark_cluster"]
IMAGE_ID = "ami-5189a661"


def create_connection(region):
    conn = boto.ec2.connect_to_region(region,
                                      aws_access_key_id=ACCESS_KEY,
                                      aws_secret_access_key=SECRET_KEY)

    return conn


def add_name_tags(reservation, cluster_name, cluster_structure):

    if len(reservation.instances) < 1:
        print("Cluster cannot have less that 1 instance")

    else:
        print("Info: Cluster with more than 1 node initalized")
        print("Info: Adding tag to master node...")
        master = reservation.instances[0]
        master.add_tag('Name', cluster_name + '-Master')
        master.add_tag('Cluster_Id', cluster_name)

        # Adding master to the cluster structure
        cluster_structure["masters"].append(master)

        if len(reservation.instances) > 1:

            # Cluster launched with one master and multiple slaves
            print("Info: Adding tag to slave nodes...")
            for i in range(1, len(reservation.instances)):
                instance = reservation.instances[i]
                instance.add_tag('Name', cluster_name + '-Slave')
                instance.add_tag('Cluster_Id', cluster_name)
                cluster_structure["slaves"].append(instance)

    return cluster_structure


def cluster_config_check(cluster_info):
    if len(cluster_info['masters']) <= 0:
        print("Error: Master missing in cluster creation")
    else:
        print("Success: Master created")

    if len(cluster_info['slaves']) <= 0:
        print("Warning: Cluster launched without any slave nodes")
    else:
        print("Success: " +
              str(len(cluster_info['slaves'])) + " slaves created")


def print_master_slave_setup(cluster_info):

    print("========= Cluster Configuration =========")

    print("Masters:")
    for master in cluster_info['masters']:
        print(master.id + "  " + master.public_dns_name)
        print("Cluster_Master - DNS / Spark URL = " + master.public_dns_name
                                                    + ":8080")

    print("Slaves:")
    for slave in cluster_info['slaves']:
        print(slave.id + "  " + slave.public_dns_name)

    print("=============== End ==================")


def insert_ssh(conn, key_name):
    # print(PUBLIC_SSH_KEY)
    key_pair = conn.import_key_pair(key_name, PUBLIC_SSH_KEY)
    return key_pair


def check_ssh(conn, key_name):
    try:
        key = conn.get_all_key_pairs(keynames=[key_name])[0]
        print("Info: Found Key with name - " + key.name)
        print("Info: Continuing cluster creation...")
    except conn.ResponseError as e:
        if e.code == 'InvalidKeyPair.NotFound':
            print("Warning: No keyPair found with name " + key_name)
            print("Info: Creating keypair: " + key_name)

            # Create an SSH key to use when logging into instances.
            key_pair = insert_ssh(conn, key_name)
            print("Success: Created a new keypair")
            print(key_pair)

        else:
            raise


def wait_for_public_ip(reservation):
    for instance in reservation.instances:
        while instance.update() != "running":
            time.sleep(5)


def create_inventory_file(cluster_info, key_path):

    python_file_path = os.path.dirname(os.path.abspath(__file__))
    print("Info: Current file path " + python_file_path)

    master_file_path = os.path.join(python_file_path +
                                    "/../../Ansible/playbooks/",
                                    master_file_name)

    print(master_file_path)
    master_file = open(master_file_path, "w")
    master_file.truncate()

    # Writing the master inventory file
    master_file.write("[sparknodes]\n")
    for master in cluster_info["masters"]:
        master_file.write(master.ip_address +
                          " ansible_ssh_private_key_file=" +
                          key_path + "\n")

    slave_file_path = os.path.join(python_file_path +
                                   "/../../Ansible/playbooks/",
                                   slave_file_name)

    print(slave_file_path)
    slave_file = open(slave_file_path, "w")
    slave_file.truncate()

    # Writing the slave inventory file
    slave_file.write("[sparknodes]\n")
    for slave in cluster_info["slaves"]:
        slave_file.write(slave.ip_address +
                         " ansible_ssh_private_key_file=" +
                         key_path + "\n")

    master_file.close()
    slave_file.close()


def create_shell_script(cluster_info):

    master = cluster_info["masters"][0]
    python_file_path = os.path.dirname(os.path.abspath(__file__))
    print("Info: Current file path " + python_file_path)

    # Master shell script
    shell_script_master_path = os.path.join(python_file_path +
                                            "/../../Ansible/playbooks/",
                                            shell_script_master_name)

    print("Info: Master script path " + shell_script_master_path)
    script_file_master = open(shell_script_master_path, "w")
    script_file_master.truncate()
    script_file_master.write("ansible-playbook -s --extra-vars ")
    script_file_master.write("\'MASTER_YES=\"true\" USER=\"ubuntu\" ")
    script_file_master.write("SPARK_URL=\"\" MASTER_IP=\"")
    script_file_master.write(master.public_dns_name)
    script_file_master.write("\"\' sparkplaybook.yml -i master_inventory\n")

    # Slave shell script
    shell_script_slave_path = os.path.join(python_file_path +
                                           "/../../Ansible/playbooks/",
                                           shell_script_slave_name)

    print("Info: Master script path " + shell_script_slave_path)
    script_file_slave = open(shell_script_slave_path, "w")
    script_file_slave.truncate()
    script_file_slave.write("ansible-playbook -s --extra-vars ")
    script_file_slave.write("\'MASTER_YES=\"false\" USER=\"ubuntu\" ")
    script_file_slave.write("SPARK_URL=\"spark://")
    script_file_slave.write(master.public_dns_name + ":7077\" ")
    script_file_slave.write("MASTER_IP=\"\"")
    script_file_slave.write("\' sparkplaybook.yml -i slave_inventory\n")


def main(argv):

    try:
        opts, args = getopt.getopt(argv, "",
                                   ["name=", "count=", "type=", "region=",
                                    "key_name=", "key_path="])

    except getopt.GetoptError:
        print('app.py --name <spark001> --count <3> --type <t2.micro>'
              ' --region <us-west-2> --key_name <xyz> --key_path <abc>')
        sys.exit(2)

    print("Info: Launching cluster with arguments:")
    print(opts)

    for opt, arg in opts:

        # Setting constants from command line
        if opt == '--name':
            CLUSTER_NAME = arg

        if opt == '--count':
            COUNT = int(arg)

        if opt == '--type':
            INSTANCE_TYPE = arg

        if opt == '--region':
            REGION = arg

        if opt == "--key_name":
            KEY_NAME = "key-" + arg

        if opt == "--key_path":
            KEY_PATH = arg
            # SECURITY_GROUPS = [arg]

    # Creating the cluster
    conn = create_connection(region=REGION)

    # Check if exists else insert public SSH
    check_ssh(conn, KEY_NAME)

    # Create reservation
    # reservation = conn.run_instances(image_id=IMAGE_ID, min_count=COUNT,
    #                                  max_count=COUNT, key_name=KEY_NAME,
    #                                  security_groups=SECURITY_GROUPS,
    #                                  instance_type=INSTANCE_TYPE)
    reservation = conn.run_instances(image_id=IMAGE_ID, min_count=COUNT,
                                     max_count=COUNT, key_name=KEY_NAME,
                                     instance_type=INSTANCE_TYPE)

    # Wait for public Ip to be assigned
    wait_for_public_ip(reservation)

    cluster_info = add_name_tags(reservation, CLUSTER_NAME, cluster_structure)

    # Check cluster information for Warnings
    cluster_config_check(cluster_info)
    print_master_slave_setup(cluster_info)

    # Writing master / slave inventory files
    create_inventory_file(cluster_info, KEY_PATH)

    # Create shell script
    create_shell_script(cluster_info)

if __name__ == '__main__':
    main(sys.argv[1:])

# python ec2_connector.py --name spark001 --count 3 --type t2.micro
# --region us-west-2 --key_name ansible_key --security_group spark_cluster
