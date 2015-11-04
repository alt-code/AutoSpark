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
	        url: "https://api.digitalocean.com/v2/droplets?page=1&per_page=100",
	        method: "GET",
	        headers: req_headers },
	        function(error, response, body) {

	            if (!error || response.status_code == 200) {
	                body_json = JSON.parse(body)
	                droplets = body_json["droplets"]

	                // Capturing id of droplets in the current tear down cluster
	                var droplet_ids = []
	                for (i in droplets) {

	                	droplet_id = droplets[i]['id']
	                	droplet_name = droplets[i]['name']

	                	if (droplet_name.indexOf(clustername) > -1 )
	                	{
		                	console.log("Node in the current cluster found - " + droplet_name)
		                	droplet_ids.push(droplets[i]['id'])
	                	}

	                }

	                resolve(droplet_ids)

	            }
        });

	//Promise ends
	});
}

var cluster_nodes = get_instances_by_name(cluster_name);
cluster_nodes.then(function(droplet_ids){

    console.log("Deleting cluster nodes")
    for (i in droplet_ids)
    {
        droplet_id = droplet_ids[i]

        request({
            url: "https://api.digitalocean.com/v2/droplets/" + droplet_id,
            method: "DELETE",
            headers: req_headers },
            function(error, response, body) {

                if (!error || response.status_code == 200) {
                    console.log("Delete successful")
                }
        });
    }
})
