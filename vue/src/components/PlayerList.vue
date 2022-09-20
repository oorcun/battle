<script>

import { mapState, mapActions } from 'pinia'
import { useMetamaskStore } from '../stores/metamask.js'
import { useWeb3Store } from '../stores/web3.js'
import { usePlayerStore } from '../stores/player.js'
import { useRouteStore } from '../stores/route.js'
import MetamaskNotification from './MetamaskNotification.vue'

export default {

	mounted () {
		if (this.metamaskState === 'connected') {
			this.getPlayerList()
		}
	},

	data () {
		return {
			players: [],
			error: false
		}
	},

	computed: {
		...mapState(useMetamaskStore, ['metamaskState']),
		...mapState(usePlayerStore, ['player']),
		...mapState(useRouteStore, ['redirectParams'])
	},

	methods: {
		...mapActions(useWeb3Store, ['getPlayers', 'decToHex']),
		getPlayerList () {
			this.getPlayers(0, 0)
				.then(result => this.players = result)
				.catch(() => { this.error = true })
		},
		redirectToAttacks (address) {
			this.redirectParams.push(address)
			this.$router.push({ name: 'registeredAttacks' })
		}
	},

	components: {
		MetamaskNotification
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

<div v-if="error" class="notification is-danger">
	Error fetching players, please check console for details.
</div>

<div v-if="metamaskState === 'connected'" class="box">
	<table class="table is-hoverable is-fullwidth is-striped">
		<tbody>
			<tr v-for="p in players" :key="p.id">
				<th>{{ p[0] }}</th>
				<td>{{ p[1] }}</td>
				<td>{{ this.decToHex(p[2]) }}</td>
				<td><button
					v-if="p.id !== player.id"
					class="button is-danger is-rounded"
					@click="redirectToAttacks(p[2])"
				>
					Attack <ion-icon name="arrow-redo"></ion-icon>
				</button></td>
			</tr>
		</tbody>
	</table>
</div>

</template>




<style scoped>

</style>
