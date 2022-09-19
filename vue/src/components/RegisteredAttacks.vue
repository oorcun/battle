<script>

import { mapState, mapActions } from 'pinia'
import { useMetamaskStore } from '../stores/metamask.js'
import { useWeb3Store } from '../stores/web3.js'
import MetamaskNotification from './MetamaskNotification.vue'
import SubmitButton from './SubmitButton.vue'

export default {

	mounted () {
		this.setCurrentDate()
		this.setMinutes()
		setInterval(this.setCurrentDate, 1000)
	},

	data () {
		return {
			address: '',
			selectedMinute: '',
			minutes: {},
			minutesLength: 4,
			currentDate: {}
		}
	},

	computed: {
		...mapState(useMetamaskStore, ['metamaskState'])
	},

	methods: {
		...mapActions(useWeb3Store, ['registerAttack']),
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
				if (this.minutes[0] !== undefined) {
					return this.minutes[0].minute
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
		}
	},

	components: {
		MetamaskNotification,
		SubmitButton
	}

}

</script>




<template>
{{currentDate}}
<MetamaskNotification />
{{selectedMinute}}
<hr>

<template v-if="metamaskState === 'connected'">
	<div class="field">
		<label class="label">Address</label>
		<div class="control">
			<input class="input is-primary is-rounded" type="text" placeholder="Enter opponent address..." v-model="address" />
		</div>
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
	<div class="field is-grouped">
		<div class="control">
			<SubmitButton :method="registerAttack" :params="[address]">Register Attack</SubmitButton>
		</div>
	</div>
</template>

</template>




<style scoped>

</style>
