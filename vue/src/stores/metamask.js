import { defineStore } from 'pinia'

export const useMetamaskStore = defineStore('metamask', {
	state: () => ({
		metamaskState: 'waiting',
		account: ''
	}),
	actions: {
		isMetamaskInstalled () {
			return window.ethereum !== undefined && window.ethereum.isMetaMask
		},
		assignStates () {
			if (!this.isMetamaskInstalled()) {
				this.accounts = ''
				this.metamaskState = 'notInstalled'
				return
			}
			window.ethereum.request({ method: 'eth_accounts' })
				.then(accounts => {
					this.account = accounts[0] ?? ''
					this.metamaskState = accounts.length > 0 ? 'connected' : 'notConnected'
				})
				.catch(error => {
					this.account = ''
					this.metamaskState = 'waiting'
					console.error(error)
				})
		},
		connect () {
			this.metamaskState = 'waiting'
			window.ethereum.request({ method: 'eth_requestAccounts' })
				.catch(error => {
					this.metamaskState = 'notConnected'
					console.error(error)
				})
		}
	},
	getters: {
		maskedAccount: state => state.account.slice(0, 4) + '....' + state.account.slice(40)
	}
})
