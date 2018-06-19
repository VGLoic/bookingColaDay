#Homework Booking

Welcome in this project! A brief explanation of the code and how to use it will
be presented.

The goal was to implement the back-end entirely on Ethereum, hence suppressing
the need for a database while not imposing any strong particular constraints on the
user experience. The user does not need any accounts or Ethers in order to use
this app.

The individuals are composed of Coke, Pepsi and the partners. Each
of them is represented by an Ethereum address, decided in advance and used as simple
identifiers. The addresses of Coke and Pepsi represent true accounts where there
are Ethers, these accounts are the ones paying for every transaction, basically
Coke is paying for the bookings associated with its rooms while Pepsi is paying
for the bookings associated with its rooms.
Coke, Pepsi and the partners may login in the app using their address as first
identifier and the associated private key as password. Of course, in a real app,
private keys of Coke and Pepsi, at least, should be treated with care since these
are the ones used to connect to the accounts with powers.


This application is functionnal, it works on development. Many things could be
adjusted or optimized, maybe even at the architecture level. Looking forward to
talk about this.


## Structure of the code

### Back-end

The back-end is simply three(actually two in terms of design) contracts written
in Solidity.

These contracts are fully upgradeable thanks to ZeppelinOS, this
means that each main contract is associated to a proxy which delegates the call
to the corresponding implementation. This allows one to upgrade the
implementation of a contract by simply modifying the address to which the proxy
refers for the implementation.
The main contracts are

- PartnersList: This contract handles the list of partners of the event using a
mapping from address(pseudonyms of the partner) to their actual name (in bytes32).
The only goal of this contract is to identify partners and Coke/Pepsi during the
login and booking phase.
Reading rights are limited (through the use of the WhiteList contract) to the
addresses representing Coke, Pepsi as well as the proxies of OwnedBooking of
Coke and Pepsi.
Everything is set at the initialization of the contract, no one has writing
rights in the partner's list.

- OwnedBooking: There will be two deployed contracts of this type.
This contract handles the reservations of Coke or Pepsi. It is partially defined
by an Owner and a Guest. For one contract, the owner is Coke and the guest is
Pepsi, for the other contract, the owner is Pepsi and the guest is Coke. Reading
rights are given to both the owner and the guest but writing rights are only
given to the owner.
It contains two mappings:
1. One represents the state of the partners with respect to the reservations,
i.e. if a partner has booked a room or not. The mapping is hence from bytes32
(name of the partner) to a structure containing the information associated to
his possible reservation.
2. The other one is the "inverse mapping" which represents if a room is booked
or not and by who. The mapping is hence from uint8 (representing each possible
representation) to bytes32 (name of the partner). Empty name means no booking.

PS: The choice here was to take 12 possible time slots (from 8:00-9:00 to
19:00-20:00) with ten rooms, the datas are then 12 arrays of 10 components. For
optimization purpose, these 120 possibilies were taken as a line such that indexes
0 from 9 represents the first array, indexes from 10 to 19 the second array, etc...

#### Organization of the folders and files

- contracts: contains the solidity contracts
- zos.json: keeps track of the contract followed by ZeppelinOS
- zos.local.json (not originally present): contains the informations about the proxies and implementations
deployed on the local test net.

#### Tests
Tests are not fully complete, most of them are here.
`npm run truffle-test`

### Front-end

This corresponds to the front-end of Coke, the front-end of Pepsi would be
similar in functionnalities and different in design.

The front-end is built using the React framework. A Redux store handles the
different datas at the front-end level. These datas are fetched from the
ganache-cli test net using Web3 1.0.0-beta.34. A jsonwebtoken is used in order
to keep a part of the data related to the user in the local storage. HOCS built
from redux-auth-wrapper are used to manage authorization and part of display.

A user is identified along the four following categories:
1. Pepsi: you may login but you will not see anything.
2. Coke: you may login, consult the bookings that have been done and export
the schedules that you want or simply publish them on IPFS (as JSON files).
3. Partner: you may login, consult the available rooms for Pepsi and Coke,
see what you have booked for Pepsi and Coke, book/cancel a room for Coke.
4. Non-partner: you may look at the homepage as long as you want.

The store is made from five parts:
1. user: stores the address and name of the user
2. errors: keeps track of the various errors that may appear
3. transaction: keeps track if a transaction is launched or ended
4. routing: (with react-router-redux) allows to navigate from / to /dashboard
5. booking: includes a lot, the booking informations related to the user, the
free schedules for Coke, the booked schedules for Coke, the free schedules for
Pepsi

#### Organization of the folders

Looking into the src folder:
- abis: contains the abis of the solidity contract, this is a symlink to the
build/contracts directory
- components: contains the display elements
- containers: contains the elements that contains other containers or components
- css: styling files
- store: everything related to the redux store (reducers and actions)
- util: contains the connectors for the back-end, the hocs and various helpers

## Installation

The installation is quite boring for the moment, sorry for that.

Node version: 8.11.2, Npm version: 5.6.0, web3: 1.0.0-beta.34.

Install, if not already done, [zos](https://docs.zeppelinos.org/docs/setup.html)
`npm install -g zos`

Install the dependencies: (possible vulnerabilities detected on zos)
`npm install`

In a terminal, launch the test net:
`npm run ganache-cli`

In an other terminal
1. push the contracts to the local test net:
`zos push --network local`
If everything went right, a zos-local.json file has been created.

2. create one PartnersList and two OwnedBooking proxies, don't mind the warning,
about the initialization, this is normal.
`zos create PartnersList --network local`
`zos create OwnedBooking --network local`
`zos create OwnedBooking --network local`
If everything went right, the zos.local.json file has been completed with the
addresses of the three proxies. Use these addresses in the src/util/connectors
(replace the old ones if there are different), and in the tmp.txt file in the
three commands that will be used later on.


3. connect to the local network
`truffle console --network local`

4. with the help of the addresses of the proxies in the zos.local.json file,
obtain the three instances:
`const partnersList = PartnersList.at('< Address of the PartnersList proxy>')`
`const cokeBooking = cokeBooking.at('< Address of the first OwnedBooking proxy>')`
`const pepsiBooking = pepsiBooking.at('< Address of the second OwnedBooking proxy>')`

5. initialize the three instances with the help of the commands in the tmp.txt
file, all you need is use these commands with the addresses of the proxies
replaced by the ones that you get in the zos.local.json file.

Finally, in an other terminal launch the front end:
`npm start`

The list of accounts is in the accountsList.csv file.
