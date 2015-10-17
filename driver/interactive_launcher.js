var prompt= require('prompt');
var exec = require('child_process').exec;
var sys = require('sys')

// Changing directory to the script directory
try {
    
    // Get current dir
    base_dir = process.cwd()
	console.log('Current directory: ' + process.cwd());

    // Navigate to scripts directory
    process.chdir(base_dir + '/../scripts/');
    console.log('Scripts directory: ' + process.cwd());
}
catch (err) {
    console.log('chdir: ' + err);
}

// Output for shell command execution
function puts(error, stdout, stderr) { sys.puts(stdout) }


function command_executor(cmd) {

	console.log('Executing :' + cmd);
	var proc = exec(cmd, puts);
	proc.stdout.on('data', function(data) {
	console.log(data); 
	});
}

// Starting a new prompt
prompt.start()


console.log('####################################');
console.log('##     Welcome to AutoSpark       ##');
console.log('####################################');

console.log('Enter provider: AWS to DigitalOcean');

prompt.get(['provider'], function (err, result) {
 
 	provider = result.provider
    if (provider != 'aws' && provider != 'digitalocean') {
 		console.log('Incorrect provider selected. Exiting process');
 		process.exit(1);
 	}

	console.log('  provider :- ' + result.provider);

    console.log('Cluster size - small /medium / large / custom');
    console.log('Cluster Name - User selected name for cluster identification');
	console.log('Path to ssh key pair to access the cluster');
	prompt.get(['size', 'name', 'key_path'], function (err, result) {
		size = result.size
		name = result.name
		ssh_key_path = result.key_path

		console.log('size :- ' + size);
		console.log('name :- ' + name);
		console.log('ssh_key_path :- ' + ssh_key_path);

        if( size && name && ssh_key_path) {
        	if(size === 'custom') {
        		prompt.get(['ram'], function (err, result) {
				ram = result.ram

				if(provider === 'aws') {
					console.log ('aws')
				}
				else if( provider === 'digitalocean') {
					console.log('do')
				}

        		})
        	}
        	else if (size === 'small') {

				if(provider === 'aws') {
					cmd = 'sudo ./launch_spark_on_aws.sh ' + name + ' 4 t2.small '+ssh_key_path;
					command_executor(cmd)
				}
				else if( provider === 'digitalocean') {
					console.log('do')
				}
        	}
        	else if (size === 'medium') {

				if(provider === 'aws') {
					cmd = 'sudo ./launch_spark_on_aws.sh ' + name + ' 4 t2.medium '+ssh_key_path;
					command_executor(cmd)
				}
				else if( provider === 'digitalocean') {
					console.log('do')
				}
        	}
        	else if (size === 'large') {

				if(provider === 'aws') {
					cmd = 'sudo ./launch_spark_on_aws.sh ' + name + ' 4 t2.large '+ssh_key_path;
					command_executor(cmd)
				}
				else if( provider === 'digitalocean') {
					console.log('do')
				}
        	}
        }

    });

});