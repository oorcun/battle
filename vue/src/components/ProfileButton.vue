<script>

import { mapState, mapActions } from 'pinia'
import { useMetamaskStore } from '../stores/metamask.js'

export default {

	computed: {
		...mapState(useMetamaskStore, ['metamaskState', 'account', 'maskedAccount'])
	},

	methods: {
		...mapActions(useMetamaskStore, ['connect'])
	}

}

</script>




<template>

<a v-if="metamaskState === 'notInstalled'" class="button is-primary" href="https://metamask.io" target="_blank">
	<strong>Install MetaMask <ion-icon name="arrow-redo"></ion-icon></strong>
</a>
<RouterLink v-else-if="metamaskState === 'connected'" to="/profile" class="button is-primary">
	<strong><ion-icon name="person"></ion-icon> {{ maskedAccount }}</strong>
</RouterLink>
<a v-else-if="metamaskState === 'notConnected'" class="button is-primary" @click="connect">
	<strong><ion-icon name="log-in"></ion-icon> Connect Metamask</strong>
</a>
<a v-else class="button is-primary">
	<strong><img src="src/components/gifs/loading-loading-forever.gif"></strong>
</a>

</template>




<style scoped>

</style>
