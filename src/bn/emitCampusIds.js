/* jshint node: true */

/*
	1.11.2016
	@jroseman
*/

//  Given a storeId...
//  Emits a campusId with its name
//  e.g. 19956950 , Tufts University Health Sciences

var jsdom = require('jsdom');
var sc = require(__dirname+'/../../ops/data/URLs').siteConstructor;
var codes = require(__dirname+'/../../ops/data/codes').codes;

exports.emitCampusIds = function (verbose, eventEmitter, storeId, storeName) {

	// Construct the store URL for this store.
	var url = sc(storeId);

	jsdom.env(
		url,
		['http://code.jquery.com/jquery.js'],
		function (err, window) {
			if (err || !window.$) {
				if (verbose) {
					console.log('FAIL to parse campusId for '+storeName);
					console.error(err);
				}
			} else {

				// Grab each DOM node for every campus option, contains
				// campus name and campus ID.
				var nodes = window.$('.campusSectionHeader .bncbOptionItem');
				var campusIdsObj = {};

				// If there isn't a campus selection for a store/college,
				// This list will be empty. Emit the no-campus code (-1)
				if (nodes.length === 0) {
					if (verbose) {
						console.log('SEND campusId '+codes['no-campus']);
					}
					eventEmitter.emit('campusId-kv-pair', storeId, codes['no-campus'], '', nodes.length);
				}

				// Over all campus DOM nodes..
				[].map.call(nodes, function (node) {
					// Parse out the campusId and campus name
					var id = node.getAttribute('data-optionvalue');
					var name = node.innerHTML;
					if (verbose) {
						console.log('SEND campusId '+id+' for '+name);
					}
					eventEmitter.emit('campusId-kv-pair', storeId, id, name, nodes.length);
					return id + ',' + name;
				});
			}
		}
	);
};

// TEST this.emitCampusIds(true, null, 20051, 'Tufts University');
