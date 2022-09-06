const utils = require('./utils.js')
const { OrderedSet } = utils
let { priceRequests } = utils

module.exports = async function (callback) {

	try {

		console.log('oracled started')

		const PlayerContract = await artifacts.require('PlayerContract').deployed()

		priceRequests = new OrderedSet(
			(await PlayerContract.getPriceRequests())
				.filter(request => request.price === '0')
				.map(request => Number(request.minuteTimestamp))
		)

		priceRequests.add(2).add(1)

console.log(priceRequests)
callback()
		PlayerContract
			.AttackRegistered()
			.on('data', event => {
				console.log('attack registered')
				let startingMinute = event.args.startingMinute.toNumber()
			})

	} catch (e) {

		console.log(e)

		callback()

	}

}
