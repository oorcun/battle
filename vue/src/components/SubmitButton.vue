<script>

export default {

	data () {
		return {
			waiting: false
		}
	},

	props: {
		method: Function,
		params: Array,
		disabled: Boolean
	},

	methods: {
		submit () {
			// todo error check to all places in submit button
			// improve success scenarios in all places
			// get player after attack finished
			this.$emit('clicked')
			this.waiting = true
			this.method(...this.params)
				.then(() => { this.$emit('processed') })
				.finally(() => { this.waiting = false })
		}
	}

}

</script>




<template>

	<button
		class="button is-primary is-rounded"
		:class="{ 'is-loading': waiting }"
		:disabled="waiting || disabled"
		@click="submit()"
	>
		<slot>Submit</slot>
	</button>

</template>




<style scoped>

</style>
