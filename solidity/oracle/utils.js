const fetch = require('node-fetch')
const OrderedSet = require('./orderedset.js')

const _console = {
	log: param => {
		console.log(Date() + '    ' + param)
		if (typeof param === 'object') {
			console.log(param)
		}
	}
}

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
			_console.log('sending price request to binance')
			await sendRequest(PlayerContract, firstRequestTimestamp, oracle)
		} catch (error) {
			if (getReason(error) !== 'PriceRequestContract: price request not exists') {
				// Because of error, make sure same request is sent again in the next call.
				priceRequestTimestamps.add(firstRequestTimestamp)
			}
			_console.log('sendRequest error')
			_console.log(error)
		}
	}
}

async function sendRequest (PlayerContract, firstRequestTimestamp, oracle) {
	const response = await (
		await fetch(`https://api.binance.us/api/v3/klines?symbol=BTCUSDT&interval=1m&startTime=${(firstRequestTimestamp - 60) * 1000}&endTime=${firstRequestTimestamp * 1000}`)
	).json()
	_console.log({ response })
	if (response.length !== 2) {
		throw Error('binance request sent too soon')
	}
	const price = parseInt(Number(response[0][4]) * 100)
	_console.log('successfully fetched price from binance')
	_console.log({ price })
	_console.log('setting price request in contract')
	await PlayerContract.setPriceRequest(firstRequestTimestamp, price, { from: oracle })
	_console.log('successfully set price request in contract')
	_console.log({ firstRequestTimestamp, price, firstRequestDatetime: getDate(firstRequestTimestamp) })
}

async function fetchPendingPriceRequests(PlayerContract, priceRequestTimestamps) {
	_console.log('fetching pending price requests from contract')
	let pendingRequests = await PlayerContract.getPendingRequests()
	pendingRequests.forEach(request => priceRequestTimestamps.add(Number(request.minuteTimestamp)))
	_console.log('fetched pending price requests from contract')
	_console.log({ priceRequestTimestamps })
}

function getReason (error) {
	try {
		if (error.reason) {
			return error.reason
		}
		const errorReasonDetectionString = 'Error: execution reverted: '
		const string = error.toString()
		const start = string.substring(string.indexOf(errorReasonDetectionString) + errorReasonDetectionString.length)
		return start
	} catch {
		return 'not found'
	}
}

module.exports = {
	requestPrice,
	OrderedSet,
	fetchPendingPriceRequests,
	_console
}
