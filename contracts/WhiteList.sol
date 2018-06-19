pragma solidity ^0.4.21;

/**
* @title WhiteList
*/
contract WhiteList {

  address internal coke;
  address internal cokeProxy;
  address internal pepsi;
  address internal pepsiProxy;

  event CokeTransferred(address indexed previousOwner, address indexed newOwner);

  event PepsiTransferred(address indexed previousOwner, address indexed newOwner);

  event CokeProxyTransferred(address indexed previousProxy, address indexed newProxy);

  event PepsiProxyTransferred(address indexed previousProxy, address indexed newProxy);

  /**
  * @dev Throws if called by any account other than Coke
  */
  modifier onlyCoke() {
    require(msg.sender == coke, 'Permission denied.');
    _;
  }

  /**
  * @dev Throws if called by any account other than Pepsi
  */
  modifier onlyPepsi() {
    require(msg.sender == pepsi, 'Permission denied.');
    _;
  }

  /**
  * @dev Throws if called by any account other than Coke or Pepsi
  */
  modifier onlyWhiteList() {
    bool fromPepsi = msg.sender == pepsi;
    bool fromPepsiProxy = msg.sender == pepsiProxy;
    bool fromCoke = msg.sender == coke;
    bool fromCokeProxy = msg.sender == cokeProxy;
    require(fromCoke || fromCokeProxy || fromPepsi || fromPepsiProxy , 'Permission denied.');
    _;
  }

  /**
  * @dev Initializes the address of coke and pepsi
  * @param _coke The address of coke
  * @param _pepsi The address of pepsi
  * @param _cokeProxy The address of the proxy of the contract of Coke's booking
  * @param _pepsiProxy The address of the proxy of the contract of Pepsi's booking
  */
  function initializeWhiteList(
    address _coke,
    address _pepsi,
    address _cokeProxy,
    address _pepsiProxy
  ) internal {
    require(coke == address(0));
    require(pepsi == address(0));
    require(cokeProxy == address(0));
    require(pepsiProxy == address(0));
    require(_coke != address(0));
    require(_pepsi != address(0));
    require(_cokeProxy != address(0));
    require(_pepsiProxy != address(0));
    coke = _coke;
    pepsi = _pepsi;
    cokeProxy = _cokeProxy;
    pepsiProxy = _pepsiProxy;
  }

  /**
   * @dev Allows the current owner of Coke to transfer control of the contract to a newOwner.
   * @param newCoke The address to transfer ownership to.
   */
  function transferCoke(address newCoke) public onlyCoke {
    require(newCoke != address(0));
    emit CokeTransferred(coke, newCoke);
    coke = newCoke;
  }

  /**
   * @dev Allows the current owner of Coke to modify the address of the Coke proxy.
   * @param newProxy The address of the new proxy.
   */
  function transferCokeProxy(address newProxy) public onlyCoke {
    require(newProxy != address(0));
    emit CokeProxyTransferred(cokeProxy, newProxy);
    cokeProxy = newProxy;
  }

  /**
   * @dev Allows the current owner of Pepsi to transfer control of the contract to a newOwner.
   * @param newPepsi The address to transfer ownership to.
   */
  function transferPepsi(address newPepsi) public onlyPepsi {
    require(newPepsi != address(0));
    emit PepsiTransferred(coke, newPepsi);
    pepsi = newPepsi;
  }

  /**
   * @dev Allows the current owner of Pepsi to modify the address of the Pepsi proxy.
   * @param newProxy The address of the new proxy.
   */
  function transferPepsiProxy(address newProxy) public onlyPepsi {
    require(newProxy != address(0));
    emit PepsiProxyTransferred(pepsiProxy, newProxy);
    pepsiProxy = newProxy;
  }
}
