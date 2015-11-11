import os


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ANSIBLE_DIR = BASE_DIR + "/../Ansible/playbooks/"
MASTER_INV_FILE = ANSIBLE_DIR + "master_inventory"
SLAVE_INV_FILE = ANSIBLE_DIR + "slave_inventory"
MASTER_SH = ANSIBLE_DIR + "master.sh"
SLAVE_SH = ANSIBLE_DIR + "slave.sh"


def deleteContent(pfile):
    pfile.seek(0)
    pfile.truncate()


def main():
    with open(MASTER_INV_FILE, 'w') as pfile:
        deleteContent(pfile)

    with open(SLAVE_INV_FILE, 'w') as pfile:
        deleteContent(pfile)

    with open(MASTER_SH, 'w') as pfile:
        deleteContent(pfile)

    with open(SLAVE_SH, 'w') as pfile:
        deleteContent(pfile)


if __name__ == "__main__":
    main()
