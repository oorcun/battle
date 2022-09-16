<script>

import { mapState, mapActions } from 'pinia'
import { useMetamaskStore } from '../stores/metamask.js'

export default {

	computed: {
		...mapState(useMetamaskStore, ['metamaskState', 'maskedAccount'])
	},

	methods: {
		...mapActions(useMetamaskStore, ['connect'])
	}

}

</script>




<template>

<a v-if="metamaskState === 'notInstalled'" class="button is-primary is-rounded" href="https://metamask.io" target="_blank">
	<strong>Install MetaMask <ion-icon name="arrow-redo"></ion-icon></strong>
</a>
<RouterLink v-else-if="metamaskState === 'connected'" to="/profile" class="button is-primary is-rounded">
	<strong><ion-icon name="person"></ion-icon> {{ maskedAccount }}</strong>
</RouterLink>
<a v-else-if="metamaskState === 'notConnected'" class="button is-primary is-rounded" @click="connect">
	<strong><ion-icon name="log-in"></ion-icon> Connect Metamask</strong>
</a>
<a v-else class="button is-primary is-rounded is-loading">
</a>

</template>




<style scoped>

</style>
