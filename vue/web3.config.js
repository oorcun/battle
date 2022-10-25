export default {

	networks: {
		develop: {
			playerContract: import.meta.env.VITE_DEVELOP_PLAYER_CONTRACT_ADDRESS,
			errorReasonDetectionString: '"reason": "' // Used for error reason detection.
		},
		goerli: {
			playerContract: import.meta.env.VITE_GOERLI_PLAYER_CONTRACT_ADDRESS,
			errorReasonDetectionString: '"message": "execution reverted: '
		}
	},

	currentNetwork: import.meta.env.VITE_NETWORK

}
