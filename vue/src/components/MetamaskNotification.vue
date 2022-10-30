<script>

import { mapState } from 'pinia'
import { useMetamaskStore } from '../stores/metamask.js'

export default {

	computed: {
		...mapState(useMetamaskStore, ['metamaskState'])
	}

}

</script>




<template>

<div v-if="metamaskState === 'notInstalled'" class="notification is-danger">
	Please install MetaMask.
</div>
<div v-else-if="metamaskState === 'connected'" class="notification is-success">
	You successfully connected to the network.
</div>
<div v-else-if="metamaskState === 'notConnected'" class="notification is-warning">
	Please connect MetaMask.
</div>
<div v-else class="notification is-info">
	Please wait while waiting data from MetaMask. <img src="/src/components/gifs/loading-loading-forever.gif">
</div>

</template>




<style scoped>

img {
	height: 1em;
}

</style>
