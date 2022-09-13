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
		}
	},

	data () {
		return {
			ethereum: 1
		}
	},

	methods: {
		isMetamaskInstalled () {
			return window.ethereum?.isMetaMask
		},
		isConnected () {
			return window.ethereum.selectedAddress !== null
		}
	}

}

</script>




<template>

<a class="button is-primary">
	<strong v-if="!isMetamaskInstalled()">Install MetaMask</strong>
	<strong v-else-if="isConnected()">Connected MetaMask</strong>
	<strong v-else>Connect MetaMask</strong>
</a>

</template>




<style scoped>

</style>
