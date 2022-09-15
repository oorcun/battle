<script>

import { RouterLink } from 'vue-router'
import ProfileButton from './ProfileButton.vue'


export default {

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
				v-for="route in $router.getRoutes().filter(route => route.path !== '/profile')"
				:key="route.path"
				:to="route.path"
			><a class="navbar-item" :class="{ 'is-active': route.path === $route.path }">
				{{ route.name }}
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
