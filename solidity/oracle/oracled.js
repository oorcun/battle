const utils = require('./utils.js')

module.exports = async function (callback) {

	try {

		utils.log('oracled started')

		const PlayerContract = await artifacts.require('PlayerContract').deployed()

		PlayerContract
			.AttackRegistered()
			.on('data', event => { utils.log(event.args.startingMinute.toNumber()) })

	} catch (e) {

		utils.log(e)

		callback()

	}

}
