import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
	state: () => ({
		player: []
	}),
	actions: {
		isPlayerExists () {
			return this.player.length > 0
		}
	}
})
