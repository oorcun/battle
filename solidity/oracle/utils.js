const fetch = require('node-fetch')
const { spawn } = require('child_process')
const EventEmitter = require('events')

const eventEmitter = new EventEmitter

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

function sendRequest (minuteTimestamp) {
	if (minuteTimestamp <= getCurrentMinuteTimestamp()) {
		_console.log('sending price request to binance')
		fetch(`https://api.binance.us/api/v3/klines?symbol=BTCUSDT&interval=1m&startTime=${(minuteTimestamp - 60) * 1000}&endTime=${minuteTimestamp * 1000}`)
			.then(response => response.json())
			.then(klines => {
				_console.log({ klines })
				if (klines.length !== 2) {
					throw Error('binance request sent too soon')
				}
				const price = parseInt(Number(klines[0][4]) * 100)
				_console.log('successfully fetched price from binance')
				_console.log({ price })
				eventEmitter.emit('fetchedPrice', minuteTimestamp, price)
			})
			.catch(error => {
				console.error(error)
				setTimeout(sendRequest, 15000, minuteTimestamp)
			})
	}
}

function spawnProcess (file, network, ...params) {
	_console.log(`${file}.js starting`)
	const process = spawn('truffle', ['exec', `oracle/${file}.js`, '--network', network, ...params])
	const killTimeoutId = setTimeout(() => {
		process.kill()
		_console.log(`${file}.js | killed after unresponsive`)
	}, 30000)
	process.stdout.on('data', data => {
		clearTimeout(killTimeoutId)
		_console.log(`${file}.js | ${data.toString()}`)
		// eslint-disable-next-line quotes
		if (data.toString().startsWith("Using network '")) {
			return
		}
		if (file === 'fetchPendingPriceRequests') {
			if (data.toString('hex') === '0a') {
				console.log('no pending requests')
				return
			}
			const minuteTimestamps = data.toString().slice(0, -1).split(',').sort()
			_console.log({ minuteTimestamps })
			eventEmitter.emit('fetchedPendingPriceRequests', minuteTimestamps[0])
		}
	})
}

function fetchPendingPriceRequests(network) {
	spawnProcess('fetchPendingPriceRequests', network)
}

function setPrice (network, minuteTimestamp, price) {
	spawnProcess('setPrice', network, minuteTimestamp, price)
}

module.exports = {
	eventEmitter,
	setPrice,
	sendRequest,
	fetchPendingPriceRequests,
	_console
}
