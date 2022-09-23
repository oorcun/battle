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
		} catch (error) {
			priceRequestTimestamps.add(firstRequestTimestamp)
			console.log('sendRequest error')
			console.log(error)
		}
	}
}

async function sendRequest (PlayerContract, firstRequestTimestamp) {
	const response = JSON.parse(
		await (
			// start time end time and check request length must be 2
			await fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&startTime=${firstRequestTimestamp - 60}&endTime=${firstRequestTimestamp * 1000}`)
		).text()
	)
	if (response.length <= 1) {
		throw Error('request sent too soon')
	}
	const price = Number(response[0][4]) * 100
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
