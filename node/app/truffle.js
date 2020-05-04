module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    networks: {
        ganache: {
            host: "ganache",
            port: 7545,
            network_id: "*", // Match any network id
        },
        geth: {
            host: "private-chain-1",
            port: 8545,
            network_id: "4224",
            gas: 4700000,
            // from: "ddffffc540bc00e915bef356aad1be85ccac1b4c",
            from: "2e2c380c6f369e9f8f20b9092c659592919f5904",
        },
    },
    solc: {
        settings: {
            optimizer: {
                enables: true,
                runs: 200,
            },
        },
    },
};
