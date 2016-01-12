/* jshint node: true */

// 1.11.2016
// @jroseman

// Get an object mapping "neat" URLs to college names.

var casper = require('casper').create({
    loadImages: false,
    loadPlugins: false,
    verbose: true,
    pageSettings: {
        javascriptEnabled: true,
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/536.5 (KHTML, like Gecko) Chrome/19.0.1084.9 Safari/536.5'
    }
});

var collegeList = [];
var url = "http://www.bncollege.com/page-campus-stores";

casper.start(url);

// 1.11.2016
/*
    Currently, the BN store list page works with an
    empty search. We hit the search button, and it 
    returns all stores (stores are colleges).
*/
casper.waitForSelector('#btnSearchSchool', function() {
    this.click('#btnSearchSchool');
});

// 1.11.2016
/*
    We retrieve all of the school DOM nodes, and convert
    them into a list of their "neat" URLs (which redirect)
    and the name of the college.
    
    e.g.
    'http://adelphi.bncollege.com/,Adelphi University'
*/
casper.waitForSelector('#schools', function() {
    collegeList = casper.evaluate(function () {
        var nodes = document.querySelectorAll('#schools li a');
        return [].map.call(nodes, function(node) {
            return node.href + ',' + node.innerHTML;
        });
    });
});

// 1.11.2016
/*
    Print out the list in a JSON-valid way, to be picked up
    by an outside script.
*/
casper.then(function () {
    console.log('[');
    for (var i=0; i<collegeList.length-2; i++) {
        console.log('"'+collegeList[i]+'",');
    }
    console.log('"'+collegeList[collegeList.length-1]+'"]');
});

casper.run();