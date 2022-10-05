// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10;

import "./Oracle.sol";

contract PriceRequestContract is Oracle
{
	struct PriceRequest {
        uint minuteTimestamp;
        uint price;
        int increasePercent;
    }




    PriceRequest[] public pendingRequests;
    mapping (uint => PriceRequest) public minuteTimestampToPriceRequest;




    event PriceRequested(uint startingMinute);
    event PriceRequestSet(uint startingMinute, uint price);




	function getPendingRequests () public view returns (PriceRequest[] memory)
    {
        return pendingRequests;
    }

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

    function getPrice (uint _minuteTimestamp) public view returns (uint)
    {
        require(minuteTimestampToPriceRequest[_minuteTimestamp].price != 0, "PriceRequestContract: price not set");

        return minuteTimestampToPriceRequest[_minuteTimestamp].price;
    }




    function _addPendingRequest (PriceRequest memory _priceRequest) internal
    {
        if (_hasPendingRequest(_priceRequest.minuteTimestamp)) {
            return;
        }

        pendingRequests.push(_priceRequest);

        emit PriceRequested(_priceRequest.minuteTimestamp);
    }

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
