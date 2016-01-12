/* jshint node: true */

/*
	1.11.2016
	@jroseman
*/

//  Emits a storeId with its name.
//  e.g. 20051 , Tufts University

var child_process = require('child_process');
var request = require('request');
var codes = require(__dirname+'/../../ops/data/codes').codes;

// 1.11.2016
/*
	@jroseman
	Get the URL object from the Casper script.
	Parse out the storeIds from the "neat" URLs with request.
	Emit pairs as they're decoded.
*/
exports.emitStoreIds = function (verbose, eventEmitter) {
	var pathToScript = __dirname + '/../../ops/casper/getNeatStoreURLs.casper.js';
	child_process.exec('casperjs ' + pathToScript, function (err, stdout, stderr){
		if (err) {
			if (verbose) {
				console.log('FAIL to call getNeatStoreURLs CasperJS script.');
			}
		}

		// Get the full stdout from the Casper script.
		var storeNodes = JSON.parse(stdout);
		[].map.call(storeNodes, function(node) {
			
			// Split the "neat" URL from the name of the college
			var url = node.split(',')[0];
			var name = node.split(',')[1];
			
			// Parse out the storeId by following the redirect on the 
			// "neat" URL and then parsing the queries.
			var storeId = request(url, function (err, response) {
				if (response &&
					response.request &&
					response.request.uri.query) {
					
					// Error case: storeId = -1
					var storeId = -1;
					var full = response.request.uri.query;

					// Query param looks like:
					//		...param=val&storeId=ID&param=val...
					var sidIndex = full.indexOf('storeId=');
					if (sidIndex != -1) {
						storeId = full.substr(sidIndex+'storeId='.length,full.length);
						storeId = parseInt(storeId.substr(0, storeId.indexOf('&')));
					}

					// Emit the key-value pairing to be used.
					// Only storeId pairings are emitted, unusable colleges are skipped.
					if (verbose) {
						console.log('SEND storeId '+storeId+' for '+name);
					}
					eventEmitter.emit('storeId-kv-pair', storeId, name, storeNodes.length);
					return storeId;
				} else {
					if (verbose) {
						console.log('FAIL to parse storeId for: ' + name);
					}
					// Need to emit so it can keep track
					eventEmitter.emit('storeId-kv-pair', codes['no-store'],'',storeNodes.length);
					return -1;
				}
			});
			return storeId + ',' + name;
		});
	});
};

// TEST this.emitStoreIds(true, null);
