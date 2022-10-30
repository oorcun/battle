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
			input: '',
			createPlayerError: false
		}
	},

	computed: {
		...mapState(useMetamaskStore, ['metamaskState']),
		...mapState(usePlayerStore, ['player', 'playerState', 'setPlayerNameError', 'attacks', 'attacksState']),
		sortedAttacks () {
			return [...this.attacks].sort((attack1, attack2) => attack2.startingMinute - attack1.startingMinute)
		}
	},

	methods: {
		...mapActions(useWeb3Store, ['createPlayer', 'decToHex']),
		sanitizeDateTimePart (value) {
			return value < 10 ? '0' + value : value
		},
		parseDatetime (timestamp) {
			const date = new Date(timestamp * 1000)
			return `${date.getFullYear()}-${this.sanitizeDateTimePart(date.getMonth())}-${this.sanitizeDateTimePart(date.getDay())} ${this.sanitizeDateTimePart(date.getHours())}:${this.sanitizeDateTimePart(date.getMinutes())}`
		},
		cellClass (attack, side) {
			return {
				'has-text-weight-bold': attack[side].isCurrentPlayer,
				'has-text-primary-dark': attack[side].isCurrentPlayer && attack.isPlayerWon,
				'has-text-danger-dark': attack[side].isCurrentPlayer && !attack.isPlayerWon
			}
		}
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

		<table class="table is-fullwidth is-striped is-hoverable">
			<tbody>
				<tr><th>ID</th><td>{{ player[0] }}</td></tr>
				<tr><th>Name</th><td>{{ player[1] }}</td></tr>
				<tr><th>Owner</th><td>{{ this.decToHex(player[2]) }}</td></tr>
				<tr><th>Attacking Wins</th><td>{{ player[3] }}</td></tr>
				<tr><th>Attacking Losses</th><td>{{ player[4] }}</td></tr>
				<tr><th>Defending Wins</th><td>{{ player[5] }}</td></tr>
				<tr><th>Defending Losses</th><td>{{ player[6] }}</td></tr>
				<tr><th>Total Wins</th><td>{{ parseInt(player[3]) + parseInt(player[5]) }}</td></tr>
				<tr><th>Total Losses</th><td>{{ parseInt(player[4]) + parseInt(player[6]) }}</td></tr>
				<tr><th>Points</th><td>{{ player[7] }}</td></tr>
			</tbody>
		</table>

		<div v-if="setPlayerNameError" class="notification is-light is-warning">
			Some player names cannot be fetched, please check console.
		</div>

		<hr>

		<table v-if="attacksState === 'fetched'" class="table is-fullwidth battles">
			<thead>
				<tr>
					<th>Datetime</th>
					<th>Attacker Name</th>
					<th>Attacker Address</th>
					<th>Defender Name</th>
					<th>Defender Address</th>
					<th>Winner</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="attack in sortedAttacks"
					:key="attack.id"
					:class="attack.isPlayerWon ? 'has-background-primary-light' : 'has-background-danger-light'"
				>
					<td>{{ parseDatetime(attack.startingMinute) }}</td>
					<td :class="cellClass(attack, 'attacker')">{{ attack.attacker.name }}</td>
					<td :class="cellClass(attack, 'attacker')">{{ attack.attacker.address }}</td>
					<td :class="cellClass(attack, 'defender')">{{ attack.defender.name }}</td>
					<td :class="cellClass(attack, 'defender')">{{ attack.defender.address }}</td>
					<td>{{ attack.winner }}</td>
				</tr>
			</tbody>
		</table>

	</template>

	<template v-else-if="playerState === 'notExist'">
		<div class="notification is-info is-light">
			Please create a player.
		</div>
		<div class="field">
			<label class="label">Name</label>
			<div class="control">
				<input
					class="input is-rounded"
					type="text"
					placeholder="Enter your player name..."
					v-model="input"
					:class="input.length > 0 ? 'is-primary' : 'is-danger'"
				/>
			</div>
		</div>
		<div class="field is-grouped">
			<div class="control">
				<SubmitButton
					:disabled="input.length === 0"
					:method="createPlayer"
					:params="[input]"
					@errored="createPlayerError = true"
				/>
			</div>
		</div>
		<div v-if="createPlayerError" class="notification is-light is-danger">
			Error on creating a player, please check console.
		</div>
	</template>

	<template v-else>
		<div class="notification is-info is-light">
			Please wait while your player is fetching from the network. <img src="/src/components/gifs/loading-loading-forever.gif">
		</div>
	</template>

</div>

</template>




<style scoped>

img {
	height: 1em;
	width: auto;
}

.battles {
	table-layout: fixed;
	white-space: nowrap;
}

.battles td {
	overflow: hidden;
	text-overflow: ellipsis;
}

</style>
