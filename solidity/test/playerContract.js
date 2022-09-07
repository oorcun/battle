const PlayerContract = artifacts.require('PlayerContract')

const utils = require('./helpers/utils.js')

contract('PlayerContract', accounts => {

	let instance, account0, account1

	beforeEach(async () => {
		instance = await PlayerContract.new()
		account0 = accounts[0]
		account1 = accounts[1]
	})

	context('PLAYER CREATION', async () => {

		it('should create player if no player exists for sender', async () => {
			let player = await instance.addressToPlayer(account0)
			expect(player.id.toNumber()).to.equal(0)

			let result = await instance.createPlayer('orcun')

			player = await instance.players(0)
			expect(player.id.toNumber()).to.equal(1)

			player = await instance.addressToPlayer(account0)
			expect(player.name).to.equal('orcun')
			expect(player.id.toNumber()).to.equal(1)
			expect(player.attackWinCount.toNumber()).to.equal(0)
			expect(player.attackLossCount.toNumber()).to.equal(0)
			expect(player.defendWinCount.toNumber()).to.equal(0)
			expect(player.defendLossCount.toNumber()).to.equal(0)
			expect(player.points.toNumber()).to.equal(0)

			expect(result.receipt.status).to.equal(true)
			expect(result.logs[0].event).to.equal('NewPlayerCreated')
			expect(result.logs[0].args[0].toNumber()).to.equal(1)
			expect(result.logs[0].args[1]).to.equal('orcun')
		})

		it('should throw error if player already exists for sender', async () => {
			await instance.createPlayer('orcun')

			await utils.shouldThrow(
				instance.createPlayer('orcun'),
				'Player: player already exists for address'
			)
		})

	})

	context('PLAYER FETCHING', async () => {

		it('should fetch created player', async () => {
			await instance.createPlayer('orcun')
			let player = await instance.getPlayer()

			expect(player.name).to.equal('orcun')
			expect(player.id).to.equal('1')
			expect(player.attackWinCount).to.equal('0')
			expect(player.attackLossCount).to.equal('0')
			expect(player.defendWinCount).to.equal('0')
			expect(player.defendLossCount).to.equal('0')
			expect(player.points).to.equal('0')
		})

		it('should throw error if player not exist for address', async () => {
			await utils.shouldThrow(
				instance.getPlayer(),
				'Player: player not exist for address'
			)
		})

	})

	context('ATTACK REGISTERING', async () => {

		it('should throw if sender does not have a player', async () => {
			await utils.shouldThrow(
				instance.registerAttack(account1, utils.getCurrentMinuteTimestamp() + 60, true),
				'Player: player not exist for address'
			)
		})

		it('should throw if defender does not have a player', async () => {
			await instance.createPlayer('orcun')

			await utils.shouldThrow(
				instance.registerAttack(account1, utils.getCurrentMinuteTimestamp() + 60, true),
				'Player: defender not exist'
			)
		})

		it('should throw if starting minute is not a future time', async () => {
			await instance.createPlayer('orcun')
			await instance.createPlayer('orcun', { from: account1 })

			await utils.shouldThrow(
				instance.registerAttack(account1, utils.getCurrentMinuteTimestamp() - 60, true),
				'Player: starting minute must be a future time'
			)
		})

		it('should throw if starting minute is a too far future time', async () => {
			await instance.createPlayer('orcun')
			await instance.createPlayer('orcun', { from: account1 })

			await utils.shouldThrow(
				instance.registerAttack(account1, utils.getCurrentMinuteTimestamp() + 60 * 60, true),
				'Player: starting minute must not be far away'
			)
		})

		it('should throw if player already registered for an attack', async () => {
			await instance.createPlayer('orcun')
			await instance.createPlayer('orcun', { from: account1 })
			await instance.registerAttack(account1, utils.getCurrentMinuteTimestamp() + 60, true)

			await utils.shouldThrow(
				instance.registerAttack(account1, utils.getCurrentMinuteTimestamp() + 60, true),
				'Player: already registered for an attack'
			)
		})

		it('should successfully register for an attack', async () => {
			let current = utils.getCurrentMinuteTimestamp()

			await instance.createPlayer('orcun')
			await instance.createPlayer('orcun', { from: account1 })

			let registered = await instance.addressToHasRegisteredAttack(account0)
			expect(registered).to.equal(false)

			await utils.shouldThrow(
				instance.addressToAttacks(account0, 0)
			)

			await utils.shouldThrow(
				instance.pendingRequests(0)
			)
			await utils.shouldThrow(
				instance.pendingRequests(1)
			)

			let result = await instance.registerAttack(account1, current + 60, true)

			registered = await instance.addressToHasRegisteredAttack(account0)
			expect(registered).to.equal(true)

			let attack = await instance.addressToAttacks(account0, 0)
			expect(attack.startingMinute.toNumber()).to.equal(current + 60)
			expect(attack.defender).to.equal(account1)
			expect(attack.side).to.equal(true)
			expect(attack.finished).to.equal(false)
			expect(attack.won).to.equal(false)

			let priceRequest = await instance.pendingRequests(0)
			expect(priceRequest.minuteTimestamp.toNumber()).to.equal(current + 60)
			expect(priceRequest.price.toNumber()).to.equal(0)
			expect(priceRequest.increasePercent.toNumber()).to.equal(0)
			priceRequest = await instance.pendingRequests(1)
			expect(priceRequest.minuteTimestamp.toNumber()).to.equal(current + 120)
			expect(priceRequest.price.toNumber()).to.equal(0)
			expect(priceRequest.increasePercent.toNumber()).to.equal(0)

			expect(result.receipt.status).to.equal(true)

			expect(result.logs[0].event).to.equal('PriceRequested')
			expect(result.logs[0].args[0].toNumber()).to.equal(current + 60)

			expect(result.logs[1].event).to.equal('PriceRequested')
			expect(result.logs[1].args[0].toNumber()).to.equal(current + 120)

			expect(result.logs[2].event).to.equal('AttackRegistered')
			expect(result.logs[2].args[0]).to.equal(account0)
			expect(result.logs[2].args[1]).to.equal(account1)
			expect(result.logs[2].args[2].toNumber()).to.equal(current + 60)
			expect(result.logs[2].args[3]).to.equal(true)
		})

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

})
