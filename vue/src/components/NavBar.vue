<script>

</script>




<template>

<nav class="navbar" role="navigation" aria-label="main navigation">
	<div id="navbarBasicExample" class="navbar-menu">
		<div class="navbar-start">
			<RouterLink to="/"><a class="navbar-item">
				Players
			</a></RouterLink>
			<RouterLink to="/about"><a class="navbar-item">
				About
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

<RouterView />

</template>




<style scoped>

</style>
