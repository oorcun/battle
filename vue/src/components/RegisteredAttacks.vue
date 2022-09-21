<script>

import { mapState } from 'pinia'
import { useMetamaskStore } from '../stores/metamask.js'
import { usePlayerStore } from '../stores/player.js'
import RegisterAttackForm from './RegisterAttackForm.vue'
import MetamaskNotification from './MetamaskNotification.vue'

export default {

	computed: {
		...mapState(useMetamaskStore, ['metamaskState']),
		...mapState(usePlayerStore, ['playerState']),
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

<template v-if="metamaskState === 'connected' && playerState === 'exist'">

	<!-- <RegisterAttackForm /> -->

	<hr>

	<div class="box">
		<div class="tile is-ancestor">
			<div class="tile is-parent notification is-info is-light is-5 custom-left-tile has-text-right">
				<div class="tile is-child">
					<p class="title">orcun</p>
					<p>0x6f9eB65FC703dd3D9e5251ae581f3612f9289A7a</p>
				</div>
				<div class="tile is-child">
					<p class="title"><ion-icon name="person"></ion-icon></p>
				</div>
			</div>
			<div class="tile is-2 is-parent">
				<div class="tile is-child">
					<p class="title"><ion-icon name="arrow-up-circle"></ion-icon></p>
				</div>
				<div class="tile is-child has-text-right">
					<p class="title"><ion-icon name="arrow-down-circle"></ion-icon></p>
				</div>
			</div>
			<div class="tile is-parent notification is-info is-light is-5">
				<div class="tile is-child">
					<p class="title"><ion-icon name="person"></ion-icon></p>
				</div>
				<div class="tile is-child">
					<p class="title">orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2orcun2</p>
					<p>0x2769144e0d5A297090e401B8f00C286a7540E989</p>
				</div>
			</div>
		</div>
	</div>

</template>

</template>




<style scoped>

ion-icon[name="person"] {
	font-size: 128px;
}

ion-icon[name="arrow-up-circle"] {
	color: rgb(0, 192, 164);
	font-size: 64px;
}

ion-icon[name="arrow-down-circle"] {
	color: rgb(150, 11, 39);
	font-size: 64px;
}

.custom-left-tile {
	margin-bottom: 0;
}

.is-ancestor {
	overflow: hidden;
	white-space: nowrap;
}

</style>
