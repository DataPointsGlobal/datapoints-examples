// Copyright (c) 2016 Data Points Inc.
// All Rights Reserved.

var os = require('os');
var fs = require('fs');
var colors = require('colors');
var _ = require('underscore');

function merge(dst, src) {
    _.each(src, function(v, k) {
        if(_.isArray(v)) { dst[k] = [ ]; merge(dst[k], v); }
        else if(_.isObject(v)) { if(!dst[k] || _.isString(dst[k]) || !_.isObject(dst[k])) dst[k] = { };  merge(dst[k], v); }
        else { if(_.isArray(src)) dst.push(v); else dst[k] = v; }
    })
}
function getConfig(name) {

    var filename = name+'.conf';
    var host_filename = name+'.'+os.hostname()+'.conf';
    var local_filename = name+'.local.conf';

    var data = [ ]; // undefined;

    fs.existsSync(filename) && data.push(fs.readFileSync(filename) || null);
    fs.existsSync(host_filename) && data.push(fs.readFileSync(host_filename) || null);
    fs.existsSync(local_filename) && data.push(fs.readFileSync(local_filename) || null);

    if(!data[0] && !data[1]) {
        console.error("Unable to read config file: "+(filename+'').magenta.bold);
        throw new Error("Unable to read config file: "+(filename+''));
    }

    var o = { }
    _.each(data, function(conf) {
        if(!conf || !conf.toString('utf-8').length)
            return;
        var layer = eval('('+conf.toString('utf-8')+')');
        merge(o, layer);
    })

    return o;
}

module.exports = getConfig;