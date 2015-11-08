import os
import socket
import subprocess
import sys
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
AWS_LAUNCHER_DIR = BASE_DIR + "/../connector/aws/"
ANSIBLE_DIR = BASE_DIR + "/../Ansible/playbooks/"


def install_packages(filename):

    with open(filename) as req_file:
        for package in req_file.readlines():
            if package != "\n":
                cmd = 'sudo pip install {0}'
                cmd_fmt = cmd.format(package)
                subprocess.call(cmd_fmt, shell=True)


def execute(command):
    print("Executing Command" + command)
    subprocess.Popen(command, stdout=subprocess.PIPE, shell=True).communicate()
    # popen = subprocess.Popen(command, stdout=subprocess.PIPE, shell=True)
    # lines_iterator = iter(popen.stdout.readline, b"")
    # for line in lines_iterator:
    #     print(line)


def launch(args):
    # Moving to the AWS Launcher dir
    os.chdir(AWS_LAUNCHER_DIR)

    # Printing the current dir
    print(os.getcwd())

    # Installing all packages
    install_packages("requirements.txt")

    # Getting the IP Address of machine
    ip_addr = socket.gethostbyname(socket.gethostname())
    print("IP Address: " + ip_addr)

    # Setting key name to ipaddress & location

    key_name = ip_addr
    region = "us-west-2"
    name = args[0]
    count = args[1]
    type = args[2]
    key_path = args[3]
    aws_access_key = args[4]
    aws_secret_key = args[5]
    ssh_pub_key_path = args[6]

    # Running python command
    cmd_format = "python ec2_connector.py --name {0} --count {1} --type {2} --key_path {3} --region {4} --key_name {5} --aws_access_key {6} --aws_secret_key {7} --ssh_pub_key_path {8}"
    command = cmd_format.format(name, count, type,
                                key_path, region, key_name,
                                aws_access_key, aws_secret_key, ssh_pub_key_path)

    execute(command)
    # subprocess.call(command, shell=True)

    # Wait for instance to be ssh ready
    print("Waiting for ec2 instances to be ready for ssh")
    time.sleep(250)

    # Move to ansible directory
    os.chdir(ANSIBLE_DIR)

    # Setting the shell to ignore ssh check
    # subprocess.call("export ANSIBLE_HOST_KEY_CHECKING=False", shell=True)

    print("Executing master.sh")
    cmd = "sudo ./master.sh"
    execute(cmd)
    # subprocess.call("sudo ./master.sh", shell=True)

    print("Executing slave.sh")
    cmd = "sudo ./slave.sh"
    execute(cmd)
    # subprocess.call("sudo ./slave.sh", shell=True)

if __name__ == '__main__':
    sys.exit(launch(sys.argv[1:]))
