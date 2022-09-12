import { createRouter, createWebHistory } from 'vue-router'

import PlayerList from '../components/PlayerList.vue'
import AboutText from '../components/AboutText.vue'
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
			path: '/about',
			name: 'About',
			component: AboutText
		},
		{
			path: '/profile',
			name: 'Profile',
			component: ProfileView
		}
	]
})

export default router
