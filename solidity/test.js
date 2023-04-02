const utils = require('./oracle/utils.js')

module.exports = async function (callback) {

	try {

		const accounts = await web3.eth.getAccounts()
		let result

		const PlayerContract = await artifacts.require('PlayerContract').deployed()

		// result = await web3.eth.sendTransaction({ to: '0x6f9eB65FC703dd3D9e5251ae581f3612f9289A7a', value: web3.utils.toWei('50', 'ether'), from: accounts[0] })

		// console.log(PlayerContract.address)

		// result = await PlayerContract.setOracle(accounts[8])
		// console.log(result)

		// result = await PlayerContract.createPlayer('orcun')
		// console.log(result)

		// result = await PlayerContract.createPlayer('orcun2', { from: accounts[1] })
		// console.log(result)

		// try {
		// 	result = await PlayerContract.setPriceRequest(1, 1, { from: accounts[8] })
		// } catch (error) {
		// 	console.log(getReason(error))
		// 	console.log(getReason(error) === 'PriceRequestContract: price request not exists')
		// 	console.log(error)
		// }

		// await PlayerContract.createPlayer('orcun3', { from: accounts[2] })

		await PlayerContract.registerAttack(accounts[1], getCurrentMinuteTimestamp() + 60, true)
		// await PlayerContract.registerAttack(accounts[0], utils.getCurrentMinuteTimestamp() + 60, false, { from: accounts[1] })
		// await PlayerContract.registerAttack(accounts[2], utils.getCurrentMinuteTimestamp() + 120, true, { from: accounts[1] })

		// console.log(await PlayerContract.oracle())

	} catch (e) {

		console.log(e)

	}

	callback()

}

function getReason (error) {
	// Error: execution reverted: PriceRequestContract: price request not exists
	try {
		if (error.reason) {
			return error.reason
		}
		const errorReasonDetectionString = 'Error: execution reverted: '
		const string = error.toString()
		const start = string.substring(string.indexOf(errorReasonDetectionString) + errorReasonDetectionString.length)
		return start
	} catch {
		return 'not found'
	}
}

function getCurrentMinuteTimestamp () {
	return Math.floor(Math.floor(Date.now() / 1000) / 60) * 60
}
