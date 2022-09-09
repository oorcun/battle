const fetch = require('node-fetch')
const OrderedSet = require('./orderedset.js')

function getCurrentMinuteTimestamp () {
	return Math.floor(Math.floor(Date.now() / 1000) / 60) * 60
}

async function requestPrice (PlayerContract, priceRequestTimestamps) {
	let firstRequestTimestamp = priceRequestTimestamps.first()
	if (firstRequestTimestamp <= getCurrentMinuteTimestamp()) {
		priceRequestTimestamps.delete(firstRequestTimestamp)
		try {
			await sendRequest(PlayerContract, firstRequestTimestamp)
		} catch (e) {
			priceRequestTimestamps.add(firstRequestTimestamp)
			console.log('sendRequest error')
			console.log(e)
		}
	}
}

async function sendRequest (PlayerContract, firstRequestTimestamp) {
	let price = Number(
		JSON.parse(
			await (
				await fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=2&endTime=${firstRequestTimestamp * 1000}`)
			).text()
		)[0][4]
	) * 100
	await PlayerContract.setPriceRequest(firstRequestTimestamp, price)
}

module.exports = {
	requestPrice,
	OrderedSet
}
