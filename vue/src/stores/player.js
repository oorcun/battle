import { defineStore } from 'pinia'
import { useWeb3Store } from './web3.js'

export const usePlayerStore = defineStore('player', {
	state: () => ({
		player: [],
		playerState: 'unknown',
		attacks: [],
		attacksState: 'pending',
		setPlayerNameError: false,
		attackerListener: undefined,
		defenderListener: undefined
	}),
	actions: {
		setFinishedAttacks () {
			if (this.playerState === 'exist') {
				const web3Store = useWeb3Store()
				web3Store.getPastEvents('AttackResulted', { filter: { attacker: this.player[2] } })
					.then(this.setAttacks)
					.catch(this.handleError)
				web3Store.getPastEvents('AttackResulted', { filter: { defender: this.player[2] } })
					.then(this.setAttacks)
					.catch(this.handleError)
			}
		},
		listenAttacks () {
			if (this.playerState === 'exist') {
				const web3Store = useWeb3Store()
				this.attackerListener = web3Store.listenEvent(
					'AttackResulted', { filter: { attacker: this.player[2] } }
				).on('data', this.setAttack)
				this.defenderListener = web3Store.listenEvent(
					'AttackResulted', { filter: { defender: this.player[2] } }
				).on('data', this.setAttack)
			}
		},
		unlistenAttacks () {
			this.attackerListener.unsubscribe()
			this.defenderListener.unsubscribe()
		},
		setAttacks (events) {
			Object.values(events).forEach(this.setAttack)
		},
		setAttack (event) {
			const attacker = event.returnValues.attacker
			const defender = event.returnValues.defender
			const startingMinute = Number(event.returnValues.startingMinute)
			if(this.attacks.some(
				attack => attack.attacker.address === attacker
					&& attack.defender.address === defender
					&& attack.startingMinute === startingMinute
			)) {
				return
			}
			let attackerName = ''
			let defenderName = ''
			let attackerIsCurrentPlayer = false
			let defenderIsCurrentPlayer = false
			if (attacker === this.player[2]) {
				attackerName = this.player[1]
				this.setPlayerName(defender)
				attackerIsCurrentPlayer = true
				defenderIsCurrentPlayer = false
			} else {
				this.setPlayerName(attacker)
				defenderName = this.player[1]
				attackerIsCurrentPlayer = false
				defenderIsCurrentPlayer = true
			}
			const winner = event.returnValues.won ? 'attacker' : 'defender'
			this.attacks.push({
				attacker: {
					name: attackerName,
					address: attacker,
					isCurrentPlayer: attackerIsCurrentPlayer
				},
				defender: {
					name: defenderName,
					address: defender,
					isCurrentPlayer: defenderIsCurrentPlayer
				},
				startingMinute: Number(startingMinute),
				winner: winner,
				isPlayerWon: attackerIsCurrentPlayer && winner === 'attacker'
					|| defenderIsCurrentPlayer && winner === 'defender'
					? true
					: false
			})
			this.attacksState = 'fetched'
		},
		handleError (error) {
			console.error(error)
			this.attacksState = 'error'
		},
		setPlayerName (address) {
			const web3Store = useWeb3Store()
			web3Store.getAnyPlayer(address)
				.then(player => {
					this.attacks.forEach(attack => {
						if (attack.attacker.address === player[2]) {
							attack.attacker.name = player[1]
							return
						}
						if (attack.defender.address === player[2]) {
							attack.defender.name = player[1]
						}
					})
				})
				.catch(error => {
					this.setPlayerNameError = true
					console.error(error)
				})
		}
	}
})
