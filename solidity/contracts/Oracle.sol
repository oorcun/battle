// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Oracle is Ownable
{
	address public oracle;




    constructor ()
    {
        oracle = msg.sender;
    }




    modifier onlyOracle ()
    {
        require(oracle == msg.sender, "Oracle: caller is not the oracle");

        _;
    }




    function setOracle (address _oracle) public onlyOwner
    {
        oracle = _oracle;
    }
}
