const fetch = require('node-fetch')
const OrderedSet = require('./orderedset.js')

function getCurrentMinuteTimestamp () {
	return Math.floor(Math.floor(Date.now() / 1000) / 60) * 60
}

function getDate (timestamp) {
	return new Date(timestamp * 1000)
}

async function requestPrice (PlayerContract, priceRequestTimestamps) {
	let firstRequestTimestamp = priceRequestTimestamps.first()
	if (firstRequestTimestamp <= getCurrentMinuteTimestamp()) {
		priceRequestTimestamps.delete(firstRequestTimestamp)
		try {
			console.log('sending price request')
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
	console.log('successfully fetched price')
	console.log({ price })
	console.log('setting price request')
	await PlayerContract.setPriceRequest(firstRequestTimestamp, price)
	console.log('successfully setted price request')
	console.log({ firstRequestTimestamp, price, firstRequestDatetime: getDate(firstRequestTimestamp) })
}

module.exports = {
	requestPrice,
	OrderedSet,
	getCurrentMinuteTimestamp
}
