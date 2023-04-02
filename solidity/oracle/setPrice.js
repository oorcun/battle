module.exports = async function (callback) {

	try {

		const PlayerContract = await artifacts.require('PlayerContract').deployed()

		const minuteTimestamp = process.argv[6]
		const price = process.argv[7]

		await PlayerContract.setPriceRequest(minuteTimestamp, price, { from: (await web3.eth.getAccounts())[8] })

	} catch (error) {

		console.log('setPrice.js error')
		console.log(error)

	}

	callback()

}
