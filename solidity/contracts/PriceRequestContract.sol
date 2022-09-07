// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10;

contract PriceRequestContract
{
	struct PriceRequest {
        uint minuteTimestamp;
        uint price;
        int increasePercent;
    }




    PriceRequest[] public priceRequests;
    PriceRequest[] public pendingRequests;




    event PriceRequested(uint startingMinute);




	function getPendingRequests () public view returns (PriceRequest[] memory)
    {
        return pendingRequests;
    }

    function setPriceRequest (uint minuteTimestamp, uint price) public
    {
        // add only oracle check
        // check minute percent
        // set price
        // get previous price
        // if exists
            // calculate increase percent
    }




    function _addPriceRequest (PriceRequest memory priceRequest) internal
    {
        uint length = pendingRequests.length;

        for (uint i = 0; i < length; i++) {
            if (pendingRequests[i].minuteTimestamp == priceRequest.minuteTimestamp) {
                return;
            }
        }

        pendingRequests.push(priceRequest);

        emit PriceRequested(priceRequest.minuteTimestamp);
    }
}
