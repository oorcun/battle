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
		this.listenAttacks()
		setInterval(this.setCurrentMinute, 1000)
	},

	beforeUnmount () {
		if (this.registeredAttacksAttackerListener !== undefined) {
			this.registeredAttacksAttackerListener.unsubscribe()
		}
		if (this.registeredAttacksDefenderListener !== undefined) {
			this.registeredAttacksDefenderListener.unsubscribe()
		}
	},

	data () {
		return {
			currentMinute: (new Date).getMinutes(),
			attacks: [],
			attackId: 1,
			attackGetError: false,
			setPlayerNameError: false,
			priceGetError: false,
			registeredAttacksAttackerListener: undefined,
			registeredAttacksDefenderListener: undefined
		}
	},

	computed: {
		...mapState(useMetamaskStore, ['metamaskState']),
		...mapState(usePlayerStore, ['playerState', 'player']),
		...mapState(useWeb3Store, ['getAnyPlayer', 'listenEvent'])
	},

	methods: {
		...mapActions(useWeb3Store, ['getPastEvents']),
		setCurrentMinute () {
			this.currentMinute = (new Date).getMinutes()
		},
		listenAttacks () {
			if (this.metamaskState === 'connected' && this.playerState === 'exist') {
				this.registeredAttacksAttackerListener = this.listenEvent(
					'AttackRegistered', { filter: { attacker: this.player[2] } }
				).on('data', this.setAttack)
				this.registeredAttacksDefenderListener = this.listenEvent(
					'AttackRegistered', { filter: { defender: this.player[2] } }
				).on('data', this.setAttack)
			}
		},
		calculateAttackStates (attack) {
			const timestamp = Math.floor(Date.now() / 1000)
			if (attack.startingMinute > timestamp) {
				attack.state = 'registered'
			} else if (attack.startingMinute <= timestamp && timestamp <= attack.startingMinute + 60) {
				attack.state = 'fighting'
			} else {
				attack.state = 'finished'
			}
		},
		setWinner (attack) {
			if (attack.endPrice !== 0 && attack.endPrice !== 0) {
				if (attack.side) {
					attack.winner = attack.startPrice <= attack.endPrice ? 'attacker' : 'defender'
				} else {
					attack.winner = attack.startPrice >= attack.endPrice ? 'attacker' : 'defender'
				}
			}
		},
		getMinutePrice (minuteTimestamp) {
			return fetch(
				`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&startTime=${(minuteTimestamp - 60) * 1000}&endTime=${minuteTimestamp * 1000}`
			)
				.then(response => response.json())
				.then(data => {
					if (data.length !== 2) {
						return 0
					}
					return Number(data[0][4]).toFixed(2)
				})
				.catch(error => {
					console.error(error)
					throw error
				})
		},
		setMinutePrices (attack) {
			let reactiveAttack = this.attacks.find(item => item.id === attack.id)
			if (reactiveAttack.startPrice === 0) {
				this.getMinutePrice(reactiveAttack.startingMinute)
					.then(price => {
						reactiveAttack.startPrice = price
						this.setWinner(reactiveAttack)
					})
					.catch(() => { this.priceGetError = true })
			}
			if (reactiveAttack.endPrice === 0) {
				this.getMinutePrice(reactiveAttack.startingMinute + 60)
					.then(price => {
						reactiveAttack.endPrice = price
						this.setWinner(reactiveAttack)
					})
					.catch(() => { this.priceGetError = true })
			}
		},
		setPlayerName (address) {
			this.getAnyPlayer(address)
				.then(player => {
					this.attacks.forEach(attack => {
						if (attack.attacker.address === player[2]) {
							attack.attacker.name = player[1]
							return
						}
						if (attack.defender.address === player[2]) {
							attack.defender.name = player[1]
						}
					})
				})
				.catch(() => { this.setPlayerNameError = true })
		},
		setAttack (event) {
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
			let attack = {
				id: this.attackId++,
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
				state: 'registered',
				startPrice: 0,
				endPrice: 0,
				winner: ''
			}
			this.attacks.push(attack)
			this.attacks.sort((attack1, attack2) => attack1.startingMinute - attack2.startingMinute)
			this.setMinutePrices(attack)
			this.calculateAttackStates(attack)
		},
		setAttacks (events) {
			Object.values(events).forEach(this.setAttack)
		},
		getPastAttacks () {
			if (this.attacks.length === 0 && this.metamaskState === 'connected' && this.playerState === 'exist') {
				this.getPastEvents('AttackRegistered', { filter: { attacker: this.player[2] } })
					.then(this.setAttacks)
					.catch(() => { this.attackGetError = true })
				this.getPastEvents('AttackRegistered', { filter: { defender: this.player[2] } })
					.then(this.setAttacks)
					.catch(() => { this.attackGetError = true })
			}
		}
	},

	watch: {
		playerState () {
			this.getPastAttacks()
			this.listenAttacks()
		},
		currentMinute () {
			this.attacks.forEach(attack => { setTimeout(this.calculateAttackStates, 2000, attack) })
			this.attacks.forEach(attack => { setTimeout(this.setMinutePrices, 1000, attack) })
		}
	},

	components: {
		RegisterAttackForm,
		MetamaskNotification
	}

}

</script>




<template>

<MetamaskNotification />

<hr>

<template v-if="metamaskState === 'connected'">

	<template v-if="playerState === 'exist'">

		<RegisterAttackForm />

		<hr>

		<div v-if="attackGetError" class="notification is-light is-danger">
			Error fetching past events, please check console.
		</div>
		<div v-if="setPlayerNameError" class="notification is-light is-danger">
			Error fetching a player, please check console.
		</div>
		<div v-if="priceGetError" class="notification is-light is-danger">
			Error fetching a price, please check console.
		</div>

		<div v-for="attack in attacks" :key="attack.id" class="box">
			<div class="tile is-ancestor">
				<p v-if="attack.state === 'registered'" class="title">Waiting for battle to start...</p>
				<p v-else-if="attack.state === 'finished'" class="title">
					Battle finished,
					<template v-if="attack.winner === 'attacker' && attack.attacker.isCurrentPlayer || attack.winner === 'defender' && attack.defender.isCurrentPlayer">
						you won!
					</template>
					<template v-else>
						you lost!
					</template>
				</p>
			</div>
			<div class="tile is-ancestor">
				<div
					class="tile is-parent notification is-5 custom-left-tile has-text-right"
					:class="{
						'is-primary': attack.winner === 'attacker',
						'is-danger': attack.winner === 'defender',
						'is-info': attack.winner === '',
						'is-light': attack.state !== 'fighting'
					}"
				>
					<div class="tile is-child">
						<p class="title">
							{{ attack.attacker.name }}
							<ion-icon v-if="attack.side" class="has-text-primary" name="arrow-up-circle"></ion-icon>
							<ion-icon v-else class="has-text-danger" name="arrow-down-circle"></ion-icon>
						</p>
						<p>{{ attack.attacker.address }}</p>
					</div>
					<div class="tile is-child">
						<p class="title"><ion-icon class="person" name="person"></ion-icon></p>
					</div>
				</div>
				<div class="tile is-2 is-parent is-vertical has-text-centered">
					<div class="tile is-child">
						<p class="title">{{ attack.startPrice }}</p>
						<p
							class="title"
							:class="{
								'has-text-primary': attack.state === 'finished' && attack.startPrice <= attack.endPrice,
								'has-text-danger': attack.state === 'finished' && attack.startPrice > attack.endPrice
							}"
						>
							{{ attack.endPrice }}
						</p>
					</div>
				</div>
				<div
					class="tile is-parent notification is-5"
					:class="{
						'is-primary': attack.winner === 'defender',
						'is-danger': attack.winner === 'attacker',
						'is-info': attack.winner === '',
						'is-light': attack.state !== 'fighting'
					}"
				>
					<div class="tile is-child">
						<p class="title"><ion-icon class="person" name="person"></ion-icon></p>
					</div>
					<div class="tile is-child">
						<p class="title">
							<ion-icon v-if="attack.side" class="has-text-danger" name="arrow-down-circle"></ion-icon>
							<ion-icon v-else class="has-text-primary" name="arrow-up-circle"></ion-icon>
							{{ attack.defender.name }}
						</p>
						<p>{{ attack.defender.address }}</p>
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
<pre>{{attacks.length}}</pre>
</template>




<style scoped>

.person {
	font-size: 128px;
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
