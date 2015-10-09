// Imports
var DIGITALOCEAN = require('dropletapi').Droplets;
var SETTINGS = require('./settings.js')
var request = require('request');
var promise = require('promise')
var async = require('async-q')
var needle = require('needle')
var fs = require('fs')
    // Creating API tokens
var digitalocean = new DIGITALOCEAN(SETTINGS.token);

// locals
var cluster_mapping = {
    "masters": [],
    "slaves": []
}
var headers = {
    "content-type": "application/json",
    "Authorization": "Bearer " + SETTINGS.token
}

var node_names = []
var droplet_ids = []
var droplet_ips = []

// Taking command line arguments into node program
var args = process.argv.slice(2);

// Varying values
var cluster_name = args[0]
var count = parseInt(args[1])
var size = args[2]
var region = args[3]
var key_name = args[4]
var key_path = args[5]

console.log(cluster_name + ":" + count + ":" + size +
    ":" + region + ":" + key_name + ":" + key_path);

// var cluster_name = "sparktest"
// var region = "nyc3"
// var size = "512mb"
// var count = 3

// Parameters not to be modified typically
var image = "ubuntu-14-04-x64"
var backups = false
var ipv6 = false
var user_data = null
var private_networking = null


var ssh_json = {

    "name": SETTINGS.key_name,
    "public_key": SETTINGS.ssh_public_key
}

var new_droplet = {
        getIP: function(droplet_id, onResponse) {
            needle.get("https://api.digitalocean.com/v2/droplets/" + droplet_id, {
                headers: headers
            }, onResponse)
        }
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
                    // console.log(body_json["ssh_keys"]);
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

function get_ssh_key_id(key_name) {

    return new promise(function(resolve, reject) {

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
                for (var i = 0; i < ssh_key_arr.length; i++) {
                    ssh_key_blob = ssh_key_arr[i]
                    if (ssh_key_blob["name"] === key_name) {
                        resolve(ssh_key_blob["id"])
                    }
                }
            }
        })
    })
}

function create_ssh_keys(json_data) {

    console.log("Attempting SSH_KEY Creation...")
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

function wait_for_ip(id, filename) {

    var interval = setInterval(function() {
        new_droplet.getIP(id, function(error, response) {
            var data = response.body;

            if (data.droplet.networks.v4.length > 0) {
                console.log("Data networks:", data.droplet.networks.v4[0].ip_address)
                var ipAddress = data.droplet.networks.v4[0].ip_address
                fs.appendFileSync('../../Ansible/playbooks/' + filename, ipAddress + "\n")
                clearInterval(interval);
            }

        });
    }, 1000);

}

function create_dictionary(node_name, ssh_key_number) {

    var newDropletData = {
        "name": node_name,
        "region": region,
        "size": size,
        "image": image,
        "ssh_keys": [ssh_key_number],
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

    // if ssh key is not present create
    if (ssh_key_present === false) {
        console.log("Warning: SSH_KEY not found on digital Ocean")
        create_ssh_keys(ssh_json)
        console.log("Success: SSH_KEY creation done")
    }

    var ssh_id = get_ssh_key_id(ssh_json["name"])
    ssh_id.then(function(ssh_key_number) {

        // Print ssh key id being used
        console.log("Info: Key to be used = " + ssh_key_number)
        console.log("Launching Cluster...")

        // Constructing an array of names
        if (count > 0) {
            node_names.push(cluster_name + "-master")

            for (var i = 0; i < count - 1; i++) {
                num = i + 1
                node_names.push(cluster_name + "-slave-" + num)
            }
        }

        // for each node name call launch_instance
        var names_resolved = async.each(node_names, function(item) {

            return new promise(function(resolve, reject) {
                var droplet_data = create_dictionary(item, ssh_key_number)
                needle.post("https://api.digitalocean.com/v2/droplets", droplet_data, {
                    headers: headers,
                    json: true
                }, function(request, response) {

                    // Log response body
                    console.log(response.body)

                    // push the ID into an array
                    droplet_id = response.body.droplet.id
                    droplet_name = response.body.droplet.name

                    droplet_ids.push(droplet_id)

                    if (droplet_name.indexOf("master") > 0) {
                        cluster_mapping["masters"].push(droplet_id)
                    } else {
                        cluster_mapping["slaves"].push(droplet_id)
                    }
                    // Wait for IP to be assigned
                    resolve()
                });

            });
        })

        names_resolved.then(function() {
            console.log(droplet_ids)
            console.log(cluster_mapping)

            //Opening master_inventory file

            fs.writeFileSync('../../Ansible/playbooks/master_inventory', "[sparknodes]\n");

            // Extract master IP
            for (var i = 0; i < cluster_mapping["masters"].length; i++) {

                master_id = cluster_mapping["masters"][i]

                // Wait for Ip to get Assigned
                wait_for_ip(master_id, "master_inventory")
            }

            // Extract slave IP

            //Opening master_inventory file
            fs.writeFileSync('../../Ansible/playbooks/slave_inventory', "[sparknodes]\n");

            for (var j = 0; j < cluster_mapping["slaves"].length; j++) {

                slave_id = cluster_mapping["slaves"][j]

                // Wait for IP to get assigned
                wait_for_ip(slave_id, "slave_inventory")
            }
        })

    })


})
