const fetch = require('node-fetch')
const OrderedSet = require('./orderedset.js')

function getCurrentMinuteTimestamp () {
	return Math.floor(Math.floor(Date.now() / 1000) / 60) * 60
}

function requestPrice (priceRequestTimestamps) {
	let firstRequestTimestamp = priceRequestTimestamps.first()
	if (firstRequestTimestamp <= getCurrentMinuteTimestamp()) {
		priceRequestTimestamps.delete(firstRequestTimestamp)
		sendRequest(firstRequestTimestamp)
	}
}

async function sendRequest (firstRequestTimestamp) {
	let price = parseFloat(
		JSON.parse(
			await (
				await fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=2&endTime=${firstRequestTimestamp * 1000}`)
			).text()
		)[0][4]
	).toFixed(2)
	console.log(price)
	// console.log(priceRequests)
}

module.exports = {
	getCurrentMinuteTimestamp,
	requestPrice,
	OrderedSet
}
