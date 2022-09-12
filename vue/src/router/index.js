import { createRouter, createWebHistory } from 'vue-router'

import PlayerList from '../components/PlayerList.vue'
import AboutText from '../components/AboutText.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'players',
			component: PlayerList
		},
		{
			path: '/about',
			name: 'about',
			component: AboutText
		}
	]
})

export default router
