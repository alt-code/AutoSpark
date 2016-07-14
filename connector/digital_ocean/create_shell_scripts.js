var fs = require("fs")

var text = fs.readFileSync("../../Ansible/playbooks/master_inventory").toString()
var text_parts = text.split("\n")
var ipAddress = text_parts[1].split(" ")[0]

console.log("Info: IP Address of Master " + ipAddress)
console.log("Info: Spark Master at spark://" + ipAddress + ":7077")

fs.writeFileSync("../../Ansible/playbooks/master.sh",
                 "ansible-playbook -e 'host_key_checking=False' -s --extra-vars \'MASTER_YES=\"true\" USER=\"root\" SPARK_URL=\"\" MASTER_IP=\""+ipAddress+"\"\' sparkplaybook.yml -i master_inventory\n")

fs.writeFileSync("../../Ansible/playbooks/slave.sh",
                 "ansible-playbook -e 'host_key_checking=False' -s --extra-vars \'MASTER_YES=\"false\" USER=\"root\" SPARK_URL=\"spark://"+ipAddress+":7077\" MASTER_IP=\"\"\' sparkplaybook.yml -i slave_inventory\n")
