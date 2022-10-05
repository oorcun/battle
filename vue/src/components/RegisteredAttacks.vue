<script>

import { mapState, mapActions } from 'pinia'
import { useMetamaskStore } from '../stores/metamask.js'
import { usePlayerStore } from '../stores/player.js'
import { useWeb3Store } from '../stores/web3.js'
import RegisterAttackForm from './RegisterAttackForm.vue'
import MetamaskNotification from './MetamaskNotification.vue'
import RegisteredAttack from './RegisteredAttack.vue'

export default {

	mounted () {
		this.openSocket()
		setInterval(this.setCurrentMinute, 1000)
	},

	beforeUnmount () {
		this.registeredAttacksAttackerListener.unsubscribe()
		this.registeredAttacksDefenderListener.unsubscribe()
		this.closeSocket()
	},

	data () {
		return {
			currentMinute: (new Date).getMinutes(),
			attacks: [],
			attackId: 1,
			attackGetError: false,
			fetchPlayerNameError: false,
			fetchMinutePriceError: false,
			fetchOraclePriceError: false,
			fetchOraclePriceNotSetWarning: false,
			registeredAttacksAttackerListener: undefined,
			registeredAttacksDefenderListener: undefined,
			socket: {},
			socketError: false,
			minutePrices: {},
			playerNames: {},
			oracleMinutePrices: {}
		}
	},

	computed: {
		...mapState(useMetamaskStore, ['metamaskState']),
		...mapState(usePlayerStore, ['playerState', 'player'])
	},

	methods: {
		...mapActions(useWeb3Store, ['getPastEvents', 'getAnyPlayer', 'listenEvent', 'getPrice']),
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
		fetchMinutePrice (minuteTimestamp) {
			fetch(
				`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&startTime=${(minuteTimestamp - 60) * 1000}&endTime=${minuteTimestamp * 1000}`
			)
				.then(response => response.json())
				.then(data => {
					if (data.length !== 2) {
						setTimeout(this.fetchMinutePrice, 1000, minuteTimestamp)
					}
					this.minutePrices[minuteTimestamp] = Number(Number(data[0][4]).toFixed(2))
				})
				.catch(error => {
					console.error(error)
					this.fetchMinutePriceError = true
				})
		},
		fetchPlayerName (address) {
			this.getAnyPlayer(address)
				.then(player => { this.playerNames[address] = player[1] })
				.catch(() => { this.fetchPlayerNameError = true })
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
				attackerIsCurrentPlayer = true
			} else {
				defenderName = this.player[1]
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
		},
		setAttacks (events) {
			Object.values(events).forEach(this.setAttack)
		},
		getPastAttacks () {
			if (this.metamaskState === 'connected' && this.playerState === 'exist') {
				this.getPastEvents('AttackRegistered', { filter: { attacker: this.player[2] } })
					.then(this.setAttacks)
					.catch(() => { this.attackGetError = true })
				this.getPastEvents('AttackRegistered', { filter: { defender: this.player[2] } })
					.then(this.setAttacks)
					.catch(() => { this.attackGetError = true })
			}
		},
		openSocket () {
			this.socket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade'),
			this.socket.addEventListener('error', error => {
				this.socketError = true
				console.error(error)
			})
		},
		closeSocket () {
			this.socket.close()
		},
		fetchOraclePrice (minuteTimestamp) {
			this.getPrice(minuteTimestamp)
				.then(price => { this.oracleMinutePrices[minuteTimestamp] = price })
				.catch(error => {
					if (error.message === 'PriceRequestContract: price not set') {
						this.fetchOraclePriceNotSetWarning = true
						// set timeout
					} else {
						this.fetchOraclePriceError = true
					}
				})
		}
	},

	watch: {
		playerState: {
			handler () {
				this.getPastAttacks()
				this.listenAttacks()
			},
			immediate: true
		}
	},

	components: {
		RegisterAttackForm,
		MetamaskNotification,
		RegisteredAttack
	}

}

</script>




<template>
{{oracleMinutePrices}}
<MetamaskNotification />

<hr>

<template v-if="metamaskState === 'connected'">

	<template v-if="playerState === 'exist'">

		<RegisterAttackForm />

		<hr>

		<div v-if="attackGetError" class="notification is-light is-danger">
			Error fetching past events, please check console.
		</div>
		<div v-if="fetchPlayerNameError" class="notification is-light is-danger">
			Error fetching a player, please check console.
		</div>
		<div v-if="fetchMinutePriceError" class="notification is-light is-danger">
			Error fetching a price, please check console.
		</div>
		<div v-if="socketError" class="notification is-light is-danger">
			Error on socket connection, please check console.
		</div>
		<div v-if="fetchOraclePriceError" class="notification is-light is-danger">
			Error on fetching oracle price, please check console.
		</div>
		<div v-if="fetchOraclePriceNotSetWarning" class="notification is-light is-warning">
			Price not set, oracle may be down or has insufficient funds.
		</div>

		<RegisteredAttack
			v-for="attack in attacks"
			:key="attack.id"
			:initialAttack="attack"
			:currentMinute="currentMinute"
			:socket="socket"
			:oracleStartPrice="oracleMinutePrices[attack.startingMinute]"
			:oracleEndPrice="oracleMinutePrices[attack.startingMinute + 60]"
			:startPrice="minutePrices[attack.startingMinute]"
			:endPrice="minutePrices[attack.startingMinute + 60]"
			:attackerName="playerNames[attack.attacker.address]"
			:defenderName="playerNames[attack.defender.address]"
		/>

	</template>

	<template v-else>
		<div class="notification is-light is-info">Please create a player.</div>
	</template>

</template>

</template>




<style>

</style>
