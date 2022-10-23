// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10;

import "./Oracle.sol";

/**
 * @title      Contract for price request operations
 * @author     Orçun Altınsoy
 * @notice     This contract deals with operations for Bitcoin prices at requested minutes
 * @dev        This contract can also deal with calculations of prices if necessary.
 */
contract PriceRequestContract is Oracle
{
    /**
     * @dev        minuteTimestamp: Timestamp of minute of the corresponding request.
     *                              This value is unique for every price request.
     *             price:           Bitcoin price of corresponding minute multiplied by 100.
     *                              0 price means the request is pending.
     *             increasePercent: Percent of price increase compared to previous minute multiplied by 100.
     *                              e.g. 1234 means increase by 12.34%, while -123 means decrease by -1.23%.
     */
	struct PriceRequest {
        uint minuteTimestamp;
        uint price;
        int increasePercent;
    }




    /**
     * @notice     Stores pending requests
     * @dev        This array should never become too big.
     *             This array holds only requests that has a price of 0.
     */
    PriceRequest[] public pendingRequests;

    /**
     * @notice     Mapping of minute timestamps to finished price requests
     * @dev        Prices are set for these price requests.
     */
    mapping (uint => PriceRequest) public minuteTimestampToPriceRequest;




    /**
     * @notice     Emitted when price is requested
     * @param      startingMinute    Minute timestamp of the price request
     */
    event PriceRequested(uint startingMinute);

    /**
     * @notice     Emitted when price request is set
     * @param      startingMinute    Minute timestamp of the price request
     * @param      price             Bitcoin price at a given minute
     */
    event PriceRequestSet(uint startingMinute, uint price);




    /**
     * @notice     Returns pending requests
     * @dev        Since returned array would never became too big, returning all of it are safe.
     * @return     All pending requests
     */
	function getPendingRequests () public view returns (PriceRequest[] memory)
    {
        return pendingRequests;
    }


    /**
     * @notice     Sets the parameters of pending price request
     * @dev        Only oracle can set the price request.
     *             Removes the corresponding request from pending requests.
     *             If price request of previous minute timestamp exists, then calculates the increase percent.
     * @param      _minuteTimestamp  Minute timestamp of the price request
     * @param      _price            Bitcoin price multiplied by 100
     */
    function setPriceRequest (uint _minuteTimestamp, uint _price) public onlyOracle
    {
        bool removed = _removePendingRequest(_minuteTimestamp);
        require(removed, "PriceRequestContract: price request not exists");

        int increasePercent = 0;

        PriceRequest memory previousPriceRequest = minuteTimestampToPriceRequest[_minuteTimestamp - 60];
        if (previousPriceRequest.minuteTimestamp != 0) {
            increasePercent = 10000 * int(_price) / int(previousPriceRequest.price) - 10000;
        }

        minuteTimestampToPriceRequest[_minuteTimestamp] = PriceRequest(_minuteTimestamp, _price, increasePercent);

        emit PriceRequestSet(_minuteTimestamp, _price);
    }

    /**
     * @notice     Gets the Bitcoin price of a given minute
     * @dev        Returns only if the price is set.
     * @param      _minuteTimestamp  Minute timestamp of the requested price
     * @return     Bitcoin price multiplied by 100
     */
    function getPrice (uint _minuteTimestamp) public view returns (uint)
    {
        require(minuteTimestampToPriceRequest[_minuteTimestamp].price != 0, "PriceRequestContract: price not set");

        return minuteTimestampToPriceRequest[_minuteTimestamp].price;
    }




    /**
     * @notice     Adds given request to pending request array
     * @dev        Adds only if the price request not exists in the array.
     * @param      _priceRequest  Price request to add
     */
    function _addPendingRequest (PriceRequest memory _priceRequest) internal
    {
        if (_hasPendingRequest(_priceRequest.minuteTimestamp)) {
            return;
        }

        pendingRequests.push(_priceRequest);

        emit PriceRequested(_priceRequest.minuteTimestamp);
    }

    /**
     * @notice     Checks if there is a pending request for a given minute
     * @dev        It is okay to loop over all pending requests because the array will never became too big.
     * @param      _minuteTimestamp  Minute timestamp to check
     * @return     Returns true if only if there is a pending request
     */
    function _hasPendingRequest (uint _minuteTimestamp) internal view returns (bool)
    {
        uint length = pendingRequests.length;

        for (uint i = 0; i < length; i++) {
            if (pendingRequests[i].minuteTimestamp == _minuteTimestamp) {
                return true;
            }
        }

        return false;
    }

    /**
     * @notice     Removes a request for a given minute from the pending requests
     * @dev        It is okay to loop over all pending requests because the array will never became too big.
     * @param      _minuteTimestamp  Minute timestamp to remove
     * @return     Returns true if only if request corresponding with the given minute is removed
     */
    function _removePendingRequest (uint _minuteTimestamp) internal returns (bool)
    {
        uint length = pendingRequests.length;

        for (uint i = 0; i < length; i++) {
            if (pendingRequests[i].minuteTimestamp == _minuteTimestamp) {
                pendingRequests[i] = pendingRequests[length - 1];
                pendingRequests.pop();
                return true;
            }
        }

        return false;
    }
}
