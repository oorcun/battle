const OrderedSet = require('./orderedset.js')

function getCurrentMinuteTimestamp () {
	return Math.floor(Math.floor(Date.now() / 1000) / 60) * 60
}

function requestPrice () {
	//const values = set.values(); // 👉️ iterator
	// const obj = values.next() // 👉️ {value: 1, done: false}
	// const first = obj.value;
	// console.log(priceRequests)
}

function sendRequest () {
	console.log('sendRequest')
	// console.log(priceRequests)
}

module.exports = {
	getCurrentMinuteTimestamp,
	requestPrice,
	OrderedSet
}
