#!/usr/bin/python

import boto.ec2
import getopt
import settings
import sys


# Globals
ACCESS_KEY = settings.ACCESS_KEY
SECRET_KEY = settings.SECRET_KEY
cluster_structure = {"masters": [], "slaves": []}

# User inputs constant for each run
CLUSTER_NAME = "spark"
COUNT = 3
INSTANCE_TYPE = "t2.micro"
REGION = "us-west-2"
KEY_NAME = "spark_cluster_manager"
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
        master = reservation.instances[0]
        master.add_tag('Name', cluster_name + '-Master')
        master.add_tag('Cluster_Id', cluster_name)

        # Adding master to the cluster structure
        cluster_structure["masters"].append(master.id)

        if len(reservation.instances) > 1:

            # Cluster launched with one master and multiple slaves
            for i in range(1, len(reservation.instances)):
                instance = reservation.instances[i]
                instance.add_tag('Name', cluster_name + '-Slave')
                instance.add_tag('Cluster_Id', cluster_name)
                cluster_structure["slaves"].append(instance.id)

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
        print(master)

    print("Slaves:")
    for slave in cluster_info['slaves']:
        print(slave)

    print("=============== End ==================")


def main(argv):

    try:
        opts, args = getopt.getopt(argv, "",
                                   ["name=", "count=", "type=", "region=",
                                    "key_name=", "security_group="])

    except getopt.GetoptError:
        print('app.py --name <spark001> --count <3> --type <t2.micro>'
              ' --region <us-west-2> --key_name <xyz> --security_group <abc>')
        sys.exit(2)

    print("Launching cluster with arguments:")
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
            KEY_NAME = arg

        if opt == "--security_group":
            SECURITY_GROUPS = [arg]

    # Creating the cluster
    conn = create_connection(region=REGION)
    reservation = conn.run_instances(image_id=IMAGE_ID, min_count=COUNT,
                                     max_count=COUNT, key_name=KEY_NAME,
                                     security_groups=SECURITY_GROUPS,
                                     instance_type=INSTANCE_TYPE)

    cluster_info = add_name_tags(reservation, CLUSTER_NAME, cluster_structure)
    cluster_config_check(cluster_info)
    print_master_slave_setup(cluster_info)


if __name__ == '__main__':
    main(sys.argv[1:])
