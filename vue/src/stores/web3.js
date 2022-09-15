import { defineStore } from 'pinia'
import config from '../../web3.config.js'
import playerContractAbi from '../components/abis/PlayerContract.js'

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
		}
	}
})
