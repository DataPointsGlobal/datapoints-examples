// Use blockr.io to fetch a balance of a bitcoin address

var request = require('request');
var getConfig = require('../lib/config');
var DataPoints = require('datapoints');

var config = getConfig('../config/datapoints');

var client = new DataPoints(config.datapoints);

var list = [];

function update() {

	if(!list.length)
		list = config.bitcoin_addresses.concat();

	var address = list.shift();

	request({ 
		uri: "http://btc.blockr.io/api/v1/address/info/"+address,
		json : true
	}, function(err, response, data) {
		if(err) {
			console.log(err);
			return setTimeout(update, 60 * 1000);
		}

		var balance = data.data.balance;

		var items = [{
			name : 'BTC-'+address.substring(0,6),
			value : client.format.currency(balance)
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