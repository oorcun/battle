export default {

	networks: {
		develop: {
			playerContract: import.meta.env.VITE_DEVELOP_PLAYER_CONTRACT_ADDRESS,
			oracleAddress: import.meta.env.VITE_DEVELOP_ORACLE_ADDRESS,
			oracleNetworkUrl: import.meta.env.VITE_DEVELOP_ORACLE_NETWORK_URL,
			errorReasonDetectionString: 'revert ' // Used for error reason detection.
		},
		goerli: {
			playerContract: '0x18A7F9109A906617A2DC7c904d5e218B28192F82',
			oracleAddress: '0xf2AF85AaA9B6217030029C8eC88a9A99fA243a42',
			oracleNetworkUrl: import.meta.env.VITE_ORACLE_NETWORK_URL,
			errorReasonDetectionString: '"message": "execution reverted: '
		}
	},

	currentNetwork: import.meta.env.VITE_NETWORK

}
