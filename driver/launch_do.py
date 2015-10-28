import os
import socket
import subprocess
import sys
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DO_LAUNCH_DIR = BASE_DIR + "/../connector/digital_ocean/"
ANSIBLE_DIR = BASE_DIR + "/../Ansible/playbooks/"


def launch(args):
    # Moving to the Digital Ocean Launcher dir
    os.chdir(DO_LAUNCH_DIR)

    # Printing the current dir
    print(os.getcwd())

    # Installing all packages
    subprocess.call("npm install", shell=True)

    # Getting the IP Address of machine
    ip_addr = socket.gethostbyname(socket.gethostname())
    print("IP Address: " + ip_addr)

    # Setting key name to ipaddress & location
    key_name = ip_addr
    region = "nyc3"
    name = args[0]
    count = args[1]
    size = args[2]
    key_path = args[3]

    # Running python command
    cmd_format = "sudo node digitalocean_connector.js {0} {1} {2} {3} {4} {5}"
    command = cmd_format.format(name, count, size, region, key_name, key_path)
    print("Executing Command" + command)

    subprocess.call(command, shell=True)
    subprocess.call("sudo node create_shell_scripts.js", shell=True)

    # Wait for instance to be ssh ready
    print("Waiting for digital ocean instances to be ready for ssh")
    time.sleep(200)

    # Move to ansible directory
    os.chdir(ANSIBLE_DIR)

    # Setting the shell to ignore ssh check
    subprocess.call("export ANSIBLE_HOST_KEY_CHECKING=False", shell=True)

    print("Executing master.sh")
    subprocess.call("sudo ./master.sh", shell=True)

    print("Executing slave.sh")
    subprocess.call("sudo ./slave.sh", shell=True)

if __name__ == '__main__':
    sys.exit(launch(sys.argv[1:]))
