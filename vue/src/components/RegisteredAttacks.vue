<script>

import { mapState } from 'pinia'
import { useMetamaskStore } from '../stores/metamask.js'
import RegisterAttackForm from './RegisterAttackForm.vue'
import MetamaskNotification from './MetamaskNotification.vue'

export default {

	computed: {
		...mapState(useMetamaskStore, ['metamaskState']),
	},

	components: {
		RegisterAttackForm,
		MetamaskNotification
	}

}

</script>




<template>

<MetamaskNotification />

<hr>

<template v-if="metamaskState === 'connected'">

	<RegisterAttackForm />

</template>

</template>




<style scoped>

</style>
