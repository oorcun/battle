const utils = require('./utils.js')
const { OrderedSet } = utils

module.exports = async function (callback) {

	try {
		console.log('oracled started')

		const PlayerContract = await artifacts.require('PlayerContract').deployed()

		console.log('fetching pending price requests')

		let priceRequestTimestamps = new OrderedSet(
			(await PlayerContract.getPendingRequests())
				.map(request => Number(request.minuteTimestamp))
		)

		console.log('fetched pending price requests')
		console.log({ priceRequestTimestamps })

		setInterval(utils.requestPrice, 1000, PlayerContract, priceRequestTimestamps)

		setInterval(() => { console.log({ priceRequestTimestamps }) }, 30000)

		PlayerContract
			.AttackRegistered()
			.on('data', event => {
				console.log('attack registered')
				priceRequestTimestamps.add(event.args.startingMinute.toNumber())
					.add(event.args.startingMinute.toNumber() + 60)
				console.log('fetched new price requests')
				console.log({ priceRequestTimestamps })
			})

	} catch (e) {

		console.log('oracled.js error')
		console.log(e)

		callback()

	}

}
