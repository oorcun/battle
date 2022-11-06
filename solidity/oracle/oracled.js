const utils = require('./utils.js')
const fs = require('fs')
const { OrderedSet } = utils

module.exports = async function (callback) {

	try {

		console.log('oracled started')

		// Config object may be different because of a bug in Truffle.
		let truffleConfig
		if (config.config === undefined) {
			truffleConfig = config
		} else {
			truffleConfig = config.config
		}

		// Write process ID to easily process operations with oracle;
		// like starting, stopping or checking it is running or not.
		fs.writeFileSync(__dirname + '/pid', process.pid.toString())

		const oracle = (await web3.eth.getAccounts())[8]

		const PlayerContract = await artifacts.require('PlayerContract').deployed()

		console.log('fetching pending price requests')

		let priceRequestTimestamps = new OrderedSet(
			(await PlayerContract.getPendingRequests())
				.map(request => Number(request.minuteTimestamp))
		)

		console.log('fetched pending price requests')
		console.log({ priceRequestTimestamps })

		setInterval(utils.requestPrice, 1000, PlayerContract, priceRequestTimestamps, oracle)

		setInterval(() => { console.log({ priceRequestTimestamps }) }, 30000)

		// Because HDWalletProvider doesn't support event listening, had to resort to this.
		truffleConfig.networks[truffleConfig.network].eventListener(PlayerContract)
			.AttackRegistered()
			.on('data', event => {
				console.log('attack registered')
				priceRequestTimestamps.add(Number(event.returnValues.startingMinute))
					.add(Number(event.returnValues.startingMinute) + 60)
				console.log('fetched new price requests')
				console.log({ priceRequestTimestamps })
			})

	} catch (error) {

		console.log('oracled.js error')
		console.log(error)

		callback()

	}

}
