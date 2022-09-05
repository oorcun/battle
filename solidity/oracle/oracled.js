const utils = require('./utils.js')

module.exports = async function (callback) {

	try {

		console.log('oracled started')

		// setTimeout(utils.requestPrice, 4000)
		// priceRequests.push({ requestTime: 1 })
		// priceRequests.push({ requestTime: 2 })

		const PlayerContract = await artifacts.require('PlayerContract').deployed()

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
