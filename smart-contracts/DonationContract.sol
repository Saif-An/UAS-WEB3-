// DonationContract.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DonationContract {
    struct Donor {
        address addr;
        uint256 amount;
    }

    Donor[] public donors;
    uint256 public totalDonations;

    event DonationReceived(address indexed donor, uint256 amount);

    function donate() public payable {
        require(msg.value > 0, "Donation must be greater than 0");

        donors.push(Donor(msg.sender, msg.value));
        totalDonations += msg.value;

        emit DonationReceived(msg.sender, msg.value);
    }

    function getDonorCount() public view returns (uint256) {
        return donors.length;
    }
}