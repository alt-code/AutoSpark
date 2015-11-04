import boto.ec2
import sys

# Globals
REGION = 'us-west-2'


def create_connection(region, access_key, secret_key):
    conn = boto.ec2.connect_to_region(region,
                                      aws_access_key_id=access_key,
                                      aws_secret_access_key=secret_key)

    return conn


def main(args):
    cluster_name = args[0]
    aws_access_key = args[1]
    aws_secret_key = args[2]
    conn = create_connection(REGION, aws_access_key, aws_secret_key)
    reservations = conn.get_all_reservations()

    terminate_arr = []
    for reservation in reservations:
        for instance in reservation.instances:
            name = instance.tags['Name']

            if cluster_name in name:
                terminate_arr.append(str(instance.id))

    # terminate the instances
    print("Terminating the instances with id:")
    print(terminate_arr)
    conn.terminate_instances(instance_ids=terminate_arr)


if __name__ == '__main__':
    main(sys.argv[1:])
