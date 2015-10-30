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

    // Accept digital ocean and AWS tokens here
    if (provider === "digitalocean") {

        var digitalocean_token = ""
        prompt.get(['digitalocean_token'], function(err, result) {
            digitalocean_token = result.digitalocean_token
            if (digitalocean_token === "") {
                process.exit(1)
            }

            // Get other parameters for the spark_cluster
            keys = [digitalocean_token]
            get_spark_cluster_params(provider, keys)

        });
    } else if (provider === "aws") {

        prompt.get(['aws_access_key', 'aws_secret_key'], function(err, result) {
            aws_access_key = result.aws_access_key
            aws_secret_key = result.aws_secret_key
            if (aws_access_key === "" || aws_secret_key === "" ) {
                process.exit(1)
            }

            // Get other spark parameters for the cluster
            keys = [aws_access_key, aws_secret_key]
            get_spark_cluster_params(provider, keys)
        });
    }
});

function get_spark_cluster_params(provider, keys) {

    // Getting the auth keys for aws and DO
    if (provider === "aws") {

        aws_access_key = keys[0]
        aws_secret_key = keys[1]

    } else if (provider === "digitalocean") {

        digitalocean_token = keys[0]
    }

    // Accepting input size and name and ssh key pair
    console.log('\n')
    console.log('Cluster size - small /medium / large / custom');
    console.log('Cluster Name - User selected name for cluster identification');
    console.log('Path to ssh key pair to access the cluster');
    console.log('\n')

    prompt.get(['size', 'name', 'key_path'], function (err, result) {

        size = result.size
        name = result.name
        ssh_key_path = result.key_path

        console.log('size :- ' + size);
        console.log('name :- ' + name);
        console.log('ssh_key_path :- ' + ssh_key_path);

        if( size && name && ssh_key_path) {

            if(size === 'custom') {

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
                        cmd = 'python launch_do.py ' + name + ' ' + count + ' ' + type + ' ' + ssh_key_path + ' ' + digitalocean_token;
                        command_executor(cmd)

                    })
                }

            } else if (size === 'small') {

                if(provider === 'aws') {
                    cmd = 'python launch_aws.py ' + name + ' 4 t2.small ' + ssh_key_path;
                    command_executor(cmd)
                }
                else if( provider === 'digitalocean') {
                    cmd = 'python launch_do.py ' + name + ' 4 512mb ' + ssh_key_path + ' ' + digitalocean_token;
                    command_executor(cmd)
                }
            } else if (size === 'medium') {

                if(provider === 'aws') {
                    cmd = 'python launch_aws.py ' + name + ' 4 t2.medium ' + ssh_key_path;
                    command_executor(cmd)
                }
                else if( provider === 'digitalocean') {
                    cmd = 'python launch_do.py ' + name + ' 4 1gb ' + ssh_key_path + ' ' + digitalocean_token;
                    command_executor(cmd)
                }
            } else if (size === 'large') {

                if(provider === 'aws') {
                    cmd = 'python launch_aws.py ' + name + ' 4 t2.large ' + ssh_key_path;
                    command_executor(cmd)
                }
                else if( provider === 'digitalocean') {
                    cmd = 'python launch_do.py ' + name + ' 4 2gb ' + ssh_key_path + ' ' + digitalocean_token;
                    command_executor(cmd)
                }
            }
        }

    });
}
