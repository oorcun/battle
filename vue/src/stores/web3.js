import { defineStore } from 'pinia'
import config from '../../web3.config.js'
import playerContractAbi from '../components/abis/PlayerContract.js'
import { useMetamaskStore } from './metamask.js'
import { usePlayerStore } from './player.js'

export const useWeb3Store = defineStore('web3', {
	state: () => ({
		web3: {},
		playerContract: {},
		network: config.currentNetwork
	}),
	actions: {
		assignStates () {
			this.web3 = new Web3(window.ethereum)
			this.playerContract = new this.web3.eth.Contract(
				playerContractAbi,
				config.networks[this.network].playerContract
			)
		},
		decToHex (number) {
			return this.web3.utils.toHex(number)
		},
		getErrorReason (error) {
			try {
				const errorDetectionString = config.networks[this.network].errorDetectionString
				const string = error.toString()
				const start = string.substring(string.indexOf(errorDetectionString) + errorDetectionString.length)
				return start.substring(0, start.indexOf('"'))
			} catch {
				return ''
			}
		},
		getPastEvents (event, options) {
			// Currently fetches all past events. It should be changed if this became too slow.
			return this.playerContract.getPastEvents(event, { fromBlock: 'earliest', ...options })
				.catch(error => {
					console.error(error)
					throw error
				})
		},
		listenEvent (event, filter) {
			return this.playerContract.events[event](filter)
				.on('error', console.error)
		},
		call (method, ...params) {
			const metamaskStore = useMetamaskStore()
			return this.playerContract.methods[method](...params).call({ from: metamaskStore.account })
				.catch(error => {
					const reason = this.getErrorReason(error)
					if (reason !== '') {
						console.info(method, reason)
						throw new Error(reason)
					}
					console.error(error)
					throw error
				})
		},
		send (method, ...params) {
			const metamaskStore = useMetamaskStore()
			return this.playerContract.methods[method](...params).send({ from: metamaskStore.account })
				.catch(error => {
					console.error(error)
					throw error
				})
		},
		getPlayer () {
			const playerStore = usePlayerStore()
			return this.call('getPlayer')
				.then(result => {
					playerStore.player = result
					playerStore.playerState = 'exist'
				})
				.catch(error => {
					playerStore.player = []
					if (error.message === 'PlayerContract: player not exist for address') {
						playerStore.playerState = 'notExist'
					} else {
						playerStore.playerState = 'unknown'
					}
				})
		},
		createPlayer (name) {
			return this.send('createPlayer', name)
				.then(() => { this.getPlayer() })
		},
		getPlayers (startId, endId) {
			return this.call('getPlayers', startId, endId)
		},
		registerAttack (defenderAddress, startingMinuteTimestamp, side) {
			return this.send('registerAttack', defenderAddress, startingMinuteTimestamp, side)
		},
		getAnyPlayer (owner) {
			return this.call('getAnyPlayer', owner)
		},
		hasRegisteredAttack (attacker, startingMinute) {
			return this.call('hasRegisteredAttack', attacker, startingMinute)
		},
		getPrice (minuteTimestamp) {
			return this.call('getPrice', minuteTimestamp)
				.then(price => price / 100)
		},
		finishAttack (attacker, startingMinute) {
			return this.send('finishAttack', attacker, startingMinute)
				.then(() => { this.getPlayer() })
		}
	}
})
