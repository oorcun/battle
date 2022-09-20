import { createRouter, createWebHistory } from 'vue-router'

import PlayerList from '../components/PlayerList.vue'
import InstructionsView from '../components/InstructionsView.vue'
import ProfileView from '../components/ProfileView.vue'
import RegisteredAttacks from '../components/RegisteredAttacks.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'players',
			meta: { text: 'Players', order: 1 },
			component: PlayerList
		},
		{
			path: '/attacks',
			name: 'registeredAttacks',
			meta: { text: 'Registered Attacks', order: 2 },
			component: RegisteredAttacks
		},
		{
			path: '/instructions',
			name: 'instructions',
			meta: { text: 'Instructions', order: 3 },
			component: InstructionsView
		},
		{
			path: '/profile',
			name: 'profile',
			component: ProfileView
		}
	]
})

export default router
