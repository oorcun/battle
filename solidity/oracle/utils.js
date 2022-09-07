const fetch = require('node-fetch')
const OrderedSet = require('./orderedset.js')

function getCurrentMinuteTimestamp () {
	return Math.floor(Math.floor(Date.now() / 1000) / 60) * 60
}

async function requestPrice (priceRequestTimestamps) {
	let firstRequestTimestamp = priceRequestTimestamps.first()
	if (firstRequestTimestamp <= getCurrentMinuteTimestamp()) {
		priceRequestTimestamps.delete(firstRequestTimestamp)
		try {
			await sendRequest(firstRequestTimestamp)
		} catch (e) {
			priceRequestTimestamps.add(firstRequestTimestamp)
			console.log('sendRequest error')
			console.log(e)
		}
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
	// send price to sol
	console.log(price)
}

module.exports = {
	getCurrentMinuteTimestamp,
	requestPrice,
	OrderedSet
}
