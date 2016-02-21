var request = require('request');
var getConfig = require('../lib/config');
var DataPoints = require('datapoints');

var config = getConfig('../config/datapoints');

var client = new DataPoints(config.datapoints);

var LTC_PER_DAY = 25 * (24 * 60 / 2.5);

function update() {

	request({ 
		uri: "https://www.litecoinpool.org/api?api_key="+config.litecoinpool.api_key,
		json : true
	}, function(err, response, data) {
		if(err) {
			return callback({ error : "Unable to fetch pool data" });
		}

		var items = [{
			name : 'LTC HASH RATE',
			value : client.format.hashrate(data.user.hash_rate)// * Math.pow(2,32))
		}, {
			name : 'LTC PENDING',
			value : client.format.currency(data.user.unpaid_rewards, { prec : 4 })
		}, {
			name : 'LTC NETWORK RATE',
			value : client.format.hashrate(data.network.hash_rate)// * Math.pow(2,32))
		}, {
			name : 'LTC ESTIMATE',
			value : client.format.currency((data.user.hash_rate / data.network.hash_rate) * LTC_PER_DAY)
		}]
		
		console.log(items);

		client.set(items, function(err) {
			if(err)
				console.log("Error:",err);
			
			setTimeout(update, 60 * 1000);
		})



	});



}

update();