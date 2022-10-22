// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title      Contract for oracle operations
 * @author     Orçun Altınsoy
 * @notice     This is a very basic contract for oracle role
 * @dev        If oracle is not set it is defaulted to contract owner.
 */
contract Oracle is Ownable
{
    /**
     * @notice     Stores the address of oracle
     */
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




    /**
     * @notice     Sets the address of oracle
     * @dev        Only contract owner can set the address.
     * @param      _oracle  New oracle address
     */
    function setOracle (address _oracle) public onlyOwner
    {
        oracle = _oracle;
    }
}
