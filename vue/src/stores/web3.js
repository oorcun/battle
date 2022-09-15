import { defineStore } from 'pinia'
import config from '../../web3.config.js'
import playerContractAbi from '../components/abis/PlayerContract.js'
import { useMetamaskStore } from './metamask.js'

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
		getPlayer () {
			const metamaskStore = useMetamaskStore()
			this.playerContract.methods.getPlayer().call({ from: metamaskStore.account })
				.then(result => {
					console.log(result)
				})
				.catch(console.error)
		}
	}
})
