import boto.ec2
import settings

# Globals
ACCESS_KEY = settings.ACCESS_KEY
SECRET_KEY = settings.SECRET_KEY
cluster_structure = {"masters":[], "slaves":[]}

#To be converted to user input later
region = "us-west-2"	
count = 3
image_id = "ami-5189a661"
key_name = "spark_cluster_manager"
security_groups = ["spark_cluster"]
cluster_name = "spark002"
instance_type = "t2.micro"


def create_connection(region):
	conn = boto.ec2.connect_to_region(region,
									  aws_access_key_id=ACCESS_KEY,
									  aws_secret_access_key=SECRET_KEY)
	return conn


def add_name_tags(reservation, cluster_structure):
	
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
		print("Success: "+str(len(cluster_info['slaves']))+" slaves created")


def print_master_slave_setup(cluster_info):

	print("========= Cluster Configuration =========")
	
	print("Masters:")
	for master in cluster_info['masters']:
		print(master)

	print("Slaves:")
	for slave in cluster_info['slaves']:
		print(slave)

	print("=============== End ==================")


def main():

	conn = create_connection(region=region)
	reservation = conn.run_instances(image_id=image_id, min_count=count, max_count=count, 
						   	     	 key_name=key_name, security_groups=security_groups, 
				                	 instance_type=instance_type)
	cluster_info = add_name_tags(reservation, cluster_structure)
	cluster_config_check(cluster_info)
	print_master_slave_setup(cluster_info)


if __name__ == '__main__':
	main()
