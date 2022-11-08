const fetch = require('node-fetch')
const OrderedSet = require('./orderedset.js')

function getCurrentMinuteTimestamp () {
	return Math.floor(Math.floor(Date.now() / 1000) / 60) * 60
}

function getDate (timestamp) {
	return new Date(timestamp * 1000)
}

async function requestPrice (PlayerContract, priceRequestTimestamps, oracle) {
	let firstRequestTimestamp = priceRequestTimestamps.first()
	if (firstRequestTimestamp <= getCurrentMinuteTimestamp()) {
		// Since this function called every second, make sure another request isn't sent in the next call.
		priceRequestTimestamps.delete(firstRequestTimestamp)
		try {
			console.log('sending price request to binance')
			await sendRequest(PlayerContract, firstRequestTimestamp, oracle)
		} catch (error) {
			// Because of error, make sure same request is sent again in the next call.
			priceRequestTimestamps.add(firstRequestTimestamp)
			console.log('sendRequest error')
			console.log(error)
		}
	}
}

async function sendRequest (PlayerContract, firstRequestTimestamp, oracle) {
	const response = await (
		await fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&startTime=${(firstRequestTimestamp - 60) * 1000}&endTime=${firstRequestTimestamp * 1000}`)
	).json()
	if (response.length !== 2) {
		throw Error('binance request sent too soon')
	}
	const price = parseInt(Number(response[0][4]) * 100)
	console.log('successfully fetched price from binance')
	console.log({ price })
	console.log('setting price request in contract')
	await PlayerContract.setPriceRequest(firstRequestTimestamp, price, { from: oracle })
	console.log('successfully set price request in contract')
	console.log({ firstRequestTimestamp, price, firstRequestDatetime: getDate(firstRequestTimestamp) })
}

async function fetchPendingPriceRequests(PlayerContract, priceRequestTimestamps) {
	console.log('fetching pending price requests from contract')
	let pendingRequests = await PlayerContract.getPendingRequests()
	pendingRequests.forEach(request => priceRequestTimestamps.add(Number(request.minuteTimestamp)))
	console.log('fetched pending price requests from contract')
	console.log({ priceRequestTimestamps })
}

module.exports = {
	requestPrice,
	OrderedSet,
	getCurrentMinuteTimestamp,
	fetchPendingPriceRequests
}
