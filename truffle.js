module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
    networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gasPrice: '1000000000',
      gas: '6721000',
      solc: {
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    }
  }
};
