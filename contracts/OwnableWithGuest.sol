pragma solidity ^0.4.21;


/**
 * @title OwnableWithGuest
 */
contract OwnableWithGuest {
  address internal owner;
  address internal guest;


  event OwnershipRenounced(address indexed previousOwner);
  event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
  );


  /**
  * @dev Initializes the address of the owner
  * @param _owner The address of owner
  * @param _guest The address of guest
  */
  function initializeOwnerAndGuest(address _owner, address _guest) internal {
    require(owner == address(0));
    require(_owner != address(0));
    require(guest == address(0));
    require(_guest != address(0));
    owner = _owner;
    guest = _guest;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Throws if called by any account other than the owner or guest.
   */
  modifier onlyOwnerOrGuest() {
    require(msg.sender == owner || msg.sender == guest);
    _;
  }

  /**
   * @dev Allows the current owner to relinquish control of the contract.
   * @notice Renouncing to ownership will leave the contract without an owner.
   * It will not be possible to call the functions with the `onlyOwner`
   * modifier anymore.
   */
  function renounceOwnership() public onlyOwner {
    emit OwnershipRenounced(owner);
    owner = address(0);
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param _newOwner The address to transfer ownership to.
   */
  function transferOwnership(address _newOwner) public onlyOwner {
    _transferOwnership(_newOwner);
  }

  /**
   * @dev Transfers control of the contract to a newOwner.
   * @param _newOwner The address to transfer ownership to.
   */
  function _transferOwnership(address _newOwner) internal {
    require(_newOwner != address(0));
    emit OwnershipTransferred(owner, _newOwner);
    owner = _newOwner;
  }
}
