// Imports
var DIGITALOCEAN = require('dropletapi').Droplets;
var SETTINGS = require('./settings.js')
var request = require('request');

// Creating API tokens
var digitalocean = new DIGITALOCEAN(SETTINGS.token);

// locals
var name = "spark001"
var region = "nyc3"
var size = "512mb"
var image = "ubuntu-14-04-x64"
var backups = false
var ipv6 = false
var user_data = null
var private_networking = null

var newDroplet = {
    "name": name,
    "region": region,
    "size": size,
    "image": image,
    "ssh_keys": [SETTINGS.key_name],
    "backups": backups,
    "ipv6": ipv6,
    "user_data": user_data,
    "private_networking": private_networking
}

var ssh_json = {
    "name": SETTINGS.key_name,
    "public_key": SETTINGS.ssh_public_key
}

// Create Public SSH KEYS in digital ocean
function create_ssh_keys(json_data) {

    // Set the headers
    var headers = {
        'Authorization': 'Bearer '+ SETTINGS.token,
        'Content-Type': 'application/json'
    }

    // Configure the request
    var options = {
        method: 'POST',
        headers: headers,
        body: json_data
    }

    // Start the request
    request('https://api.digitalocean.com/v2/account/keys', options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            console.log(body)
        }

        console.log(error);
    })
}

// Inserting SSH keys
create_ssh_keys(ssh_json)

// Launching droplet
/*
digitalocean.createDroplet(newDroplet, function(error, result) {
    if (error) {
        console.log(error);
    } else {
        console.log(result);
    }
});
*/
