<script>

import { mapState, mapActions } from 'pinia'
import { useMetamaskStore } from '../stores/metamask.js'
import { useWeb3Store } from '../stores/web3.js'
import MetamaskNotification from './MetamaskNotification.vue'
import SubmitButton from './SubmitButton.vue'

export default {

	mounted () {
		if (this.metamaskState === 'connected') {
			this.getPlayerList()
		}
	},

	data () {
		return {
			players: []
		}
	},

	computed: {
		...mapState(useMetamaskStore, ['metamaskState'])
	},

	methods: {
		...mapActions(useWeb3Store, ['getPlayers']),
		getPlayerList () {
			this.getPlayers(0, 0)
				.then(result => this.players = result)
		}
	},

	components: {
		MetamaskNotification,
		SubmitButton
	},

	watch: {
		metamaskState (newMetamaskState) {
			if (newMetamaskState === 'connected') {
				this.getPlayerList()
			}
		}
	}

}

</script>




<template>

<MetamaskNotification />

<hr>

<div v-if="metamaskState === 'connected'" class="box">
	<table class="table is-hoverable">
		<tbody>
			<tr v-for="player in players" :key="player.id">
				<th>{{ player.id }}</th>
				<td>{{ player.name }}</td>
				<td><SubmitButton>Attack</SubmitButton></td>
			</tr>
		</tbody>
	</table>
</div>

</template>




<style scoped>

</style>
