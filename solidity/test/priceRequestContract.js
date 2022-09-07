const PlayerContract = artifacts.require('PlayerContract')

const utils = require('./helpers/utils.js')

contract('PriceRequestContract', accounts => {

	let instance, account0, account1

	beforeEach(async () => {
		instance = await PlayerContract.new()
		account0 = accounts[0]
		account1 = accounts[1]
	})

	context('PRICE FETCHING', async () => {

		it('should successfully fetch all price requests', async () => {
			let current = utils.getCurrentMinuteTimestamp()

			await instance.createPlayer('orcun')
			await instance.createPlayer('orcun', { from: account1 })

			await instance.registerAttack(account1, current + 60, true)

			let priceRequests = await instance.getPendingRequests()
			expect(Number(priceRequests[0].minuteTimestamp)).to.equal(current + 60)
			expect(Number(priceRequests[0].price)).to.equal(0)
			expect(Number(priceRequests[0].increasePercent)).to.equal(0)
			expect(Number(priceRequests[1].minuteTimestamp)).to.equal(current + 120)
			expect(Number(priceRequests[1].price)).to.equal(0)
			expect(Number(priceRequests[1].increasePercent)).to.equal(0)
		})

		it('should not add already added price request', async () => {
			let current = utils.getCurrentMinuteTimestamp()

			await instance.createPlayer('orcun')
			await instance.createPlayer('orcun', { from: account1 })

			await instance.registerAttack(account1, current + 60, true)
			await instance.registerAttack(account0, current + 60, true, { from: account1 })

			let priceRequests = await instance.getPendingRequests()
			expect(priceRequests.length).to.equal(2)
		})

	})

	context('PRICE SETTING', async () => {

		it('should throw error if setter is not the oracle', async () => {
			let current = utils.getCurrentMinuteTimestamp()

			await utils.shouldThrow(
				instance.setPriceRequest(current, 10000000, { from: account1 }),
				'Oracle: caller is not the oracle'
			)
		})

		it('should throw error if pending request exists', async () => {
			let current = utils.getCurrentMinuteTimestamp()

			await utils.shouldThrow(
				instance.setPriceRequest(current, 10000000),
				'PriceRequestContract: price request not exists'
			)
		})

		it('should successfully set price request', async () => {
			let current = utils.getCurrentMinuteTimestamp()

			await instance.createPlayer('orcun')
			await instance.createPlayer('orcun', { from: account1 })
			await instance.registerAttack(account1, current + 60, true)
			let result = await instance.setPriceRequest(current + 60, 10000000)
		})

	})

})
