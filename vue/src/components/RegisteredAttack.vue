<script>

import { mapActions } from 'pinia'
import { useWeb3Store } from '../stores/web3.js'
import SubmitButton from './SubmitButton.vue'

// This component uses parent functions, so it is not reusable.
export default {

	props: {
		initialAttack: Object,
		currentMinute: Number,
		startPrice: Number,
		endPrice: Number,
		socket: Object,
		oracleStartPrice: Number,
		oracleEndPrice: Number,
		attackerName: String,
		defenderName: String
	},

	mounted () {
		this.setPlayerNames()
	},

	components: {
		SubmitButton
	},

	data () {
		return {
			attack: this.initialAttack,
			battle: { price: 0, width: 50, started: false },
			finishAttackError: false
		}
	},

	methods: {
		...mapActions(useWeb3Store, ['finishAttack']),
		calculateAttackState () {
			const timestamp = Math.floor(Date.now() / 1000)
			if (this.attack.startingMinute > timestamp) {
				this.attack.state = 'registered'
			} else if (this.attack.startingMinute <= timestamp && timestamp < this.attack.startingMinute + 60) {
				this.attack.state = 'fighting'
			} else if (this.attack.state !== 'finished') {
				this.attack.state = 'finished'
			}
		},
		setWinner () {
			if (this.attack.side) {
				this.attack.winner = this.attack.startPrice <= this.attack.endPrice ? 'attacker' : 'defender'
			} else {
				this.attack.winner = this.attack.startPrice >= this.attack.endPrice ? 'attacker' : 'defender'
			}
		},
		isWinnerSet () {
			return this.attack.winner !== ''
		},
		setPrice (minuteTimestamp) {
			this.$parent.fetchMinutePrice(minuteTimestamp)
		},
		isStartPriceSet () {
			return this.attack.startPrice > 0
		},
		isEndPriceSet () {
			return this.attack.endPrice > 0
		},
		setPlayerNames () {
			if (this.attackerName === undefined) {
				this.$parent.fetchPlayerName(this.attack.attacker.address)
			} else {
				this.attack.attacker.name = this.attackerName
			}
			if (this.defenderName === undefined) {
				this.$parent.fetchPlayerName(this.attack.defender.address)
			} else {
				this.attack.defender.name = this.defenderName
			}
		},
		setBarWidth (event) {
			const data = JSON.parse(event.data)
			const price = Number(data.p)
			let widthDifference = Number(((price / this.attack.startPrice - 1) / 0.0002).toFixed(2))
			const width = 50 + (this.attack.side ? widthDifference : -widthDifference)
			this.battle.price = price
			this.battle.width = width
		},
		startBattle () {
			this.socket.addEventListener('message', this.setBarWidth)
			this.battle.started = true
		},
		stopBattle () {
			this.socket.removeEventListener('message', this.setBarWidth)
			this.battle.started = false
		},
		isBattleStarted () {
			return this.battle.started
		},
		isOracleStartPriceSet () {
			return this.oracleStartPrice > 0
		},
		isOracleEndPriceSet () {
			return this.oracleEndPrice > 0
		},
		isCurrentPlayerWon () {
			return this.attack.winner === 'attacker' && this.attack.attacker.isCurrentPlayer
				|| this.attack.winner === 'defender' && this.attack.defender.isCurrentPlayer
		},
		setOraclePrice (minuteTimestamp) {
			this.$parent.fetchOraclePrice(minuteTimestamp)
		}
	},

	computed: {
		claimWinButtonDisplay () {
			return this.attack.state === 'finished'
				&& this.isOracleStartPriceSet()
				&& this.isOracleEndPriceSet()
				&& this.isCurrentPlayerWon()
		},
		waitOracleLoadingDisplay () {
			return this.attack.state === 'finished'
				&& (!this.isOracleStartPriceSet() || !this.isOracleEndPriceSet())
		}
	},

	watch: {
		currentMinute: {
			handler () {
				if (this.attack.state === 'finished') {
					if (this.isStartPriceSet() && !this.isOracleStartPriceSet()) {
						this.setOraclePrice(this.attack.startingMinute)
					}
					if (this.isEndPriceSet() && !this.isOracleEndPriceSet()) {
						this.setOraclePrice(this.attack.startingMinute + 60)
					}
				} else {
					this.calculateAttackState()
				}
			},
			immediate: true
		},
		attack: {
			handler (attack) {
				if (attack.state === 'fighting') {
					if (!this.isStartPriceSet()) {
						this.setPrice(attack.startingMinute)
					} else {
						if (!this.isBattleStarted()) {
							this.startBattle()
						}
						if (!this.isOracleStartPriceSet()) {
							this.setOraclePrice(attack.startingMinute)
						}
					}
				} else if (attack.state === 'finished') {
					if (this.isBattleStarted()) {
						this.stopBattle()
					}
					if (!this.isStartPriceSet()) {
						this.setPrice(attack.startingMinute)
					}
					if (!this.isEndPriceSet()) {
						this.setPrice(attack.startingMinute + 60)
					}
					if (!this.isWinnerSet() && this.isStartPriceSet() && this.isEndPriceSet()) {
						this.setWinner()
					}
					if (!this.isOracleStartPriceSet() && this.isStartPriceSet()) {
						this.setOraclePrice(attack.startingMinute)
					}
					if (!this.isOracleEndPriceSet() && this.isEndPriceSet()) {
						this.setOraclePrice(attack.startingMinute + 60)
					}
				}
			},
			deep: true
		},
		oracleStartPrice (price) {
			if (this.attack.startPrice !== price) {
				this.attack.startPrice = price
				if (this.isEndPriceSet()) {
					this.setWinner()
				}
			}
		},
		oracleEndPrice (price) {
			if (this.attack.endPrice !== price) {
				this.attack.endPrice = price
				if (this.isStartPriceSet()) {
					this.setWinner()
				}
			}
		},
		startPrice (price) {
			this.attack.startPrice = price
		},
		endPrice (price) {
			this.attack.endPrice = price
		},
		attackerName (name) {
			this.attack.attacker.name = name
		},
		defenderName (name) {
			this.attack.defender.name = name
		}
	}
}

</script>




<template>

<div class="box">

	<div class="tile is-ancestor">
		<p v-if="attack.state === 'registered'" class="title">
			Waiting for battle to start...
		</p>
		<p v-else-if="attack.state === 'finished'" class="title">
			Battle finished,
			<template v-if="isCurrentPlayerWon()"> you won! </template>
			<template v-if="!isCurrentPlayerWon()"> you lost!</template>
			<template v-if="isCurrentPlayerWon() && waitOracleLoadingDisplay">
				<img src="/src/components/gifs/loading-loading-forever.gif">
			</template>
			<SubmitButton
				v-if="claimWinButtonDisplay"
				:method="finishAttack"
				:params="[attack.attacker.address, attack.startingMinute]"
				@errored="finishAttackError = true"
			>Claim Win</SubmitButton>
		</p>
		<p v-else class="title">
			Fighting...
		</p>
	</div>
	<div v-if="finishAttackError" class="notification is-light is-danger">
		Error finishing an attack, please check console.
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
				<p class="title">{{ isStartPriceSet() ? attack.startPrice : '' }}</p>
				<p
					class="title"
					:class="{
						'has-text-primary': attack.state === 'finished' && attack.startPrice <= attack.endPrice
							|| attack.state === 'fighting' && attack.startPrice <= battle.price,
						'has-text-danger': attack.state === 'finished' && attack.startPrice > attack.endPrice
							|| attack.state === 'fighting' && attack.startPrice > battle.price
					}"
				>
					{{ attack.state === 'fighting' ? battle.price : isEndPriceSet() ? attack.endPrice : '' }}
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

	<div
		v-if="attack.state === 'fighting'"
		:class="battle.width >= 50 ? 'has-background-danger' : 'has-background-primary'"
	>
		<div
			class="tile battle-bar"
			:class="battle.width >= 50 ? 'has-background-primary' : 'has-background-danger'"
			:style="{ width: battle.width + '%' }"
		></div>
	</div>

</div>

</template>




<style>

/* csslint important: false */

.person {
	font-size: 128px;
}

.custom-left-tile {
	margin-bottom: 0 !important;
}

.is-ancestor {
	overflow: hidden;
	white-space: nowrap;
}

.battle-bar {
	height: 36px;
}

img {
	height: 1em;
}

</style>
