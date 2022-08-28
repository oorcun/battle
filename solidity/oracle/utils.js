const config = require('../truffle-config.js')
const Web3 = require('web3')

function init () {
	let network = config.networks[process.argv[2] || 'develop']
	var web3 = new Web3(`${network.host}:${network.port}`)
}

module.exports = {
	init
}
