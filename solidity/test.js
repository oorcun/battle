const utils = require('./oracle/utils.js')

module.exports = async function (callback) {

	try {

		const accounts = await web3.eth.getAccounts()

		const PlayerContract = await artifacts.require('PlayerContract').deployed()

		await PlayerContract.createPlayer('orcun')
		await PlayerContract.createPlayer('orcun2', { from: accounts[1] })

		let r = await PlayerContract.registerAttack(accounts[1], utils.getCurrentMinute() + 60, true)

		console.log(r)

	} catch (e) {

		console.log(e)

	}

	callback()

}
