var bitcore = require('bitcore');
var Insight = require('bitcore-explorers').Insight;
var insight = new Insight();
var Promise = require("bluebird");

// print process.argv
process.argv[2];
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
var pubKey = null;
try {
	pubKey = bitcore.HDPublicKey(xpub);
} catch(ex) {
	console.log("ERROR: " + ex.message);
	return;
}

var response = {
	hdPublicKey : xpub,
	addresses : []
}

function getBalances() {
	return new Promise(function (resolve, reject) {

		var req = [];
		response.addresses.forEach(function (i, o) {
			req.push(i.address);
		});

        insight.getUnspentUtxos(req, function(err, utxos) {

			if (err) {
				reject(err);
			} else if (utxos) {
				for (var i = 0; i < utxos.length; i++) {
					for(var j = 0; j < response.addresses.length; j++) {
						if (utxos[i].address == response.addresses[j].address) {
							response.addresses[j].balance = bitcore.Unit.fromSatoshis(utxos[i].satoshis).toBTC().toFixed(8);
						}
					}
				}
			}
			
			resolve();
		});
    });
}

console.log("Please wait, collecting balances...");
var addresses = [];
for(var i = 0; i < numDerivations; i++) {
	var publicKey = pubKey.derive(0).derive(i).toObject().publicKey;
	var pk = new bitcore.PublicKey(publicKey);
    var address = pk.toAddress('livenet');
	response.addresses.push({
		address: address.toString(),
		balance : 0
	});
}
getBalances().then(function(item) {
	var total = 0;
	console.log("Derivation\tAddress\t\t\t\t\tBalance (BTC)");
	console.log("---------------------------------------------------------------------");
	for(var i = 0; i < response.addresses.length; i++) {
		console.log(i + "\t\t" + response.addresses[i].address + "\t" + response.addresses[i].balance);
		total += parseFloat(response.addresses[i].balance);
	}
	console.log("---------------------------------------------------------------------");
	console.log("Total\t\t\t\t\t\t\t" + total.toFixed(8));
}).catch(function(e) {
	console.log("ERROR: " + e.message);
});