export default {

	networks: {
		develop: {
			provider: 'ws://localhost:9545'
		}
	},

	currentNetwork: import.meta.env.VITE_NETWORK,

	addresses: {
		playerContract: import.meta.env.VITE_PLAYER_CONTRACT_ADDRESS
	}

}
