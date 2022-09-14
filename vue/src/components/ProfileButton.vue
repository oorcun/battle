<script>

export default {

	mounted () {
		if (this.isMetamaskInstalled()) {
			window.ethereum.on('connected', () => {
				console.log('connected')
			})
			window.ethereum.on('disconnect', () => {
				console.log('disconnect')
			})
			window.ethereum.on('message', () => {
				console.log('message')
			})
			window.ethereum.on('accountsChanged', () => {
				console.log('accountsChanged')
			})
			window.ethereum.on('chainChanged', () => {
				console.log('chainChanged')
			})

			this.getAccount()
		}
	},

	data () {
		return {
			buttonState: '',
			account: ''
		}
	},

	computed: {
		maskedAccount () {
			return this.account.slice(0, 4) + '....' + this.account.slice(40)
		}
	},

	methods: {
		isMetamaskInstalled () {
			return window.ethereum?.isMetaMask
		},
		async connect () {
			this.accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
		},
		getAccount () {
			window.ethereum.request({ method: 'eth_accounts' })
				.then(accounts => {
					this.account = accounts[0] ?? ''
					this.buttonState = accounts.length > 0 ? 'address' : 'connect'
				})
				.catch(console.error)
		}
	}

}

</script>




<template>

<a class="button is-primary" v-if="!isMetamaskInstalled()" href="https://metamask.io" target="_blank">
	<strong>Install MetaMask <ion-icon name="arrow-redo"></ion-icon></strong>
</a>
<a class="button is-primary" v-else-if="buttonState === 'address'">
	<strong><ion-icon name="person"></ion-icon> {{ maskedAccount }}</strong>
</a>
<a class="button is-primary" v-else-if="buttonState === 'connect'" @click="connect">
	<strong>Connect Metamask</strong>
</a>
<a class="button is-primary" v-else>
	<strong><img src="src/components/gifs/loading-loading-forever.gif"></strong>
</a>

</template>




<style scoped>

</style>
