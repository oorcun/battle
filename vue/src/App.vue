<script>

import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'

export default {

	components: {
		NavBar,
		RouterView
	}

}

</script>




<template>

	<NavBar />

	<hr>

	<RouterView />

</template>




<style scoped>

</style>
