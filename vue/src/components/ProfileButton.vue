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
				this.getAccount()
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
		connect () {
			this.buttonState = ''
			window.ethereum.request({ method: 'eth_requestAccounts' })
				.catch(error => {
					this.buttonState = 'connect'
					console.error(error)
				})
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

<a v-if="!isMetamaskInstalled()" class="button is-primary" href="https://metamask.io" target="_blank">
	<strong>Install MetaMask <ion-icon name="arrow-redo"></ion-icon></strong>
</a>
<RouterLink v-else-if="buttonState === 'address'" to="/profile" class="button is-primary">
	<strong><ion-icon name="person"></ion-icon> {{ maskedAccount }}</strong>
</RouterLink>
<a v-else-if="buttonState === 'connect'" class="button is-primary" @click="connect">
	<strong><ion-icon name="log-in"></ion-icon> Connect Metamask</strong>
</a>
<a v-else class="button is-primary">
	<strong><img src="src/components/gifs/loading-loading-forever.gif"></strong>
</a>

</template>




<style scoped>

</style>
