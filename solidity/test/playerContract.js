const PlayerContract = artifacts.require('PlayerContract')

const utils = require('./helpers/utils.js')

contract('PlayerContract', accounts => {

	let instance, sender, defender

	beforeEach(async () => {
		instance = await PlayerContract.new()
		sender = accounts[0]
		defender = accounts[1]
	})

	context('PLAYER CREATION', async () => {

		it('should create player if no player exists for sender', async () => {
			let player = await instance.addressToPlayer(sender)
			expect(player.id.toNumber()).to.equal(0)

			let result = await instance.createPlayer('orcun')

			player = await instance.players(0)
			expect(player.id.toNumber()).to.equal(1)

			player = await instance.addressToPlayer(sender)
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
				instance.registerAttack(defender, utils.getCurrentMinuteTimestamp() + 60, true),
				'Player: player not exist for address'
			)
		})

		it('should throw if defender does not have a player', async () => {
			await instance.createPlayer('orcun')

			await utils.shouldThrow(
				instance.registerAttack(defender, utils.getCurrentMinuteTimestamp() + 60, true),
				'Player: defender not exist'
			)
		})

		it('should throw if starting minute is not a future time', async () => {
			await instance.createPlayer('orcun')
			await instance.createPlayer('orcun', { from: defender })

			await utils.shouldThrow(
				instance.registerAttack(defender, utils.getCurrentMinuteTimestamp(), true),
				'Player: starting minute must be a future time'
			)
		})

		it('should throw if starting minute is a too far future time', async () => {
			await instance.createPlayer('orcun')
			await instance.createPlayer('orcun', { from: defender })

			await utils.shouldThrow(
				instance.registerAttack(defender, utils.getCurrentMinuteTimestamp() + 60 * 60 * 24, true),
				'Player: starting minute must not be far away'
			)
		})

		it('should throw if player already registered for an attack', async () => {
			await instance.createPlayer('orcun')
			await instance.createPlayer('orcun', { from: defender })
			await instance.registerAttack(defender, utils.getCurrentMinuteTimestamp() + 60, true)

			await utils.shouldThrow(
				instance.registerAttack(defender, utils.getCurrentMinuteTimestamp() + 60, true),
				'Player: already registered for an attack'
			)
		})

		it('should successfully register for an attack', async () => {
			let current = utils.getCurrentMinuteTimestamp()

			await instance.createPlayer('orcun')
			await instance.createPlayer('orcun', { from: defender })

			let registered = await instance.addressToRegisteredAttack(sender)
			expect(registered).to.equal(false)

			await utils.shouldThrow(
				instance.addressToAttacks(sender, 0)
			)

			let result = await instance.registerAttack(defender, current + 60, true)

			registered = await instance.addressToRegisteredAttack(sender)
			expect(registered).to.equal(true)

			let attack = await instance.addressToAttacks(sender, 0)
			expect(attack.startingMinute.toNumber()).to.equal(current + 60)
			expect(attack.defender).to.equal(defender)
			expect(attack.side).to.equal(true)
			expect(attack.finished).to.equal(false)
			expect(attack.won).to.equal(false)

			expect(result.receipt.status).to.equal(true)
			expect(result.logs[0].event).to.equal('AttackRegistered')
			expect(result.logs[0].args[0]).to.equal(sender)
			expect(result.logs[0].args[1]).to.equal(defender)
			expect(result.logs[0].args[2].toNumber()).to.equal(current + 60)
			expect(result.logs[0].args[3]).to.equal(true)
		})

	})

})
