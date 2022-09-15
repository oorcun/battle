const PlayerContract = artifacts.require('PlayerContract')

const utils = require('./helpers/utils.js')

contract('PlayerContract', accounts => {

	let instance, account0, account1, account2, account3

	beforeEach(async () => {
		instance = await PlayerContract.new()
		account0 = accounts[0]
		account1 = accounts[1]
		account2 = accounts[2]
		account3 = accounts[3]
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

		it('should fetch all players', async () => {
			await instance.createPlayer('orcun')
			await instance.createPlayer('orcun2', { from: account1 })
			let players = await instance.getPlayers(0, 0)

			expect(players.length).to.equal(2)
			expect(players[0].id).to.equal('1')
			expect(players[1].id).to.equal('2')
		})

		it('should fetch all players if there is one player', async () => {
			await instance.createPlayer('orcun')
			let players = await instance.getPlayers(0, 0)

			expect(players.length).to.equal(1)
			expect(players[0].id).to.equal('1')
		})

		it('should throw error if there are no players', async () => {
			await utils.shouldThrow(
				instance.getPlayers(0, 0),
				'Player: start id must be less than end id'
			)
		})

		it('should fetch all players with only end id', async () => {
			await instance.createPlayer('orcun')
			await instance.createPlayer('orcun2', { from: account1 })
			await instance.createPlayer('orcun3', { from: account2 })
			let players = await instance.getPlayers(0, 2)

			expect(players.length).to.equal(2)
			expect(players[0].id).to.equal('1')
			expect(players[1].id).to.equal('2')
		})

		it('should fetch all players with only one player and end id', async () => {
			await instance.createPlayer('orcun')
			await instance.createPlayer('orcun2', { from: account1 })
			let players = await instance.getPlayers(0, 1)

			expect(players.length).to.equal(1)
			expect(players[0].id).to.equal('1')
		})

		it('should fetch all players with only start id', async () => {
			await instance.createPlayer('orcun')
			await instance.createPlayer('orcun2', { from: account1 })
			await instance.createPlayer('orcun3', { from: account2 })
			let players = await instance.getPlayers(2, 0)

			expect(players.length).to.equal(2)
			expect(players[0].id).to.equal('2')
			expect(players[1].id).to.equal('3')
		})

		it('should fetch all players with only one player and start id', async () => {
			await instance.createPlayer('orcun')
			await instance.createPlayer('orcun2', { from: account1 })
			let players = await instance.getPlayers(2, 0)

			expect(players.length).to.equal(1)
			expect(players[0].id).to.equal('2')
		})

		it('should throw error if there are no players with only start id', async () => {
			await instance.createPlayer('orcun')

			await utils.shouldThrow(
				instance.getPlayers(2, 0),
				'Player: start id must be less than end id'
			)
		})

		it('should fetch all players with both ids', async () => {
			await instance.createPlayer('orcun')
			await instance.createPlayer('orcun2', { from: account1 })
			await instance.createPlayer('orcun3', { from: account2 })
			await instance.createPlayer('orcun4', { from: account3 })
			let players = await instance.getPlayers(2, 3)

			expect(players.length).to.equal(2)
			expect(players[0].id).to.equal('2')
			expect(players[1].id).to.equal('3')
		})

		it('should fetch all players with only one player and both ids', async () => {
			await instance.createPlayer('orcun')
			await instance.createPlayer('orcun2', { from: account1 })
			await instance.createPlayer('orcun3', { from: account2 })
			let players = await instance.getPlayers(2, 2)

			expect(players.length).to.equal(1)
			expect(players[0].id).to.equal('2')
		})

		it('should throw error if there are no players with both ids', async () => {
			await instance.createPlayer('orcun')
			await instance.createPlayer('orcun2', { from: account1 })

			await utils.shouldThrow(
				instance.getPlayers(2, 1),
				'Player: start id must be less than end id'
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

			let attack = await instance.addressToMinuteTimestampToAttack(account0, current + 60)
			expect(attack.defender).to.equal('0x0000000000000000000000000000000000000000')
			expect(attack.side).to.equal(false)
			expect(attack.finished).to.equal(false)
			expect(attack.won).to.equal(false)

			await utils.shouldThrow(
				instance.pendingRequests(0)
			)
			await utils.shouldThrow(
				instance.pendingRequests(1)
			)

			let result = await instance.registerAttack(account1, current + 60, true)

			attack = await instance.addressToMinuteTimestampToAttack(account0, current + 60)
			expect(attack.defender).to.equal(account1)
			expect(attack.side).to.equal(true)

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
			expect(result.logs[2].args[1].toNumber()).to.equal(current + 60)
			expect(result.logs[2].args[2]).to.equal(account1)
			expect(result.logs[2].args[3]).to.equal(true)
		})

	})

	context('ATTACK FINISHING', async () => {

		it('should throw if attack not exists', async () => {
			await utils.shouldThrow(
				instance.finishAttack(account0, 0),
				'Player: attack not exists'
			)
		})

		it('should throw if price request for battle starting time not exists', async () => {
			let current = utils.getCurrentMinuteTimestamp()

			await instance.createPlayer('orcun')
			await instance.createPlayer('orcun', { from: account1 })
			await instance.registerAttack(account1, current + 60, true)

			await utils.shouldThrow(
				instance.finishAttack(account0, current + 60),
				'Player: price request for battle starting time not exists'
			)
		})

		it('should throw if price request for battle finish time not exists', async () => {
			let current = utils.getCurrentMinuteTimestamp()

			await instance.createPlayer('orcun')
			await instance.createPlayer('orcun', { from: account1 })
			await instance.registerAttack(account1, current + 60, true)

			await instance.setPriceRequest(current + 60, 10000000)

			await utils.shouldThrow(
				instance.finishAttack(account0, current + 60),
				'Player: price request for battle finish time not exists'
			)
		})

		it('successfully finishes an attack', async () => {
			let current = utils.getCurrentMinuteTimestamp()

			await instance.createPlayer('orcun')
			await instance.createPlayer('orcun', { from: account1 })
			await instance.registerAttack(account1, current + 60, true)

			await instance.setPriceRequest(current + 60, 10000000)
			await instance.setPriceRequest(current + 120, 11000000)

			let result = await instance.finishAttack(account0, current + 60)

			let attack = await instance.addressToMinuteTimestampToAttack(account0, current + 60)
			expect(attack.finished).to.equal(true)
			expect(attack.won).to.equal(true)

			let attacker = await instance.addressToPlayer(account0)
			expect(attacker.attackWinCount.toNumber()).to.equal(1)
			expect(attacker.points.toNumber()).to.equal(2)

			let defender = await instance.addressToPlayer(account1)
			expect(defender.defendLossCount.toNumber()).to.equal(1)
			expect(defender.points.toNumber()).to.equal(-2)

			expect(result.receipt.status).to.equal(true)
			expect(result.logs[0].event).to.equal('AttackResulted')
			expect(result.logs[0].args[0]).to.equal(account0)
			expect(result.logs[0].args[1].toNumber()).to.equal(current + 60)
			expect(result.logs[0].args[2]).to.equal(account1)
			expect(result.logs[0].args[3]).to.equal(true)
		})

		it('successfully finishes an attack with price decrease while attacker predicting increase', async () => {
			let current = utils.getCurrentMinuteTimestamp()

			await instance.createPlayer('orcun')
			await instance.createPlayer('orcun', { from: account1 })
			await instance.registerAttack(account1, current + 60, true)

			await instance.setPriceRequest(current + 60, 10000000)
			await instance.setPriceRequest(current + 120, 9000000)

			await instance.finishAttack(account0, current + 60)

			let attack = await instance.addressToMinuteTimestampToAttack(account0, current + 60)
			expect(attack.won).to.equal(false)

			let attacker = await instance.addressToPlayer(account0)
			expect(attacker.attackLossCount.toNumber()).to.equal(1)
			expect(attacker.points.toNumber()).to.equal(-1)

			let defender = await instance.addressToPlayer(account1)
			expect(defender.defendWinCount.toNumber()).to.equal(1)
			expect(defender.points.toNumber()).to.equal(1)
		})

		it('successfully finishes an attack with price decrease while attacker predicting decrease', async () => {
			let current = utils.getCurrentMinuteTimestamp()

			await instance.createPlayer('orcun')
			await instance.createPlayer('orcun', { from: account1 })
			await instance.registerAttack(account1, current + 60, false)

			await instance.setPriceRequest(current + 60, 10000000)
			await instance.setPriceRequest(current + 120, 9000000)

			await instance.finishAttack(account0, current + 60)

			let attack = await instance.addressToMinuteTimestampToAttack(account0, current + 60)
			expect(attack.won).to.equal(true)

			let attacker = await instance.addressToPlayer(account0)
			expect(attacker.attackWinCount.toNumber()).to.equal(1)
			expect(attacker.points.toNumber()).to.equal(2)

			let defender = await instance.addressToPlayer(account1)
			expect(defender.defendLossCount.toNumber()).to.equal(1)
			expect(defender.points.toNumber()).to.equal(-2)
		})

		it('successfully finishes an attack with price increase while attacker predicting decrease', async () => {
			let current = utils.getCurrentMinuteTimestamp()

			await instance.createPlayer('orcun')
			await instance.createPlayer('orcun', { from: account1 })
			await instance.registerAttack(account1, current + 60, false)

			await instance.setPriceRequest(current + 60, 10000000)
			await instance.setPriceRequest(current + 120, 11000000)

			await instance.finishAttack(account0, current + 60)

			let attack = await instance.addressToMinuteTimestampToAttack(account0, current + 60)
			expect(attack.won).to.equal(false)

			let attacker = await instance.addressToPlayer(account0)
			expect(attacker.attackLossCount.toNumber()).to.equal(1)
			expect(attacker.points.toNumber()).to.equal(-1)

			let defender = await instance.addressToPlayer(account1)
			expect(defender.defendWinCount.toNumber()).to.equal(1)
			expect(defender.points.toNumber()).to.equal(1)
		})

	})

})
