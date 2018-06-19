'use strict';
const HDWalletProvider = require('truffle-hdwallet-provider');
require('dotenv').config();

module.exports = {
  networks: {
    local: {
      provider: function() {
        return new HDWalletProvider(
          'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat',
          'http://localhost:9545'
        )
      },
      gas: 5000000,
      network_id: '*'
    }
  }
};
