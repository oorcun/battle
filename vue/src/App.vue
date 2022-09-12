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

	<section class="section">
		<div class="container">

			<NavBar />

			<hr>

			<RouterView />

		</div>
	</section>

</template>




<style scoped>

</style>
