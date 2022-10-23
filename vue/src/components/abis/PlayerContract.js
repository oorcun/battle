export default [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "attacker",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "defender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "startingMinute",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "side",
				"type": "bool"
			}
		],
		"name": "AttackRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "attacker",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "defender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "startingMinute",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "won",
				"type": "bool"
			}
		],
		"name": "AttackResulted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "NewPlayerCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "startingMinute",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "PriceRequestSet",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "startingMinute",
				"type": "uint256"
			}
		],
		"name": "PriceRequested",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "addressToMinuteTimestampToAttack",
		"outputs": [
			{
				"internalType": "address",
				"name": "defender",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "side",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "finished",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "won",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "addressToPlayer",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "attackWinCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "attackLossCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "defendWinCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "defendLossCount",
				"type": "uint256"
			},
			{
				"internalType": "int256",
				"name": "points",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPendingRequests",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "minuteTimestamp",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"internalType": "int256",
						"name": "increasePercent",
						"type": "int256"
					}
				],
				"internalType": "struct PriceRequestContract.PriceRequest[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_minuteTimestamp",
				"type": "uint256"
			}
		],
		"name": "getPrice",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "minuteTimestampToPriceRequest",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "minuteTimestamp",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "int256",
				"name": "increasePercent",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "oracle",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "pendingRequests",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "minuteTimestamp",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "int256",
				"name": "increasePercent",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "players",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "attackWinCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "attackLossCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "defendWinCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "defendLossCount",
				"type": "uint256"
			},
			{
				"internalType": "int256",
				"name": "points",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_oracle",
				"type": "address"
			}
		],
		"name": "setOracle",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_minuteTimestamp",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "setPriceRequest",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"name": "createPlayer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPlayer",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "attackWinCount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "attackLossCount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "defendWinCount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "defendLossCount",
						"type": "uint256"
					},
					{
						"internalType": "int256",
						"name": "points",
						"type": "int256"
					}
				],
				"internalType": "struct PlayerContract.Player",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "getAnyPlayer",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "attackWinCount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "attackLossCount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "defendWinCount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "defendLossCount",
						"type": "uint256"
					},
					{
						"internalType": "int256",
						"name": "points",
						"type": "int256"
					}
				],
				"internalType": "struct PlayerContract.Player",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_startId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_endId",
				"type": "uint256"
			}
		],
		"name": "getPlayers",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "attackWinCount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "attackLossCount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "defendWinCount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "defendLossCount",
						"type": "uint256"
					},
					{
						"internalType": "int256",
						"name": "points",
						"type": "int256"
					}
				],
				"internalType": "struct PlayerContract.Player[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_defender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_startingMinute",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_side",
				"type": "bool"
			}
		],
		"name": "registerAttack",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_attacker",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_startingMinute",
				"type": "uint256"
			}
		],
		"name": "finishAttack",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_attacker",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_startingMinute",
				"type": "uint256"
			}
		],
		"name": "hasRegisteredAttack",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]