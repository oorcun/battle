<script>

import { mapState, mapActions } from 'pinia'
import { useMetamaskStore } from '../stores/metamask.js'
import { useWeb3Store } from '../stores/web3.js'
import { usePlayerStore } from '../stores/player.js'
import MetamaskNotification from './MetamaskNotification.vue'

export default {

	computed: {
		...mapState(useMetamaskStore, ['metamaskState']),
		...mapState(usePlayerStore, ['player', 'playerState'])
	},

	methods: {
		...mapActions(useWeb3Store, ['getPlayer', 'createPlayer'])

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
	<template v-if="playerState === 'exist'">
		<div @click="player = []">{{ player }}</div>
	</template>
	<template v-else-if="playerState === 'notExist'">
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
				<button class="button is-primary is-rounded" @click="createPlayer('orcun')">Submit</button>
			</div>
		</div>
	</template>
	<template v-else>
		<div class="notification is-danger is-light">
			Player fetching error, check console.
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
