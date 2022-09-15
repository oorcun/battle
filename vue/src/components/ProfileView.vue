<script>

import MetamaskNotification from './MetamaskNotification.vue'

export default {

	components: {
		MetamaskNotification
	}

	// const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
	// new web3.eth.Contract(jsonInterface[, address][, options])
	// myContract.methods.myMethod(123).call({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'})
	// .then(function(result){
	//     ...
	// });

	// fetch player
	// player form if player not exist
	// player store
	// show player stats
	// get past events registered and finished attacks
}

</script>




<template>

<MetamaskNotification />

<hr>

</template>




<style scoped>

	img {
		height: 1em;
		width: auto;
	}

</style>
