// const config = require('../truffle-config.js')
// const Web3 = require('web3')

function init () {

}

function getCurrentMinute () {
	return Math.floor(Math.floor(Date.now() / 1000) / 60) * 60
}

function log (data) {
	console.log(data)
}

module.exports = {
	init,
	getCurrentMinute,
	log
}
