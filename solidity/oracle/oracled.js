const utils = require('./utils.js')

// utils.init()

module.exports = async function (callback) {

	const PlayerContract = await artifacts.require('PlayerContract').deployed()

	// console.log(PlayerContract)

	PlayerContract
		.NewPlayerCreated()
		.on('data', event => { console.log(event) })

	setInterval(utils.init, 1000)

	// console.log(PlayerContract.NewPlayerCreated())

	// callback()

}
