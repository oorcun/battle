// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10;

import "./PriceRequestContract.sol";

/**
 * @title      Contract for player operations
 * @author     Orçun Altınsoy
 * @notice     This contract deals with operations for players and interactions between them
 * @dev        Currently, players can only attack each others.
 */
contract PlayerContract is PriceRequestContract
{
    /**
     * @dev        id:              Unique ID of player. Starting from 1 and incremented by 1 for every player
     *             name:            Name of player.
     *             owner:           Owner address of player.
     *             attackWinCount:  Number of times player attacks and wins. Gives 2 points.
     *             attackLossCount: Number of times player attacks and loses. Takes 1 point.
     *             defendWinCount:  Number of times player is attacked and wins. Gives 1 point.
     *             defendLossCount: Number of times player is attacked and loses. Takes 2 points.
     *             points:          Points of player calculated from winnings and losses.
     */
	struct Player {
		uint id;
        string name;
        address owner;
        uint attackWinCount;
        uint attackLossCount;
        uint defendWinCount;
        uint defendLossCount;
        int points;
    }

    /**
     * @dev        defender: Address of attacked player.
     *             side:     Attacker price prediction. This is true if and only if attacker predicted an increase.
     *             finished: This value is true if and only if the battle is finished.
     *             won:      This value is true if and only if the attacker is won.
     *                       This value is meaningless if the battle is not finished.
     */
    struct Attack {
        address defender;
        bool side;
        bool finished;
        bool won;
    }




    /**
     * @notice     List of all players
     * @dev        Warning! Can become very big.
     */
    Player[] public players;

    /**
     * @notice     Mapping of addresses to players.
     * @dev        Every address can only have one player.
     */
    mapping (address => Player) public addressToPlayer;

    /**
     * @notice     Mapping of addresses and minute timestamps to attacks.
     * @dev        Every player can only attack one player for each minute.
     */
    mapping (address => mapping (uint => Attack)) public addressToMinuteTimestampToAttack;




    /**
     * @notice     Emitted when a player is created
     * @param      id    ID of the created player
     * @param      name  Name of the created player
     */
    event NewPlayerCreated(uint id, string name);

    /**
     * @notice     Emitted when a player registered a battle
     * @param      attacker        Address of the registrerer
     * @param      defender        Address of the registrant
     * @param      startingMinute  Starting minute timestamp of the battle
     * @param      side            Attacker price prediction which is true if and only if attacker predicted an increase.
     */
    event AttackRegistered(address indexed attacker, address indexed defender, uint startingMinute, bool side);

    /**
     * @notice     Emitted when a battle is concluded
     * @param      attacker        Address of the attacker
     * @param      defender        Address of the defender
     * @param      startingMinute  Starting minute timestamp of the battle
     * @param      won             True if and only if attacker has won the battle
     */
    event AttackResulted(address indexed attacker, address indexed defender, uint startingMinute, bool won);




    modifier senderMustExists ()
    {
        require(addressToPlayer[msg.sender].id > 0, "PlayerContract: player not exist for address");

        _;
    }




    /**
     * @notice     Creates a new player
     * @dev        One address can only create one player.
     *             Name cannot be empty string.
     * @param      _name  Name of player
     */
    function createPlayer (string memory _name) public
    {
    	require(addressToPlayer[msg.sender].id == 0, "PlayerContract: player already exists for address");
        require(keccak256(abi.encode(_name)) != keccak256(abi.encode("")), "PlayerContract: name is empty");

        uint id = players.length + 1;
    	Player memory player = Player(players.length + 1, _name, msg.sender, 0, 0, 0, 0, 0);

        players.push(player);
        addressToPlayer[msg.sender] = player;

        emit NewPlayerCreated(id, _name);
    }

    /**
     * @notice     Returns the player struct of the sender address
     * @dev        Sender must have a player.
     * @return     Player belongs to the sender address
     */
    function getPlayer () public view senderMustExists returns (Player memory)
    {
        return addressToPlayer[msg.sender];
    }

    /**
     * @notice     Returns the player struct of the given address
     * @dev        Given address must have a player.
     * @param      _owner  Address of the owner
     * @return     Player belongs to the given address
     */
    function getAnyPlayer (address _owner) public view returns (Player memory)
    {
        require(addressToPlayer[_owner].id > 0, "PlayerContract: player not exist");

        return addressToPlayer[_owner];
    }

    /**
     * @notice     Returns the players optionally given closed interval of IDs
     * @dev        Start ID of 0 means there is no lower limit while end ID of 0 means there is no upper limit.
     *             This is sort of like a pagination since the players array can become quite big.
     *             Start ID cannot be greater than the end ID.
     * @param      _startId  ID of lower limit
     * @param      _endId    ID of upper limit
     * @return     Players belongs to the given ID interval
     */
    function getPlayers (uint _startId, uint _endId) public view returns (Player[] memory)
    {
        if (_startId == 0) _startId = 1;
        if (_endId == 0) _endId = players.length;
        require(_startId <= _endId, "PlayerContract: start id must be less than end id");

        Player[] memory returnData = new Player[](_endId - _startId + 1);
        uint index = 0;
        for (uint i = _startId - 1; i < _endId; i++) {
            returnData[index++] = players[i];
        }

        return returnData;
    }

    /**
     * @notice     Registers a battle.
     * @dev        Sender address is an attacker of battle and it must have a player.
     *             Defender must have a player.
     *             Player cannot attack itself.
     *             Player can only register one attack for a given starting minute.
     *             Starting minute of battle must be greater than current minute.
     *             Starting minute of battle must not be too much greater than current minute (currently 1 hour).
     *             This function adds a pending price request for a starting minute and the next (ending) minute.
     * @param      _defender        Address of the attacked player
     * @param      _startingMinute  Starting minute timestamp of the battle
     * @param      _side            Attacker price prediction which is true if and only if attacker predicted an increase
     */
    function registerAttack (address _defender, uint _startingMinute, bool _side) public senderMustExists
    {
        require(addressToPlayer[_defender].id > 0, "PlayerContract: defender not exist");

        require(_defender != msg.sender, "PlayerContract: defender and attacker are same");

        uint startingMinute = _getMinute(_startingMinute);
        uint currentMinute = _getMinute(block.timestamp);

        require(startingMinute > currentMinute, "PlayerContract: starting minute must be a future time");
        require(startingMinute < currentMinute + 1 hours, "PlayerContract: starting minute must not be far away");

        require(!hasRegisteredAttack(msg.sender, startingMinute), "PlayerContract: already registered for an attack");

        addressToMinuteTimestampToAttack[msg.sender][startingMinute] = Attack(_defender, _side, false, false);

        _addPendingRequest(PriceRequest(startingMinute, 0, 0));
        _addPendingRequest(PriceRequest(startingMinute + 60, 0, 0));

        emit AttackRegistered(msg.sender, _defender, startingMinute, _side);
    }

    /**
     * @notice     Finishes a battle.
     * @dev        Player should finish their won battles to increase its points.
     *             Attack must exists for a given attacker and starting minute.
     *             Bitcoin prices for both the starting and ending minutes must be set.
     *             Updates the corresponding attack and player structs.
     * @param      _attacker        Address of the attacked player
     * @param      _startingMinute  Starting minute timestamp of the battle
     */
    function finishAttack (address _attacker, uint _startingMinute) public
    {
        require(hasRegisteredAttack(_attacker, _startingMinute), "PlayerContract: attack not exists");

        require(minuteTimestampToPriceRequest[_startingMinute].minuteTimestamp != 0, "PlayerContract: price request for battle starting time not exists");

        PriceRequest memory finishTimePriceRequest = minuteTimestampToPriceRequest[_startingMinute + 60];

        require(finishTimePriceRequest.minuteTimestamp != 0, "PlayerContract: price request for battle finish time not exists");

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

        emit AttackResulted(_attacker, attack.defender, _startingMinute, attack.won);
    }

    /**
     * @notice     Checks if the given address has registered attack for a given minute
     * @param      _attacker        Address of the attacking player
     * @param      _startingMinute  Starting minute timestamp of the battle
     * @return     True if and only if attack has been registered
     */
    function hasRegisteredAttack (address _attacker, uint _startingMinute) public view returns (bool)
    {
        return addressToMinuteTimestampToAttack[_attacker][_startingMinute].defender != address(0);
    }




    /**
     * @notice     Get given timestamp's minute timestamp
     * @dev        This function effectively zeroes the seconds in a datetime (e.g. 23:59:59 become 23:59:00.).
     * @param      _datetime        Timestamp value
     * @return     Given timestamp's minute timestamp
     */
    function _getMinute (uint _datetime) internal pure returns (uint)
    {
        return (_datetime / 60) * 60;
    }
}
