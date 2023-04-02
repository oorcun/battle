const utils = require('./utils.js')
const fs = require('fs')




let network = 'goerli'
if (process.argv[3] !== undefined) {
	network = process.argv[3]
}

utils._console.log('oracled started')

fs.writeFileSync(__dirname + '/pid', process.pid.toString())

utils.fetchPendingPriceRequests(network)
// setInterval(utils.fetchPendingPriceRequests, 30000, network)

utils.eventEmitter.on('fetchedPendingPriceRequests', utils.sendRequest)
utils.eventEmitter.on('fetchedPrice', (minuteTimestamp, price) => {
	utils.setPrice(network, minuteTimestamp, price)
})
