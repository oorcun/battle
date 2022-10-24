module.exports = async function (callback) {

	try {

		console.log('setOracle.js started')

		const PlayerContract = await artifacts.require('PlayerContract').deployed()

		await PlayerContract.setOracle((await web3.eth.getAccounts())[8])

		console.log('oracle set')

	} catch (error) {

		console.log('setOracle.js error')
		console.log(error)

	}

	callback()

}
