<script>

import { mapState, mapActions } from 'pinia'
import { useMetamaskStore } from '../stores/metamask.js'
import { usePlayerStore } from '../stores/player.js'
import { useWeb3Store } from '../stores/web3.js'
import RegisterAttackForm from './RegisterAttackForm.vue'
import MetamaskNotification from './MetamaskNotification.vue'

export default {

	mounted () {
		this.getPastAttacks()
		setInterval(this.setCurrentMinute, 1000)
	},

	data () {
		return {
			currentMinute: (new Date).getMinutes(),
			attacks: [],
			attackGetError: false,
			setPlayerNameError: false
		}
	},

	computed: {
		...mapState(useMetamaskStore, ['metamaskState']),
		...mapState(usePlayerStore, ['playerState', 'player']),
		...mapState(useWeb3Store, ['getAnyPlayer']),
	},

	methods: {
		...mapActions(useWeb3Store, ['getPastEvents']),
		setCurrentMinute () {
			this.currentMinute = (new Date).getMinutes()
		},
		calculateAttackStates () {
			const timestamp = Math.floor(Date.now() / 1000)
			this.attacks.forEach(attack => {
				if (attack.startingMinute > timestamp) {
					attack.state = 'registered'
				} else if (attack.startingMinute <= timestamp && timestamp <= attack.startingMinute + 60) {
					attack.state = 'fighting'
				} else {
					attack.state = 'finished'
				}
			})
		},
		setPlayerName (address) {
			this.getAnyPlayer(address)
				.then(console.log)
				.catch(() => { this.setPlayerNameError = true })
		},
		sanitizeAttacks (events) {
			Object.values(events).forEach(event => {
				const attacker = event.returnValues.attacker
				const defender = event.returnValues.defender
				let attackerName = ''
				let defenderName = ''
				let attackerIsCurrentPlayer = false
				let defenderIsCurrentPlayer = false
				if (attacker === this.player[2]) {
					attackerName = this.player[1]
					this.setPlayerName(defender)
					attackerIsCurrentPlayer = true
					defenderIsCurrentPlayer = false
				} else {
					this.setPlayerName(attacker)
					defenderName = this.player[1]
					attackerIsCurrentPlayer = false
					defenderIsCurrentPlayer = true
				}
				this.attacks.push({
					attacker: {
						name: attackerName,
						address: attacker,
						isCurrentPlayer: attackerIsCurrentPlayer
					},
					defender: {
						name: defenderName,
						address: defender,
						isCurrentPlayer: defenderIsCurrentPlayer
					},
					side: event.returnValues.side,
					startingMinute: Number(event.returnValues.startingMinute),
					state: 'registered'
				})
			})
			this.attacks.sort((attack1, attack2) => attack1.startingMinute - attack2.startingMinute)
			this.calculateAttackStates()
		},
		getPastAttacks () {
			if (this.attacks.length === 0 && this.metamaskState === 'connected' && this.playerState === 'exist') {
				this.getPastEvents('AttackRegistered', { filter: { attacker: this.player[2] } })
					.then(this.sanitizeAttacks)
					.catch(() => { this.attackGetError = true })
				this.getPastEvents('AttackRegistered', { filter: { defender: this.player[2] } })
					.then(this.sanitizeAttacks)
					.catch(() => { this.attackGetError = true })
			}
		}
	},

	watch: {
		playerState () {
			this.getPastAttacks()
		},
		currentMinute () {
			this.calculateAttackStates()
		}
	},

	components: {
		RegisterAttackForm,
		MetamaskNotification
	}

}

</script>




<template>
{{attacks}}
<MetamaskNotification />

<hr>

<template v-if="metamaskState === 'connected'">

	<template v-if="playerState === 'exist'">

		<RegisterAttackForm />

		<hr>

		<div v-if="attackGetError" class="notification is-light is-danger">Error fetching past events, please check console.</div>

		<div class="box">
			<div class="tile is-ancestor">
				<div class="tile is-parent notification is-info is-light is-5 custom-left-tile has-text-right">
					<div class="tile is-child">
						<p class="title">orcun <ion-icon name="arrow-up-circle"></ion-icon></p>
						<p>0x6f9eB65FC703dd3D9e5251ae581f3612f9289A7a</p>
					</div>
					<div class="tile is-child">
						<p class="title"><ion-icon name="person"></ion-icon></p>
					</div>
				</div>
				<div class="tile is-2 is-parent is-vertical has-text-centered">
					<div class="tile is-child">
						<p class="title">19399.16</p>
						<p class="title">19414.59</p>
					</div>
				</div>
				<div class="tile is-parent notification is-info is-light is-5">
					<div class="tile is-child">
						<p class="title"><ion-icon name="person"></ion-icon></p>
					</div>
					<div class="tile is-child">
						<p class="title"><ion-icon name="arrow-down-circle"></ion-icon> orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2</p>
						<p>0x2769144e0d5A297090e401B8f00C286a7540E989</p>
					</div>
				</div>
			</div>
			<div class="tile battle-bar"></div>
		</div>

	</template>

	<template v-else>
		<div class="notification is-light is-info">Please create a player.</div>
	</template>

</template>

</template>




<style scoped>

ion-icon[name="person"] {
	font-size: 128px;
}

ion-icon[name="arrow-up-circle"] {
	color: #48c78e;
}

ion-icon[name="arrow-down-circle"] {
	color: rgb(150, 11, 39);
}

.custom-left-tile {
	margin-bottom: 0;
}

.is-ancestor {
	overflow: hidden;
	white-space: nowrap;
}

.battle-bar {
	background-color: #48c78e;
	height: 36px;
	width: 30%;
}

</style>
