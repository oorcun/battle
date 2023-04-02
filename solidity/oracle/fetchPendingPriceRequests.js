module.exports = async function (callback) {

	try {

		const PlayerContract = await artifacts.require('PlayerContract').deployed()

		console.log((await PlayerContract.getPendingRequests()).map(item => item.minuteTimestamp).toString())

	} catch (error) {

		console.log('fetchPendingPriceRequests.js error')
		console.log(error)

	}

	callback()

}
