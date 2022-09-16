import { createRouter, createWebHistory } from 'vue-router'

import PlayerList from '../components/PlayerList.vue'
import InstructionsView from '../components/InstructionsView.vue'
import ProfileView from '../components/ProfileView.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'Players',
			component: PlayerList
		},
		{
			path: '/instructions',
			name: 'Instructions',
			component: InstructionsView
		},
		{
			path: '/profile',
			name: 'Profile',
			component: ProfileView
		}
	]
})

export default router
