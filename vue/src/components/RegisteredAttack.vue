<script>

export default {

	props: {
		initialAttack: Object,
		currentMinute: Number,
		minutePrices: Object,
		playerNames: Object,
		socket: Object
	},

	mounted () {
		this.setPlayerNames()
	},

	data () {
		return {
			attack: this.initialAttack,
			battle: { price: 0, width: 50 }
		}
	},

	methods: {
		calculateAttackState () {
			const timestamp = Math.floor(Date.now() / 1000)
			if (this.attack.startingMinute > timestamp) {
				this.attack.state = 'registered'
			} else if (this.attack.startingMinute <= timestamp && timestamp <= this.attack.startingMinute + 60) {
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
		setStartPrice () {
			if (this.minutePrices[this.attack.startingMinute] !== undefined) {
				this.attack.startPrice = this.minutePrices[this.attack.startingMinute]
			} else {
				this.$parent.fetchMinutePrice(this.attack.startingMinute)
					.then(price => { this.attack.startPrice = price })
			}
		},
		setEndPrice () {
			if (this.minutePrices[this.attack.startingMinute + 60] !== undefined) {
				this.attack.endPrice = this.minutePrices[this.attack.startingMinute + 60]
			} else {
				this.$parent.fetchMinutePrice(this.attack.startingMinute + 60)
					.then(price => { this.attack.endPrice = price })
			}
		},
		setPlayerNames () {
			if (this.attack.attacker.name === '') {
				if (this.playerNames[this.attack.attacker.address] !== undefined) {
					this.attack.attacker.name = this.playerNames[this.attack.attacker.address]
				} else {
					this.$parent.fetchPlayerName(this.attack.attacker.address)
						.then(name => { this.attack.attacker.name = name })
				}
			}
			if (this.attack.defender.name === '') {
				if (this.playerNames[this.attack.defender.address] !== undefined) {
					this.attack.defender.name = this.playerNames[this.attack.defender.address]
				} else {
					this.$parent.fetchPlayerName(this.attack.defender.address)
						.then(name => { this.attack.defender.name = name })
				}
			}
		},
		setBarWidth (event) {
			if (this.attack.startPrice === 0) {
				return
			}
			const data = JSON.parse(event.data)
			const price = Number(data.p)
			let widthDifference = Number(((price / this.attack.startPrice - 1) / 0.0002).toFixed(2))
			const width = 50 + (this.attack.side ? widthDifference : -widthDifference)
			this.battle.price = price
			this.battle.width = width
			if ((this.attack.startingMinute + 60) * 1000 < data.T) {
				this.socket.removeEventListener('message', this.setBarWidth)
			}
		},
		startBattle () {
			this.socket.addEventListener('message', this.setBarWidth)
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
			<template
				v-if="attack.winner === 'attacker' && attack.attacker.isCurrentPlayer
					|| attack.winner === 'defender' && attack.defender.isCurrentPlayer"
			>
				you won!
			</template>
			<template v-else>
				you lost!
			</template>
		</p>
		<p v-else class="title">
			Fighting...
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
						'has-text-primary': attack.state === 'finished' && attack.startPrice <= attack.endPrice
							|| attack.state === 'fighting' && attack.startPrice <= battle.price,
						'has-text-danger': attack.state === 'finished' && attack.startPrice > attack.endPrice
							|| attack.state === 'fighting' && attack.startPrice > battle.price
					}"
				>
					{{ attack.state === 'fighting' ? battle.price : attack.endPrice }}
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
			:class="battle >= 50 ? 'has-background-primary' : 'has-background-danger'"
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

</style>