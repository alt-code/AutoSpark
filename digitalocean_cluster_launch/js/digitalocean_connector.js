// Imports
var DIGITALOCEAN = require('dropletapi').Droplets;
var SETTINGS = require('./settings.js')
var request = require('request');
var promise = require('promise')

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

function check_ssh_key(ssh_json) {

    return new promise(function(resolve, reject) {

        var ssh_key_arr = []

        request({
            url: "https://api.digitalocean.com/v2/account/keys",
            method: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + SETTINGS.token
            },
        }, function(error, response, body) {
            if (!error || response.status_code == 200) {
                body_json = JSON.parse(body)
                ssh_key_arr = body_json["ssh_keys"]
                var bool_found_key = check_for_key(ssh_json, ssh_key_arr)
                console.log(body_json["ssh_keys"]);
                resolve(bool_found_key)

            }
        })
    })
}

function check_for_key(ssh_json, ssh_key_arr) {
    check_for_name = ssh_json["name"]
    check_public_key = ssh_json["public_key"]
    found_key = false
    error = false

    for (var i = 0; i < ssh_key_arr.length; i++) {
        ssh_key_blob = ssh_key_arr[i]
        if (ssh_key_blob["name"] === check_for_name) {
            if (ssh_key_blob["public_key"] === check_public_key) {
                found_key = true
                error = false
            } else {
                console.log("Error: Key with the name " + check_for_name + " exists ; But the public_key doesnot match")
                console.log("Program Exit; Delete the old key first")
                found_key = false
                error = true
            }
        }
    }

    if (found_key === false && error === false) {
        for (var i = 0; i < ssh_key_arr.length; i++) {
            ssh_key_blob = ssh_key_arr[i]
            if (ssh_key_blob["public_key"] === check_public_key) {
                console.log("Error: Same public_key found in " + ssh_key_blob["name"] + " key_name")
                found_key = false
                error = true
            }
        }
    }

    if (found_key === true && error === false) {
        return true
    } else if (error) {
        return null
    } else {
        return false
    }

}



function create_ssh_keys(json_data) {

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
var key_promise = check_ssh_key(ssh_json)
key_promise.then(function(ssh_key_present) {
    console.log(ssh_key_present)
    if (ssh_key_present === false) {
        create_ssh_keys(ssh_json)
    }

})

// Launching droplets cluster
//launch_cluster(count, cluster_name)
