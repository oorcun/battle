<script>

import { mapState, mapActions } from 'pinia'
import { useMetamaskStore } from '../stores/metamask.js'
import { useWeb3Store } from '../stores/web3.js'
import { usePlayerStore } from '../stores/player.js'
import MetamaskNotification from './MetamaskNotification.vue'

export default {

	computed: {
		...mapState(useMetamaskStore, ['metamaskState']),
		...mapState(usePlayerStore, ['player'])
	},

	methods: {
		...mapActions(useWeb3Store, ['getPlayer'])
	},

	watch: {
		metamaskState (newMetamaskState) {
			if (newMetamaskState === 'connected') {
				this.getPlayer()
			}
		}
	},

	components: {
		MetamaskNotification
	}

	// show player stats
	// get past events registered and finished attacks
}

</script>




<template>

<MetamaskNotification />

<hr>

<div v-if="metamaskState === 'connected'" class="box">
	<template v-if="player.length > 0">
		{{ player }}
	</template>
	<template v-else>
		<div class="notification is-info is-light">
			Please create a player.
		</div>
		<div class="field">
			<label class="label">Name</label>
			<div class="control">
				<input class="input is-primary" type="text" placeholder="Enter your player name..." />
			</div>
		</div>
		<div class="field is-grouped">
			<div class="control">
				<button class="button is-primary is-rounded">Submit</button>
			</div>
		</div>
	</template>
</div>

</template>




<style scoped>

	img {
		height: 1em;
		width: auto;
	}

</style>
