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
			const network = config.networks[config.currentNetwork]
			this.web3 = new Web3(network.provider)
			this.playerContract = new this.web3.eth.Contract(
				playerContractAbi,
				config.addresses.playerContract
			)
		},
		call (method, ...params) {
			const metamaskStore = useMetamaskStore()
			return this.playerContract.methods[method](...params).call({ from: metamaskStore.account })
		},
		getPlayer () {
			const playerStore = usePlayerStore()
			this.call('getPlayer')
				.then(result => {
					playerStore.player = result
				})
				.catch(error => {
					playerStore.player = []
					console.error(error)
				})
		}
	}
})
