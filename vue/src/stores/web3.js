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
		getErrorReason (error) {
			try {
				const string = error.toString()
				const start = string.substring(string.indexOf('"reason"') + 11)
				return start.substring(0, start.indexOf('"'))
			} catch {
				return ''
			}
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
						if (reason === 'Player: player not exist for address') {
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
				.catch(error => {
					console.error(error)
				})
		},
		getPlayers (startId, endId) {
			return this.call('getPlayers', startId, endId)
				.catch(error => {
					console.error(error)
					throw error
				})
		},
	}
})
