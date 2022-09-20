<script>

import { mapState, mapActions } from 'pinia'
import { useWeb3Store } from '../stores/web3.js'
import { usePlayerStore } from '../stores/player.js'
import SubmitButton from './SubmitButton.vue'

export default {

	mounted () {
		this.setCurrentDate()
		this.setMinutes()
		setInterval(this.setCurrentDate, 1000)
		if (this.$route.query.address !== undefined) {
			this.address = this.$route.query.address
		}
	},

	data () {
		return {
			address: '',
			addressStyle: {
				state: 'wrongAddress',
				inputClass: 'is-danger',
				ionIconName: 'alert-circle',
				ionIconStyle: { color: 'rgb(150, 11, 39)' }
			},
			selectedMinute: '',
			selectedPrediction: 'increase',
			minutes: {},
			minutesLength: 4,
			currentDate: {}
		}
	},

	computed: {
		...mapState(usePlayerStore, ['player'])
	},

	methods: {
		...mapActions(useWeb3Store, ['registerAttack', 'getAnyPlayer']),
		setCurrentDate () {
			const date = new Date
			this.currentDate = {
				date: date,
				firstHalf: date.getSeconds() < 30 ? true : false
			}
		},
		setMinutes () {
			let date = new Date(this.currentDate.date)
			date.setSeconds(0)
			date.setMinutes(date.getMinutes() + 1)
			if (!this.currentDate.firstHalf) {
				date.setMinutes(date.getMinutes() + 1)
			}
			let minutes = {}
			for (let i = 0; i < this.minutesLength; i++, date.setMinutes(date.getMinutes() + 1)) {
				let minuteDate = new Date(date)
				const hour = minuteDate.getHours()
				const minute = minuteDate.getMinutes()
				minutes[i] = {
					date: minuteDate,
					timestamp: Math.floor(minuteDate.getTime() / 1000),
					minute: (hour < 10 ? '0' + hour : hour) + ':' + (minute < 10 ? '0' + minute : minute)
				}
			}
			this.minutes = minutes
		}
	},

	watch: {
		'currentDate.firstHalf' (newFirstHalf, oldFirstHalf) {
			if (oldFirstHalf !== undefined && !newFirstHalf) {
				for (let i = 0; i < this.minutesLength; i++) {
					const minuteDate = new Date(this.minutes[i].date)
					minuteDate.setMinutes(minuteDate.getMinutes() + 1)
					this.minutes[i].date = minuteDate
					this.minutes[i].timestamp += 60
					const hour = minuteDate.getHours()
					const minute = minuteDate.getMinutes()
					this.minutes[i].minute = (hour < 10 ? '0' + hour : hour) + ':' + (minute < 10 ? '0' + minute : minute)
				}
			}
		},
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
				this.addressStyle = {
					state: 'loading',
					inputClass: '',
					ionIconName: '',
					ionIconStyle: {}
				}
				this.getAnyPlayer(newAddress)
					.then(() => {
						this.addressStyle = {
							state: 'ok',
							inputClass: 'is-primary',
							ionIconName: 'checkmark-circle',
							ionIconStyle: { color: 'rgb(0, 192, 164)' }
						}
					})
					.catch(error => {
						if (error.message === 'Player: player not exist') {
							this.addressStyle = {
								state: 'noPlayer',
								inputClass: 'is-danger',
								ionIconName: 'alert-circle',
								ionIconStyle: { color: 'rgb(150, 11, 39)' }
							}
						} else {
							this.addressStyle = {
								state: 'networkError',
								inputClass: 'is-warning',
								ionIconName: 'warning',
								ionIconStyle: { color: 'rgb(137, 101, 0)' }
							}
						}
					})
			} else {
				this.addressStyle = {
					state: 'wrongAddress',
					inputClass: 'is-danger',
					ionIconName: 'alert-circle',
					ionIconStyle: { color: 'rgb(150, 11, 39)' }
				}
			}
		}
	},

	components: {
		SubmitButton
	}

}

</script>




<template>

<div class="field">
	<label class="label">Address</label>
	<div class="control has-icons-right" :class="{ 'is-loading': this.addressStyle.state === 'loading' }">
		<input class="input is-rounded" :class="addressStyle.inputClass" type="text" placeholder="Enter opponent address..." v-model="address" />
		<span v-if="addressStyle.state !== 'loading'" class="icon is-small is-right">
			<ion-icon :name="addressStyle.ionIconName" :style="addressStyle.ionIconStyle"></ion-icon>
		</span>
	</div>
	<p v-if="addressStyle.state === 'networkError'" class="help" :class="addressStyle.inputClass">Network error when fetching player, please check console.</p>
	<p v-else-if="addressStyle.state === 'noPlayer'" class="help" :class="addressStyle.inputClass">This player doesn't exist.</p>
</div>

<div class="field">
	<label class="label">Starting minute</label>
	<div class="control">
		<div class="select is-primary is-rounded">
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
		<SubmitButton :method="registerAttack" :params="[address.value]" disabled>Register Attack</SubmitButton>
	</div>
</div>

</template>




<style scoped>

</style>

