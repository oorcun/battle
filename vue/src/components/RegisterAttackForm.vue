<script>

import { mapState, mapActions } from 'pinia'
import { useWeb3Store } from '../stores/web3.js'
import { usePlayerStore } from '../stores/player.js'
import SubmitButton from './SubmitButton.vue'

export default {

	mounted () {
		this.setHalfInMinute()
		setInterval(this.setHalfInMinute, 1000)
		if (this.$route.query.address !== undefined) {
			this.address = this.$route.query.address
		}
	},

	data () {
		return {
			address: '',
			addressState: 'wrongAddress',
			selectedMinute: '',
			minuteState: 'unknown',
			selectedPrediction: 'increase',
			isSecondHalfInMinute: undefined
		}
	},

	computed: {
		...mapState(usePlayerStore, ['player']),
		minutes () {
			let date = new Date
			date.setSeconds(0)
			date.setMinutes(date.getMinutes() + 1)
			if (this.isSecondHalfInMinute) {
				date.setMinutes(date.getMinutes() + 1)
			}
			let minutes = {}
			for (let i = 0; i < 4; i++, date.setMinutes(date.getMinutes() + 1)) {
				let minuteDate = new Date(date)
				const hour = minuteDate.getHours()
				const minute = minuteDate.getMinutes()
				minutes[i] = {
					date: minuteDate,
					timestamp: Math.floor(minuteDate.getTime() / 1000),
					minute: (hour < 10 ? '0' + hour : hour) + ':' + (minute < 10 ? '0' + minute : minute)
				}
			}
			return minutes
		},
		addressStyle () {
			switch (this.addressState) {
			case 'ok':
				return {
					inputClass: 'is-primary',
					ionIconName: 'checkmark-circle',
					ionIconStyle: { color: 'rgb(0, 192, 164)' }
				}
			case 'loading':
				return {
					inputClass: '',
					ionIconName: '',
					ionIconStyle: {}
				}
			case 'noPlayer':
				return {
					inputClass: 'is-danger',
					ionIconName: 'alert-circle',
					ionIconStyle: { color: 'rgb(150, 11, 39)' }
				}
			case 'wrongAddress':
				return {
					inputClass: 'is-danger',
					ionIconName: 'alert-circle',
					ionIconStyle: { color: 'rgb(150, 11, 39)' }
				}
			case 'networkError':
				return {
					inputClass: 'is-warning',
					ionIconName: 'warning',
					ionIconStyle: { color: 'rgb(137, 101, 0)' }
				}
			default:
				return {}
			}
		},
		minuteStyle () {
			switch (this.minuteState) {
			case 'ok':
				return { selectClass: 'is-primary' }
			case 'unknown':
				return { selectClass: '' }
			case 'registered':
				return { selectClass: 'is-danger' }
			case 'networkError':
				return { selectClass: 'is-warning' }
			default:
				return {}
			}
		},
		isDisabled () {
			return this.addressState !== 'ok' || this.minuteState !== 'ok'
		}
	},

	methods: {
		...mapActions(useWeb3Store, ['registerAttack', 'getAnyPlayer', 'hasRegisteredAttack']),
		setHalfInMinute () {
			this.isSecondHalfInMinute = (new Date).getSeconds() >= 30 ? true : false
		},
		getMinuteTimestamp (minuteAsText) {
			const minute = Object.values(this.minutes).find(minute => minute.minute === minuteAsText)
			return minute !== undefined ? minute.timestamp : 0
		},
		playerhasRegisteredAttack (playerAddress, startingMinute) {
			this.hasRegisteredAttack(playerAddress, startingMinute)
				.then(receipt => { this.minuteState = receipt ? 'registered' : 'ok' })
				.catch(() => { this.minuteState = 'networkError' })
		}
	},

	watch: {
		minutes: {
			handler (newMinute) {
				if (Object.values(newMinute).every(minute => minute.minute !== this.selectedMinute)) {
					this.selectedMinute = newMinute[0].minute
				}
			},
			deep: true
		},
		address (newAddress) {
			if (newAddress.match(/^0x[0-9A-Fa-f]{40}$/) && newAddress !== this.player[2]) {
				this.addressState = 'loading'
				this.getAnyPlayer(newAddress)
					.then(() => { this.addressState = 'ok' })
					.catch(error => {
						if (error.message === 'Player: player not exist') {
							this.addressState = 'noPlayer'
						} else {
							this.addressState = 'networkError'
						}
					})
			} else {
				this.addressState = 'wrongAddress'
			}
		},
		addressState (newAddressState) {
			if (newAddressState === 'ok') {
				this.playerhasRegisteredAttack(this.player[2], this.getMinuteTimestamp(this.selectedMinute))
			} else {
				this.minuteState = 'unknown'
			}
		},
		selectedMinute (newSelectedMinute) {
			if (this.addressState === 'ok') {
				this.playerhasRegisteredAttack(this.player[2], this.getMinuteTimestamp(newSelectedMinute))
			} else {
				this.minuteState = 'unknown'
			}
		}
	},

	components: {
		SubmitButton
	}

}

</script>




<template>

<div class="box">

	<div class="field">
		<label class="label">Address</label>
		<div class="control has-icons-right" :class="{ 'is-loading': this.addressState === 'loading' }">
			<input class="input is-rounded" :class="addressStyle.inputClass" type="text" placeholder="Enter opponent address..." v-model="address" />
			<span v-if="addressState !== 'loading'" class="icon is-small is-right">
				<ion-icon :name="addressStyle.ionIconName" :style="addressStyle.ionIconStyle"></ion-icon>
			</span>
		</div>
		<p v-if="addressState === 'networkError'" class="help" :class="addressStyle.inputClass">Network error when fetching player, please check console.</p>
		<p v-else-if="addressState === 'noPlayer'" class="help" :class="addressStyle.inputClass">This player doesn't exist.</p>
	</div>

	<div class="field">
		<label class="label">Starting minute</label>
		<div class="control">
			<div class="select is-rounded" :class="minuteStyle.selectClass">
				<select v-model="selectedMinute">
					<option
						v-for="minute of minutes"
						:key="minute.timestamp"
					>
						{{ minute.minute }}
					</option>
				</select>
			</div>
		</div>
		<p v-if="minuteState === 'networkError'" class="help" :class="minuteStyle.selectClass">Network error when fetching register information, please check console.</p>
		<p v-else-if="minuteState === 'registered'" class="help" :class="minuteStyle.selectClass">An attack already registered at this time.</p>
	</div>

	<div class="field">
		<label class="label">Prediction</label>
		<div class="control">
			<label class="radio">
				<input type="radio" name="prediction" value="increase" v-model="selectedPrediction">
				Increase
			</label>
			<label class="radio">
				<input type="radio" name="prediction" value="decrease" v-model="selectedPrediction">
				Decrease
			</label>
		</div>
	</div>

	<div class="field is-grouped">
		<div class="control">
			<SubmitButton
				:method="registerAttack"
				:params="[address, getMinuteTimestamp(selectedMinute), selectedPrediction === 'increase' ? true : false]"
				:disabled="isDisabled"
				@processed="playerhasRegisteredAttack(player[2], getMinuteTimestamp(selectedMinute))"
			>
				Register Attack
			</SubmitButton>
		</div>
	</div>

</div>

</template>




<style scoped>

</style>
