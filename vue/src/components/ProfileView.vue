<script>

import { mapState, mapActions } from 'pinia'
import { useMetamaskStore } from '../stores/metamask.js'
import { useWeb3Store } from '../stores/web3.js'
import { usePlayerStore } from '../stores/player.js'
import MetamaskNotification from './MetamaskNotification.vue'
import SubmitButton from './SubmitButton.vue'

export default {

	data () {
		return {
			input: ''
		}
	},

	computed: {
		...mapState(useMetamaskStore, ['metamaskState']),
		...mapState(usePlayerStore, ['player', 'playerState'])
	},

	methods: {
		...mapActions(useWeb3Store, ['createPlayer'])
	},

	components: {
		MetamaskNotification,
		SubmitButton
	}
}

</script>




<template>

<MetamaskNotification />

<hr>

<div v-if="metamaskState === 'connected'" class="box">

	<template v-if="playerState === 'exist'">
		<table class="table">
			<tbody>
				<tr><th>ID</th><td>{{ player[0] }}</td></tr>
				<tr><th>Name</th><td>{{ player[1] }}</td></tr>
				<tr><th>Attacking Wins</th><td>{{ player[2] }}</td></tr>
				<tr><th>Attacking Losses</th><td>{{ player[3] }}</td></tr>
				<tr><th>Defending Wins</th><td>{{ player[4] }}</td></tr>
				<tr><th>Defending Losses</th><td>{{ player[5] }}</td></tr>
				<tr><th>Total Wins</th><td>{{ parseInt(player[2]) + parseInt(player[4]) }}</td></tr>
				<tr><th>Total Losses</th><td>{{ parseInt(player[3]) + parseInt(player[5]) }}</td></tr>
				<tr><th>Points</th><td>{{ player[6] }}</td></tr>
			</tbody>
		</table>
		<div>getpastevents</div>
	</template>

	<template v-else-if="playerState === 'notExist'">
		<div class="notification is-info is-light">
			Please create a player.
		</div>
		<div class="field">
			<label class="label">Name</label>
			<div class="control">
				<input class="input is-primary" type="text" placeholder="Enter your player name..." v-model="input" />
			</div>
		</div>
		<div class="field is-grouped">
			<div class="control">
				<SubmitButton :method="createPlayer" :params="[input]"/>
			</div>
		</div>
	</template>

	<template v-else>
		<div class="notification is-info is-light">
			Please wait while your player is fetching from the network. <img src="src/components/gifs/loading-loading-forever.gif">
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
