var prompt= require('prompt');
var exec = require('child_process').exec;
var sys = require('sys')

// Changing directory to the script directory
try {

    // Getting the file directory
    base_dir = __dirname

    // Navigate to driver directory
    process.chdir(base_dir)
    console.log('Current directory: ' + process.cwd());

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
					console.log ('Custom AWS')
					prompt.get(['count', 'aws_type'], function (err, result) {
						count = result.count
						type = result.aws_type
						cmd = 'python launch_aws.py ' + name + ' ' + count + ' ' + type + ' ' + ssh_key_path;
						command_executor(cmd)

					})
				}
				else if( provider === 'digitalocean') {
					console.log ('Custom Digital Ocean')
					prompt.get(['count', 'do_type'], function (err, result) {
						count = result.count
						type = result.do_type
						cmd = 'sudo ./launch_spark_on_do.sh ' + name + ' ' + count + ' ' + type + ' ' + ssh_key_path;
						command_executor(cmd)

					})
				}

        		})
        	}
        	else if (size === 'small') {

				if(provider === 'aws') {
					cmd = 'python launch_aws.py ' + name + ' 4 t2.small '+ ssh_key_path;
					command_executor(cmd)
				}
				else if( provider === 'digitalocean') {
					cmd = 'sudo ./launch_spark_on_do.sh ' + name + ' 4 512mb '+ssh_key_path;
					command_executor(cmd)
				}
        	}
        	else if (size === 'medium') {

				if(provider === 'aws') {
					cmd = 'python launch_aws.py ' + name + ' 4 t2.medium '+ssh_key_path;
					command_executor(cmd)
				}
				else if( provider === 'digitalocean') {
					cmd = 'python launch_aws.py ' + name + ' 4 1gb '+ssh_key_path;
					command_executor(cmd)
				}
        	}
        	else if (size === 'large') {

				if(provider === 'aws') {
					cmd = 'python launch_aws.py ' + name + ' 4 t2.large '+ssh_key_path;
					command_executor(cmd)
				}
				else if( provider === 'digitalocean') {
					cmd = 'sudo ./launch_spark_on_do.sh ' + name + ' 4 2gb '+ssh_key_path;
					command_executor(cmd)
				}
        	}
        }

    });

});
