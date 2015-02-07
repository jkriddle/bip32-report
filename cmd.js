var bitcore = require('bitcore');
var Insight = require('bitcore-explorers').Insight;
var insight = new Insight();
var Promise = require("bluebird");
var Report = require("./lib/report");

// print process.argv
if (process.argv.length < 3) {
	console.log("ERROR: You must specify a BIP32 extended public key as an argument.\n" +
		"Example: \nnode app.js xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8");
	return;
}

var numDerivations = 10;
if (process.argv.length == 4) {
	numDerivations = process.argv[3];
	if (isNaN(numDerivations)) {
		console.log("ERROR: Second argument must be a number for how many derivations you would like to check..\n" +
			"Example to retrieve five derivations: \nnode app.js xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8 5");
		return;
	}
}

var xpub = process.argv[2];
var report = new Report();

console.log("Please wait, collecting addresses...");

report.run(xpub, numDerivations).then(function(response) {
	var total = 0,
		changeTotal = 0;

	console.log("---------------------------------------------------------------------");
	console.log("\t\t\tDERIVED ADDRESSES");
	console.log("---------------------------------------------------------------------");
	console.log("Derivation\tAddress\t\t\t\t\tBalance (BTC)");
	console.log("---------------------------------------------------------------------");
	for(var i = 0; i < response.addresses.length; i++) {
		console.log(i + "\t\t" + response.addresses[i].address + "\t" + response.addresses[i].balance);
		total += parseFloat(response.addresses[i].balance);
	}
	console.log("---------------------------------------------------------------------");
	console.log("Total\t\t\t\t\t\t\t" + total.toFixed(8));


	console.log("\n\n---------------------------------------------------------------------");
	console.log("\t\t\tCHANGE ADDRESSES");
	console.log("---------------------------------------------------------------------");
	console.log("Derivation\tAddress\t\t\t\t\tBalance (BTC)");
	console.log("---------------------------------------------------------------------");
	for(var i = 0; i < response.change.length; i++) {
		console.log(i + "\t\t" + response.change[i].address + "\t" + response.change[i].balance);
		changeTotal += parseFloat(response.change[i].balance);
	}
	console.log("---------------------------------------------------------------------");
	console.log("Total Change\t\t\t\t\t\t" + changeTotal.toFixed(8));

	console.log("\n---------------------------------------------------------------------");
	console.log("Grand Total\t\t\t\t\t\t" + (total + changeTotal).toFixed(8));
}).catch(function(e) {
	var msg = e.message;
	if (msg == undefined) msg = e;
	console.log("ERROR: " + msg);
});