// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10;

contract PlayerContract
{
	struct Player {
		uint id;
        string name;
        uint winCount;
        uint lossCount;
    }

    Player[] public players;

    mapping (address => uint) public addressToPlayerId;




    event NewPlayerCreated(uint id, string name);




    function createPlayer (string memory _name) public
    {
    	require(addressToPlayerId[msg.sender] == 0, "Player: player already exists for address");

    	uint id = players.length + 1;

        players.push(Player(players.length + 1, _name, 0, 0));

        addressToPlayerId[msg.sender] = id;

        emit NewPlayerCreated(id, _name);
    }
}
