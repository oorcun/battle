import { defineStore } from 'pinia'
import config from '../../web3.config.js'
import playerContractAbi from '../components/abis/PlayerContract.js'
import { useMetamaskStore } from './metamask.js'
import { usePlayerStore } from './player.js'

export const useWeb3Store = defineStore('web3', {
	state: () => ({
		web3: {},
		playerContract: {}
	}),
	actions: {
		assignStates () {
			this.web3 = new Web3(window.ethereum)
			this.playerContract = new this.web3.eth.Contract(
				playerContractAbi,
				config.addresses.playerContract
			)
		},
		decToHex (number) {
			return this.web3.utils.toHex(number)
		},
		getErrorReason (error) {
			try {
				const string = error.toString()
				const start = string.substring(string.indexOf('"reason"') + 11)
				return start.substring(0, start.indexOf('"'))
			} catch {
				return ''
			}
		},
		getPastEvents (event, options) {
			return this.playerContract.getPastEvents(event, { fromBlock: 'earliest', ...options })
				.catch(error => {
					console.error(error)
					throw error
				})
		},
		listenEvent (event, filter) {
			return this.playerContract.events[event](filter)
				.on('error', console.log)
		},
		call (method, ...params) {
			const metamaskStore = useMetamaskStore()
			return this.playerContract.methods[method](...params).call({ from: metamaskStore.account })
		},
		send (method, ...params) {
			const metamaskStore = useMetamaskStore()
			return this.playerContract.methods[method](...params).send({ from: metamaskStore.account })
		},
		getPlayer () {
			const playerStore = usePlayerStore()
			this.call('getPlayer')
				.then(result => {
					playerStore.player = result
					playerStore.playerState = 'exist'
				})
				.catch(error => {
					playerStore.player = []
					playerStore.playerState = 'unknown'
					const reason = this.getErrorReason(error)
					if (reason !== '') {
						if (reason === 'PlayerContract: player not exist for address') {
							playerStore.playerState = 'notExist'
						}
						console.info('getPlayer', reason)
					} else {
						console.error(error)
					}
				})
		},
		createPlayer (name) {
			return this.send('createPlayer', name)
				.then(() => {
					this.getPlayer()
				})
				.catch(console.error)
		},
		getPlayers (startId, endId) {
			return this.call('getPlayers', startId, endId)
				.catch(error => {
					console.error(error)
					throw error
				})
		},
		registerAttack (defenderAddress, startingMinuteTimestamp, side) {
			return this.send('registerAttack', defenderAddress, startingMinuteTimestamp, side)
				.catch(console.error)
		},
		getAnyPlayer (owner) {
			return this.call('getAnyPlayer', owner)
				.catch(error => {
					const reason = this.getErrorReason(error)
					if (reason !== '') {
						console.info('getAnyPlayer', reason)
						throw new Error(reason)
					} else {
						console.error(error)
						throw error
					}
				})
		},
		hasRegisteredAttack (attacker, startingMinute) {
			return this.call('hasRegisteredAttack', attacker, startingMinute)
				.catch(error => {
					console.error(error)
					throw error
				})
		},
		getPrice (minuteTimestamp) {
			return this.call('getPrice', minuteTimestamp)
				.catch(error => {
					const reason = this.getErrorReason(error)
					if (reason !== '') {
						console.info('getPrice', reason)
						throw new Error(reason)
					} else {
						console.error(error)
						throw error
					}
				})
		}
	}
})
