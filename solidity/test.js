const utils = require('./oracle/utils.js')

module.exports = async function (callback) {

	try {

		const accounts = await web3.eth.getAccounts()

		const PlayerContract = await artifacts.require('PlayerContract').deployed()

		// await PlayerContract.createPlayer('orcun2', { from: accounts[1] })
		// await PlayerContract.createPlayer('orcun3', { from: accounts[2] })

		// await PlayerContract.registerAttack(accounts[1], utils.getCurrentMinuteTimestamp() + 60, true)
		// await PlayerContract.registerAttack(accounts[0], utils.getCurrentMinuteTimestamp() + 60, true, { from: accounts[1] })
		// await PlayerContract.registerAttack(accounts[2], utils.getCurrentMinuteTimestamp() + 120, true, { from: accounts[1] })

		// console.log(s)

	} catch (e) {

		console.log(e)

	}

	callback()

}
