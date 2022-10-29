<script>

import { useWeb3Store } from '../stores/web3.js'
import { mapState, mapActions } from 'pinia'
import SubmitButton from './SubmitButton.vue'

export default {

	mounted () {
		this.getOracleBalance()
		this.checkOracle()
	},

	data () {
		return {
			balance: undefined,
			oracleRunning: undefined,
			oracleError: false,
			oracleStartError: false
		}
	},

	computed: {
		...mapState(useWeb3Store, ['network']),
		oracleAddress () {
			return this.network.oracleAddress
		},
		url () {
			return this.network.oracleNetworkUrl
		}
	},

	methods: {
		...mapActions(useWeb3Store, ['getBalance']),
		getOracleBalance () {
			this.getBalance(this.oracleAddress)
				.then(balance => {
					this.balance = (balance / 1000000000000000000).toFixed(2)
				})
		},
		checkOracle () {
			fetch(this.url + '/check')
				.then(response => response.text())
				.then(data => {
					if (data === '1') {
						this.oracleRunning = true
					} else if (data === '0') {
						this.oracleRunning = false
					}
					this.oracleError = false
				})
				.catch(error => {
					this.oracleError = true
					console.error(error)
				})
		},
		startOracle () {
			return fetch(this.url + '/start')
				.then(response => response.text())
				.then(data => {
					if (data === '1') {
						this.oracleStartError = false
					} else if (data === '0') {
						this.oracleStartError = true
					}
					this.oracleError = false
				})
				.catch(error => {
					this.oracleError = true
					console.error(error)
				})
		}
	},

	components: {
		SubmitButton
	}
}

</script>




<template>

<div class="box">
	<ol>
		<li>Install <a href="https://metamask.io" target="_blank">Metamask <ion-icon name="arrow-redo"></ion-icon></a></li>
		<li>Select Goerli network for testing</li>
		<li>Connect wallet</li>
		<li>Get some <a href="https://faucets.chain.link" target="_blank">funds<ion-icon name="arrow-redo"></ion-icon></a></li>
		<li>Go to <i>Players</i> and click <i>Attack</i></li>
		<li>Select <i>Starting Minute</i> for the attack</li>
		<li>Choose <i>Prediction</i> for the Bitcoin price for your selected minute</li>
		<li>Click <i>Register Attack</i> and wait</li>
		<li>If you predict correctly you win otherwise you lose</li>
	</ol>
</div>

<div class="box">
	More information on <a href="https://github.com/oorcun/battle" target="_blank">GitHub <ion-icon name="arrow-redo"></ion-icon></a>
</div>

<div class="box">
	Check out the contract in <a href="https://goerli.etherscan.io/address/0x18a7f9109a906617a2dc7c904d5e218b28192f82#code" target="_blank">Goerli<ion-icon name="arrow-redo"></ion-icon></a>
</div>

<div class="box">
	Oracle address <a :href='`https://goerli.etherscan.io/address/${oracleAddress}`' target="_blank">{{ oracleAddress }}<ion-icon name="arrow-redo"></ion-icon></a>
</div>

<div class="box">
	Oracle balance ~{{ balance }} ether
</div>

<div class="box">
	<template v-if="oracleRunning === true">
		Oracle running
	</template>
	<template v-else-if="oracleRunning === false">
		Oracle not running <div class="box"><SubmitButton :method="startOracle">Start</SubmitButton></div>
	</template>
	<template v-else>
		Oracle status not reachable
	</template>
	<div v-if="oracleError" class="notification is-warning is-light">
		There was an error when reaching the oracle, please check console.
	</div>
	<div v-if="oracleStartError" class="notification is-warning is-light">
		There was an error when starting the oracle, please try again later.
	</div>
</div>

</template>




<style scoped>

</style>
