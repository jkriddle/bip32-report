var bitcore = require('bitcore');
var Insight = require('bitcore-explorers').Insight;
var insight = new Insight();
var Promise = require("bluebird");

function getBalances(response) {
	return new Promise(function (resolve, reject) {

		var req = [];
		response.addresses.forEach(function (i, o) {
			req.push(i.address);
		});
		response.change.forEach(function (i, o) {
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
					for(var j = 0; j < response.change.length; j++) {
						if (utxos[i].address == response.change[j].address) {
							response.change[j].balance = bitcore.Unit.fromSatoshis(utxos[i].satoshis).toBTC().toFixed(8);
						}
					}
				}
			}
			
			resolve(response);
		});
    });
};

function Report() {

	this.run = function(xpub, numDerivations) {
		return new Promise(function(resolve, reject) {

			if (!xpub) {
				return reject("BIP32 public key is required.");
			}

			if (!numDerivations) {
				return reject("Invalid number of derivations.");
			}

			try {
				pubKey = bitcore.HDPublicKey(xpub);
			} catch(ex) {
				return reject("Invalid public key.");
			}

			var response = {
				pubKey : xpub,
				total : 0,
				addresses : [],
				change : []
			}

			var addresses = [];
			for(var i = 0; i < numDerivations; i++) {
				var publicKey = pubKey.derive(0).derive(i).toObject().publicKey;
				var pk = new bitcore.PublicKey(publicKey);
			    var address = pk.toAddress('livenet');
				response.addresses.push({
					address: address.toString(),
					balance : 0
				});

				publicKey = pubKey.derive(1).derive(i).toObject().publicKey;
				pk = new bitcore.PublicKey(publicKey);
			    address = pk.toAddress('livenet');
				response.change.push({
					address: address.toString(),
					balance : 0
				});
			}

			getBalances(response).then(function(data) {
				var total = 0,
					changeTotal = 0;
				for(var i = 0; i < data.addresses.length; i++) {
					total += parseFloat(data.addresses[i].balance);
				}
				for(var i = 0; i < data.change.length; i++) {
					changeTotal += parseFloat(data.change[i].balance);
				}
				data.total = (total + changeTotal).toFixed(8);

				resolve(data);
			}).catch(function(e) {
				var msg = e.message;
				if (msg == undefined) msg = e;
				console.log("ERROR: " + msg);
				reject(e);
			});

		});
	}
	
};

module.exports = Report;