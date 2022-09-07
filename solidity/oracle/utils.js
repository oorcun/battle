const OrderedSet = require('./orderedset.js')

let priceRequests

function getCurrentMinuteTimestamp () {
	return Math.floor(Math.floor(Date.now() / 1000) / 60) * 60
}

function requestPrice () {
	if (priceRequests.first() <= getCurrentMinuteTimestamp()) {
		sendRequest()
	}
}

function sendRequest () {
	console.log('sendRequest')
	// console.log(priceRequests)
}

module.exports = {
	getCurrentMinuteTimestamp,
	requestPrice,
	priceRequests,
	OrderedSet
}
