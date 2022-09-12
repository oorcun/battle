<script>

import { RouterLink } from 'vue-router'

export default {

	components: {
		RouterLink
	}
}

</script>




<template>

<nav class="navbar" role="navigation" aria-label="main navigation">
	<div id="navbarBasicExample" class="navbar-menu">
		<div class="navbar-start">
			<RouterLink
				v-for="route in $router.getRoutes()"
				:key="route.path"
				:to="route.path"
			><a class="navbar-item">
				{{ route.name }}
			</a></RouterLink>
		</div>
    </div>

    <div class="navbar-end">
		<div class="navbar-item">
			<div class="buttons">
				<a class="button is-primary">
					<strong>Connect MetaMask</strong>
				</a>
			</div>
		</div>
	</div>
</nav>

</template>




<style scoped>

</style>
