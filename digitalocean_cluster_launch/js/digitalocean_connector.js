// Imports
var DIGITALOCEAN = require('dropletapi').Droplets;
var SETTINGS = require('./settings.js')
var request = require('request');

// Creating API tokens
var digitalocean = new DIGITALOCEAN(SETTINGS.token);

// locals
var cluster_name = "spark001"
var region = "nyc3"
var size = "512mb"
var image = "ubuntu-14-04-x64"
var backups = false
var ipv6 = false
var user_data = null
var private_networking = null
var count = 3

var ssh_json = {
    "name": SETTINGS.key_name,
    "public_key": SETTINGS.ssh_public_key
}

// Create Public SSH KEYS in digital ocean
function create_ssh_keys(json_data) {

    console.log(json_data)

    request({
        url: "https://api.digitalocean.com/v2/account/keys",
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
            "Authorization": "Bearer " + SETTINGS.token
        },
        json: json_data
    }, function(error, response, body) {
        if (!error || response.status_code == 200) {
            console.log(body);
        }
    })
}


function launch_cluster(count, cluster_name) {

    for (var i = 0; i < count; i++) {

        if (i === 0) {
            launch_instance(cluster_name + "-master")
        } else {
            launch_instance(cluster_name + "-slave")
        }

    }

}

function launch_instance(node_name) {

    var droplet_data = create_dictionary(node_name)
    digitalocean.createDroplet(droplet_data, function(error, result) {
        if (error) {
            console.log(error);
        } else {
            console.log(result);
        }
    });
}


function create_dictionary(node_name) {

    var newDropletData = {
        "name": node_name,
        "region": region,
        "size": size,
        "image": image,
        "ssh_keys": [1264010],
        "backups": backups,
        "ipv6": ipv6,
        "user_data": user_data,
        "private_networking": private_networking
    }

    return newDropletData
}
// Inserting SSH keys
//create_ssh_keys(ssh_json)

// Launching droplets cluster
launch_cluster(count, cluster_name)
