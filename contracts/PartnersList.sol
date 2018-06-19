pragma solidity ^0.4.21;

import "zos-lib/contracts/migrations/Migratable.sol";
import './WhiteList.sol';

/**
* @title PartnersList
*/
contract PartnersList is WhiteList, Migratable {

  /**
  * Mapping over the address which handles the partners
  */
  mapping(address => bytes32) internal partners;

  /**
  * @dev Initializes the contract by registering the partners and setting the
  * address of Coke and Pepsi
  * @param _coke The address of Coke Booking proxy
  * @param _pepsi The address of Pepsi Booking proxy
  * @param _cokeProxy The address of the proxy of the contract of Coke's booking
  * @param _pepsiProxy The address of the proxy of the contract of Pepsi's booking
  * @param _partnersAddress The array of address of the partners
  * @param _partnersName The array of name of the partners
  */
  function initialize(
    address _coke,
    address _pepsi,
    address _cokeProxy,
    address _pepsiProxy,
    address[] _partnersAddress,
    bytes32[] _partnersName
  ) isInitializer("PartnersList", "0") public {
    require(_partnersName.length == _partnersAddress.length);
    initializeWhiteList(_coke, _pepsi, _cokeProxy, _pepsiProxy);
    partners[_coke] = 'Coke';
    partners[_pepsi] = 'Pepsi';
    bytes32 emptyBytes;
    for (uint i = 0; i < _partnersName.length; i++) {
      require(_partnersName[i] != emptyBytes, 'Emtpy name.');
      require(_partnersAddress[i] != address(0), 'Zero address');
      partners[_partnersAddress[i]] = _partnersName[i];
    }
  }

  /**
  * @dev Tells the name of the partner corresponding to an address
  * @param target The address of the partner
  */
  function getPartnerName(address target)
    onlyWhiteList
    public view
    returns (bytes32)
  {
    return partners[target];
  }
}
