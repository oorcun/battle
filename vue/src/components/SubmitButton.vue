<script>

export default {

	data () {
		return {
			waiting: false
		}
	},

	props: {
		method: Function,
		params: Array
	},

	methods: {
		submit () {
			this.waiting = true
			this.method(...this.params)
				.finally(() => { this.waiting = false })
		}
	}

}

</script>




<template>

	<button
		class="button is-primary is-rounded"
		:class="{ 'is-loading ': waiting }"
		:disabled="waiting"
		@click="submit()"
	>
		Submit
	</button>

</template>




<style scoped>

</style>
