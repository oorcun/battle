const PlayerContract = artifacts.require('PlayerContract')

const utils = require('./helpers/utils.js')

contract('Oracle', accounts => {

	let instance, account0, account1

	beforeEach(async () => {
		instance = await PlayerContract.new()
		account0 = accounts[0]
		account1 = accounts[1]
	})

	context('ORACLE SETTING', async () => {

		it('should successfully assign owner address to oracle', async () => {
			let oracle = await instance.oracle()

			expect(oracle).to.equal(account0)
		})

		it('should successfully set given address to oracle', async () => {
			let oracle = await instance.oracle()
			expect(oracle).to.not.equal(account1)

			await instance.setOracle(account1)

			oracle = await instance.oracle()
			expect(oracle).to.equal(account1)
		})

		it('should throw error if oracle setter is not the owner', async () => {
			await utils.shouldThrow(
				instance.setOracle(account1, { from: account1 }),
				'Ownable: caller is not the owner'
			)
		})

	})

})
