var restify = require('restify');
var RETS = require('rets.js');
var util = require('util');
var debug = require('debug')('rets-test');

var server = restify.createServer({
  name: 'rets-test',
  version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

var rets = new RETS({
    url: 'http://xxxxxxxxxx@sef.rets.interealty.com/Login.asmx/Login',
    ua: {
        name: 'xxxxxxx',
        pass: 'xxxxxxx'
    },
    version: 'RETS/1.7.2'
});

server.get('/rets/properties', function (req, res) {
    var params = {
        SearchType: 'Property',
        Class: 'ResidentialProperty',
        Query: req.params.query || '(ListingStatus=A),(61=DADE)',
        Format: 'COMPACT-DECODED',
        Limit: req.params.limit || 10,
        objectMode: true,
        format: 'objects'
    };

  	var properties = [];
    
    debug("Search params: \n%s", util.inspect(params, {colors: true}));

    rets
    .on('search', function(err, search){
    	rets.removeAllListeners('search');
    	debug('search complete');
    	res.send(200, properties);
    }).search(params)
    .on('data', function(listing){
    	properties.push(listing);
    });
});

rets.on('login',function(err, res){
	debug('logged in');
	server.listen(8090, function () {
	  console.log('%s listening at %s', server.name, server.url);
	});
}).login();

