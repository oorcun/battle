export default {

	networks: {
		develop: {
			playerContract: import.meta.env.VITE_DEVELOP_PLAYER_CONTRACT_ADDRESS,
			errorDetectionString: '"reason": "' // Used for error message detection.
		},
		goerli: {
			playerContract: import.meta.env.VITE_GOERLI_PLAYER_CONTRACT_ADDRESS,
			errorDetectionString: '"message": "execution reverted: '
		}
	},

	currentNetwork: import.meta.env.VITE_NETWORK

}
