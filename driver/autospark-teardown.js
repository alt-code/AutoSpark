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
console.log("##   Welcome to AutoSpark Tear Down    ##")
console.log('#########################################');

console.log('\n')
console.log("Select the provider - aws or digitalocean");
console.log("Provide a confirmation - yes or no")
console.log('\n')

prompt.get(['provider','confirmation'], function (err, result) {

    provider = result.provider
    confirmation = result.confirmation

    if(provider && confirmation) {

        // Gate for incorrect cluster wipe
        if (confirmation != 'yes'){
            process.exit(1)
        }

        // aws cluster tear down
        if (provider === 'aws') {

            console.log('Cluster Name - exact name of the cluster used during creation')
            prompt.get(['clustername', 'aws_access_key', 'aws_secret_key'], function(err, result) {

                name = result.clustername
                aws_access_key = result.aws_access_key
                aws_secret_key = result.aws_secret_key

                // move to the digitalocean connector dir
                cwd = process.cwd()
                dest = cwd + '/../connector/aws/'
                process.chdir(dest)
                console.log(process.cwd())

                // executing the tear down command
                cmd = "python teardown.py " + name + " " + aws_access_key + " " + aws_secret_key
                command_executor(cmd)
            })

        }

        // digital ocean cluster tear down
        if (provider === 'digitalocean') {

            console.log('Cluster Name - exact name of the cluster used during creation')
            prompt.get(['clustername', 'digitalocean_token'], function(err, result) {

                name = result.clustername
                token = result.digitalocean_token

                // move to the digitalocean connector dir
                cwd = process.cwd()
                dest = cwd + '/../connector/digital_ocean/'
                process.chdir(dest)
                console.log(process.cwd())

                // executing the tear down command
                cmd = "node teardown.js " + name + " " + token
                command_executor(cmd)
            })
        }
    }

})
