var request = require('request');
var getConfig = require('../lib/config');
var DataPoints = require('datapoints');

var config = getConfig('../config/datapoints');

var client = new DataPoints(config.datapoints);

function update() {

	var items = [{
		name : 'RANDOM A',
		value : Math.random()
	}, {
		name : 'RANDOM B',
		value : Math.random()
	}, {
		name : 'RANDOM C',
		value : Math.random()
	}]

	console.log("setting vars",items);

	client.set(items, function(err) {
		if(err)
			console.log("Error:",err);
		
		setTimeout(update, 60 * 1000);
	})

}

update();