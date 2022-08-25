const Web3 = require('web3')
const env = require('./env.json')

function init () {
	return new Web3(env.url)
}

module.exports = {
	init
}
