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
    mapping (address => Player) public addressToPlayer;




    event NewPlayerCreated(uint id, string name);




    function createPlayer (string calldata _name) public
    {
    	require(addressToPlayer[msg.sender].id == 0, "Player: player already exists for address");

        uint id = players.length + 1;
    	Player memory player = Player(players.length + 1, _name, 0, 0);

        players.push(player);
        addressToPlayer[msg.sender] = player;

        emit NewPlayerCreated(id, _name);
    }

    function getPlayer () public view returns (Player memory)
    {
        require(addressToPlayer[msg.sender].id > 0, "Player: player not exist for address");

        return addressToPlayer[msg.sender];
    }
}
