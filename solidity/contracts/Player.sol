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
        address defender;
        bool side;
        bool finished;
        bool won;
    }




    Player[] public players;
    mapping (address => Player) public addressToPlayer;
    mapping (address => mapping (uint => Attack)) public addressToMinuteTimestampToAttack;




    event NewPlayerCreated(uint id, string name);
    event AttackRegistered(address indexed attacker, uint indexed startingMinute, address defender, bool side);
    event AttackResulted(address indexed attacker, uint indexed startingMinute, address defender, bool won);




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

        require(!_hasRegisteredAttack(msg.sender, startingMinute), "Player: already registered for an attack");

        _registerAttack(startingMinute, Attack(_defender, _side, false, false));

        _addPendingRequest(PriceRequest(startingMinute, 0, 0));
        _addPendingRequest(PriceRequest(startingMinute + 60, 0, 0));

        emit AttackRegistered(msg.sender, startingMinute, _defender, _side);
    }

    function finishAttack (address _attacker, uint _startingMinute) public
    {
        require(_hasRegisteredAttack(_attacker, _startingMinute), "Player: attack not exists");

        require(minuteTimestampToPriceRequest[_startingMinute].minuteTimestamp != 0, "Player: price request for battle starting time not exists");

        PriceRequest memory finishTimePriceRequest = minuteTimestampToPriceRequest[_startingMinute + 60];

        require(finishTimePriceRequest.minuteTimestamp != 0, "Player: price request for battle finish time not exists");

        Attack memory attack = addressToMinuteTimestampToAttack[_attacker][_startingMinute];

        attack.finished = true;

        if (finishTimePriceRequest.increasePercent > 0) {
            attack.won = attack.side ? true : false;
        } else if (finishTimePriceRequest.increasePercent < 0) {
            attack.won = attack.side ? false : true;
        } else {
            attack.won = true;
        }

        addressToMinuteTimestampToAttack[_attacker][_startingMinute] = attack;

        Player memory attacker = addressToPlayer[_attacker];
        Player memory defender = addressToPlayer[attack.defender];

        if (attack.won) {
            attacker.attackWinCount++;
            defender.defendLossCount++;
            attacker.points += 2;
            defender.points -= 2;
        } else {
            attacker.attackLossCount++;
            defender.defendWinCount++;
            attacker.points--;
            defender.points++;
        }

        addressToPlayer[_attacker] = attacker;
        addressToPlayer[attack.defender] = defender;

        emit AttackResulted(_attacker, _startingMinute, attack.defender, attack.won);
    }




    function _getMinute (uint _datetime) internal pure returns (uint)
    {
        return (_datetime / 60) * 60;
    }

    function _hasRegisteredAttack (address _attacker, uint _startingMinute) internal view returns (bool)
    {
        return addressToMinuteTimestampToAttack[_attacker][_startingMinute].defender != address(0);
    }

    function _registerAttack (uint _startingMinute, Attack memory _attack) internal
    {
        addressToMinuteTimestampToAttack[msg.sender][_startingMinute] = _attack;
    }
}
