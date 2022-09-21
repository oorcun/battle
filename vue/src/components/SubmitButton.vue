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
			this.$emit('clicked')
			this.waiting = true
			this.method(...this.params)
				.finally(() => {
					this.waiting = false
					this.$emit('processed')
				})
		}
	}

}

</script>




<template>

	<button
		class="button is-primary is-rounded"
		:class="{ 'is-loading ': waiting }"
		:disabled="waiting || disabled"
		@click="submit()"
	>
		<slot>Submit</slot>
	</button>

</template>




<style scoped>

</style>
