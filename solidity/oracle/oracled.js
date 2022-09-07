const utils = require('./utils.js')
const { OrderedSet } = utils

module.exports = async function (callback) {

	try {

		console.log('oracled started')

		const PlayerContract = await artifacts.require('PlayerContract').deployed()

		let priceRequestTimestamps = new OrderedSet(
			(await PlayerContract.getPendingRequests())
				.map(request => Number(request.minuteTimestamp))
		)

		console.log('fetched pending price requests')

		setInterval(utils.requestPrice, 1000, priceRequestTimestamps)

		setInterval(() => { console.log(priceRequestTimestamps) }, 4000)

		PlayerContract
			.AttackRegistered()
			.on('data', event => {
				console.log('attack registered')
				priceRequestTimestamps.add(event.args.startingMinute.toNumber())
					.add(event.args.startingMinute.toNumber() + 60)
				console.log('fetched new price requests')
			})

	} catch (e) {

		console.log('oracled.js error')
		console.log(e)

		callback()

	}

}
