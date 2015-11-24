var prompt= require('prompt');
var exec = require('child_process').exec;
var sys = require('sys')
var fs = require('fs')

// Getting the file directory
BASE_DIR = __dirname
MASTER_INVENTORY = BASE_DIR + "/../Ansible/playbooks/master_inventory"
SLAVE_INVENTORY = BASE_DIR + "/../Ansible/playbooks/slave_inventory"

// Starting a new prompt
prompt.start()

// Command Executors
function puts(error, stdout, stderr) { sys.puts(stdout) }

function command_executor(cmd) {

	console.log('Executing :' + cmd);
	var proc = exec(cmd, puts);
	proc.stdout.on('data', function(data) {
	console.log(data);
	});
}

console.log('#########################################');
console.log('##     Welcome to AutoSpark Data Load   ##');
console.log('#########################################');
console.log('\n')
console.log('Enter provider: aws or digitalocean');
console.log('\n')

prompt.get(['provider', 'data_file_full_path','file_name_at_destination', 'ssh_private_key_path'], function (err, result) {

    provider = result.provider
    data_file_full_path = result.data_file_full_path
    file_name_at_destination = result.file_name_at_destination
    ssh_private_key_path = result.ssh_private_key_path

    if (data_file_full_path && file_name_at_destination) {

        var nodes_array = []
        var master_contents = fs.readFileSync(MASTER_INVENTORY, 'utf-8')
        var master_inv_parts = master_contents.split('\n')

        for (var i=1; i < master_inv_parts.length; i++) {

            if(master_inv_parts[i] != "") {
                nodes_array.push(master_inv_parts[i].split(" ")[0])
            }
        }


        var slave_contents = fs.readFileSync(SLAVE_INVENTORY, 'utf-8')
        var slave_inv_parts = slave_contents.split('\n')

        for (var i=1; i < slave_inv_parts.length; i++) {

            if(slave_inv_parts[i] != ""){
                nodes_array.push(slave_inv_parts[i].split(" ")[0])
            }
        }

        console.log("Saving data to the below nodes ")
        console.log(nodes_array)
        if(provider == 'aws'){

                for(var i=0; i < nodes_array.length; i++) {

                    ip_addr = nodes_array[i]
                    cmd = "scp -i " + ssh_private_key_path + " "+ data_file_full_path + " ubuntu@" + ip_addr + ":/home/ubuntu/" + file_name_at_destination
                    command_executor(cmd)
                }

        } else if (provider == 'digitalocean') {

                for(var i=0; i < nodes_array.length; i++) {

                    ip_addr = nodes_array[i]
                    cmd = "scp -i " + ssh_private_key_path + " "+ data_file_full_path + " root@" + ip_addr + ":/root/" + file_name_at_destination
                    command_executor(cmd)
                }

        }

    }

// Prompt ends
});
