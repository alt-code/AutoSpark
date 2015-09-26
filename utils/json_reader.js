var jsonfile = require('jsonfile');
var tweets = require('./tweets.json');

var json_arr = [];

for (var tweet_id in tweets) {
    json_arr.push(tweets[tweet_id]);
}

jsonfile.writeFile("out.json", json_arr);
