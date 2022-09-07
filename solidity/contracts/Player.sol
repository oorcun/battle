// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10;

import "./PriceRequestContract.sol";

contract PlayerContract is PriceRequestContract
{
	struct Player {
		uint id;
        string name;
        uint attackWinCount;
        uint attackLossCount;
        uint defendWinCount;
        uint defendLossCount;
        int points;
    }

    struct Attack {
        uint startingMinute;
        address defender;
        bool side;
        bool finished;
        bool won;
    }




    Player[] public players;
    mapping (address => Player) public addressToPlayer;
    mapping (address => bool) public addressToHasRegisteredAttack;
    mapping (address => Attack[]) public addressToAttacks;




    event NewPlayerCreated(uint id, string name);
    event AttackRegistered(address indexed attacker, address indexed defender, uint startingMinute, bool side);




    modifier senderMustExists ()
    {
        require(addressToPlayer[msg.sender].id > 0, "Player: player not exist for address");

        _;
    }




    function createPlayer (string memory _name) public
    {
    	require(addressToPlayer[msg.sender].id == 0, "Player: player already exists for address");

        uint id = players.length + 1;
    	Player memory player = Player(players.length + 1, _name, 0, 0, 0, 0, 0);

        players.push(player);
        addressToPlayer[msg.sender] = player;

        emit NewPlayerCreated(id, _name);
    }

    function getPlayer () public view senderMustExists returns (Player memory)
    {
        return addressToPlayer[msg.sender];
    }

    function registerAttack (address _defender, uint _startingMinute, bool _side) public senderMustExists
    {
        require(addressToPlayer[_defender].id > 0, "Player: defender not exist");

        uint startingMinute = _getMinute(_startingMinute);
        uint currentMinute = _getMinute(block.timestamp);

        require(startingMinute > currentMinute, "Player: starting minute must be a future time");
        require(startingMinute < currentMinute + 1 hours, "Player: starting minute must not be far away");

        require(!_hasRegisteredAttack(), "Player: already registered for an attack");

        _registerAttack();

        addressToAttacks[msg.sender].push(Attack(startingMinute, _defender, _side, false, false));

        _addPriceRequest(PriceRequest(startingMinute, 0, 0));
        _addPriceRequest(PriceRequest(startingMinute + 60, 0, 0));

        emit AttackRegistered(msg.sender, _defender, startingMinute, _side);
    }




    function _getMinute (uint _datetime) internal pure returns (uint)
    {
        return (_datetime / 60) * 60;
    }

    function _hasRegisteredAttack () internal view returns (bool)
    {
        return addressToHasRegisteredAttack[msg.sender];
    }

    function _registerAttack () internal
    {
        addressToHasRegisteredAttack[msg.sender] = true;
    }
}
