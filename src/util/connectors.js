import Web3 from 'web3';
import HDWalletProvider from 'truffle-hdwallet-provider';
import { abi as bookingAbi } from '../abis/OwnedBooking.json';
import { abi as partnersAbi } from '../abis/PartnersList.json';

/* !!!!! FOR LOCAL GANACHE-CLI NET !!!!! */
const wallet = new HDWalletProvider(
  process.env.REACT_APP_MNEMONIC_GANACHE,
  'http://localhost:9545'
);
const bookingProxyAddress = '0x3e1462883442ece69f57261d4782cf362c8d6cd4';
const bookingProxyGuestAddress = '0xd773ecf58229487a50b0a067cdc6444b8e15dd73';
const partnersProxyAddress = '0xb0d834bdc0e626302b9ffad1d2461b677e1cb974';

export const web3 = new Web3(wallet.engine);


export const from = wallet.addresses[0];

export const Booking = new web3.eth.Contract(bookingAbi, bookingProxyAddress).methods;
export const BookingGuest = new web3.eth.Contract(bookingAbi, bookingProxyGuestAddress).methods;
export const PartnersList = new web3.eth.Contract(partnersAbi, partnersProxyAddress).methods;
