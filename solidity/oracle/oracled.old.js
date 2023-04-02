const utils = require('./utils.js')
const fs = require('fs')
const { OrderedSet } = utils

module.exports = async function (callback) {

	try {

		utils._console.log('oracled started')

		// Config object may be different because of a bug in Truffle.
		// This is not necessary if event listening won't be used.
		// let truffleConfig
		// if (config.config === undefined) {
		// 	truffleConfig = config
		// } else {
		// 	truffleConfig = config.config
		// }

		// Write process ID to easily process operations with oracle;
		// like starting, stopping or checking it is running or not.
		fs.writeFileSync(__dirname + '/pid', process.pid.toString())

		const oracle = (await web3.eth.getAccounts())[8]
		const PlayerContract = await artifacts.require('PlayerContract').deployed()
		let priceRequestTimestamps = new OrderedSet

		utils.fetchPendingPriceRequests(PlayerContract, priceRequestTimestamps)

		setInterval(utils.requestPrice, 1000, PlayerContract, priceRequestTimestamps, oracle)

		// Because HDWalletProvider doesn't support event listening, had to resort to this.
		// While it is ideal to listen events, listener lost connection after a while
		// because of a bug in web3 package. So, until that is fixed, this code should be commented out.
		// truffleConfig.networks[truffleConfig.network].eventListener(PlayerContract)
		// 	.AttackRegistered()
		// 	.on('data', event => {
		// 		utils._console.log('attack registered')
		// 		priceRequestTimestamps.add(Number(event.returnValues.startingMinute))
		// 			.add(Number(event.returnValues.startingMinute) + 60)
		// 		utils._console.log('fetched new price requests')
		// 		utils._console.log({ priceRequestTimestamps })
		// 	})

		// Try to fetch pending requests between reasonable intervals instead of event listening.
		// This is not ideal, but it may be necessary to avoid Infura daily limits.
		// This is used because of a bug in web3 package that lose connections.
		setInterval(utils.fetchPendingPriceRequests, 30000, PlayerContract, priceRequestTimestamps)

	} catch (error) {

		utils._console.log('oracled.js error')
		utils._console.log(error)

		callback()

	}

}
