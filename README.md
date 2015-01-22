# bip32-report
Retrieves balances for n derivations of an HD public key (i.e. Trezor, Wallet32)

![Screenshot of bip32-report](http://i.imgur.com/wRWOCYs.png)

# Setup
Run `npm install`

# Examples

The first argument is the HD public key you will be deriving from. The second argument is the # of addresses you would like to retrieve (defaults to 20).

Retrieve the first 20 addresses and their balances using the HD key "xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8":

`node app.js xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8`

Retrieve the first 10 addresses and their balances using the HD key "xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8":

`node app.js xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8 10`

