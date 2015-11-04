//Imports
var needle = require('needle')
var promise = require('promise')
var request = require('request')

// Taking command line arguments into node program
var args = process.argv.slice(2);
var cluster_name = args[0]
var do_token = args[1]

var req_headers = {
        "content-type": "application/json",
        "Authorization": "Bearer " + do_token
    }


function get_instances_by_name(clustername) {

	return new promise(function(resolve, reject) { 

        request({
	        url: "https://api.digitalocean.com/v2/droplets?page=1&per_page=1",
	        method: "GET",
	        headers: req_headers }, 
	        function(error, response, body) {

	            if (!error || response.status_code == 200) {
	                body_json = JSON.parse(body)
	                droplets = body_json["droplets"]

	                var droplet_ids = []
	                for (i in droplets) {

	                	droplet_ids.push(droplets[i]['id'])
	                }

	                console.log(droplet_ids);
	                resolve(droplet_ids)

	            }
        });

	//Promise ends
	});
}

var output = get_instances_by_name('spark');
output.then(function(){
	console.log("done")
})