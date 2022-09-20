<script>

import { RouterLink } from 'vue-router'
import ProfileButton from './ProfileButton.vue'


export default {

	methods: {
		routes () {
			return this.$router.getRoutes().filter(route => route.name !== 'profile').sort((route1, route2) => route1.meta.order - route2.meta.order)
		}
	},

	components: {
		RouterLink,
		ProfileButton
	}
}

</script>




<template>

<nav class="navbar" role="navigation" aria-label="main navigation">
	<div id="navbarBasicExample" class="navbar-menu">
		<div class="navbar-start">
			<RouterLink
				v-for="route in routes()"
				:key="route.path"
				:to="{ name: route.name }"
			><a class="navbar-item" :class="{ 'is-active': route.name === $route.name }">
				{{ route.meta.text }}
			</a></RouterLink>
		</div>
    </div>

    <div class="navbar-end">
		<div class="navbar-item">
			<div class="buttons">
				<ProfileButton />
			</div>
		</div>
	</div>
</nav>

</template>




<style scoped>

</style>
