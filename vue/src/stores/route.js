import { defineStore } from 'pinia'

export const useRouteStore = defineStore('route', {
	state: () => ({
		redirectParams: []
	})
})
