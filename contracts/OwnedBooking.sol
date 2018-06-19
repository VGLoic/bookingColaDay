pragma solidity ^0.4.21;

import "zos-lib/contracts/migrations/Migratable.sol";
import './OwnableWithGuest.sol';
import './PartnersList.sol';

/**
* @title OwnedBooking
*/
contract OwnedBooking is OwnableWithGuest, Migratable {

  /**
  * Structure for each partner
  */
  struct PartnerInfo {
    bool hasBooked;
    uint8 bookingIndex;
  }

  /**
  * Address of the PartnersList proxy contract
  */
  address partnersProxy;

  /**
  * Mapping over the address which handles the partners
  */
  mapping(bytes32 => PartnerInfo) internal partnerInfos;

  /**
  * Mapping over the reservations
  */
  mapping(uint8 => bytes32) internal reservations;


  /**
  * @dev Initializes the contract by registering the owner, the guest and the
  * addres of the PartnersList proxy
  * @param _owner The address of the owner
  * @param _guest The address of guest
  * @param _partnersProxy The address of the PartnersList proxy
  */
  function initialize(
    address _owner,
    address _guest,
    address _partnersProxy
  ) isInitializer("OwnedBooking", "0") public {
    require(_partnersProxy != address(0));
    require(partnersProxy == address(0));
    initializeOwnerAndGuest(_owner, _guest);
    partnersProxy = _partnersProxy;
  }

  /**
  * @dev Tells the name of the partner who booked a particular slot
  * @param bookingIndex the index of the slot
  * @return The name of the corresponding partner if there is any
  */
  function getSlot(uint8 bookingIndex) onlyOwnerOrGuest public view returns (bytes32) {
    return reservations[bookingIndex];
  }

  /**
  * @dev Tells the informations about a particular partner
  * @dev partnerName The name of the partner
  * @return The bool hasBooked and the bookingIndex
  */
  function getPartnerInfo(bytes32 partnerName) onlyOwnerOrGuest public view returns(bool, uint8) {
    return (
      partnerInfos[partnerName].hasBooked,
      partnerInfos[partnerName].bookingIndex
    );
  }

  /**
  * @dev Books a room
  * @param bookingIndex the index of the room and time slot
  * @param partnerAddress the address of the partner
  */
  function bookRoom(
    uint8 bookingIndex,
    address partnerAddress
  ) public onlyOwner {
    require(bookingIndex < 120, 'Incorrect index.');
    bytes32 emptyBytes;
    // The partnerAddress should correspond to a partner
    PartnersList partnersList = PartnersList(partnersProxy);
    require(owner != partnerAddress);
    require(guest != partnerAddress);
    bytes32 partnerName = partnersList.getPartnerName(partnerAddress);
    delete partnersList;
    require(partnerName != emptyBytes, 'Non valid name');
    // The slot must be empty
    require(reservations[bookingIndex] == emptyBytes, 'Already booked.');
    // Load the PartnerInfo
    PartnerInfo storage partnerInfo = partnerInfos[partnerName];
    // The partner must not have already book a room
    require(!partnerInfo.hasBooked, 'Already have a booking.');
    // Register the change for the partner
    partnerInfo.hasBooked = true;
    partnerInfo.bookingIndex = bookingIndex;
    // Register the change for the reservations
    reservations[bookingIndex] = partnerName;
  }

  /**
  * @dev Cancels a reservation
  * @param bookingIndex the index of the slot
  * @param partnerAddress the address of the partner
  */
  function cancelRoom(
    uint8 bookingIndex,
    address partnerAddress
  ) public onlyOwner {
    require(bookingIndex < 120, 'Incorrect index.');
    // Load the name of the partner, if this is not a partner, the condition on
    // the partnerInfo will throw
    PartnersList partnersList = PartnersList(partnersProxy);
    bytes32 partnerName = partnersList.getPartnerName(partnerAddress);
    delete partnersList;
    // Load the PartnerInfo
    PartnerInfo storage partnerInfo = partnerInfos[partnerName];
    // The partner's information must be correct
    require(partnerInfo.hasBooked, 'Not booked.');
    require(partnerInfo.bookingIndex == bookingIndex);
    // The slot must correspond to the partner's name
    require(reservations[bookingIndex] == partnerName, 'Access denied.');
    // Register the change for the partner
    partnerInfo.hasBooked = false;
    partnerInfo.bookingIndex = 0;
    // Register the change for the reservations
    reservations[bookingIndex] = '';
  }
}
