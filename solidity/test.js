const utils = require('./oracle/utils.js')

module.exports = async function (callback) {

	try {

		const accounts = await web3.eth.getAccounts()

		const PlayerContract = await artifacts.require('PlayerContract').deployed()

		let r = await PlayerContract.getPlayers(0, 0)

		// await PlayerContract.createPlayer('orcun')
		// await PlayerContract.createPlayer('orcun2', { from: accounts[1] })

		// let r = await PlayerContract.registerAttack(accounts[1], utils.getCurrentMinuteTimestamp() + 60, true)
		// let s = await PlayerContract.registerAttack(accounts[0], utils.getCurrentMinuteTimestamp() + 60, true, { from: accounts[1] })

		console.log(r)

	} catch (e) {

		console.log(e)

	}

	callback()

}
