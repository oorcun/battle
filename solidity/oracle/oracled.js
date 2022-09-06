const utils = require('./utils.js')
const OrderedSet = require('./orderedset.js')

module.exports = async function (callback) {

	try {

		console.log('oracled started')

		let o = new OrderedSet
		o.add(1).add(3).add(2).delete(3)
		// o.add(3)
		// o.add(2)
		console.log(o)
		// o.add(2)
		// console.log(o)
		callback()

		// const PlayerContract = await artifacts.require('PlayerContract').deployed()

		// PlayerContract
		// 	.AttackRegistered()
		// 	.on('data', event => {
		// 		console.log('attack registered')
		// 		let startingMinute = event.args.startingMinute.toNumber()
		// 	})

	} catch (e) {

		console.log(e)

		callback()

	}

}
