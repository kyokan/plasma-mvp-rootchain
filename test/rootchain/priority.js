// external libraries
let RLP = require('rlp');
let assert = require('chai').assert;

let RootChain = artifacts.require("RootChain");

let rootchainHelpers = require('./rootchain_helpers.js');
let { catchError, toHex } = require('../utilities.js');

contract('Priority Calculation', async (accounts) => {
    // one rootchain contract for all tests
    let rootchain;

    let outputIndexFactor = Math.pow(2, 64);
    let txIndexFactor = Math.pow(2, 65);
    let blockNumFactor = Math.pow(2, 81);

    before(async () => {
        rootchain = await RootChain.new();
    });

    it("Check max function", async () => {

        let max = await rootchain.max.call(5, 5);
        assert.equal(max, 5, "wrong max value");

        max = await rootchain.max.call(10, 5);
        assert.equal(max, 10, "wrong max value");

        max = await rootchain.max.call(5, 10);
        assert.equal(max, 10, "wrong max value");
    })

    it("Check priority calculation", async () => {
        // Priority of both txns are the same
        let txBytes = RLP.encode([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, accounts[0], 5000, 0, 0, 0]);

        let actualTest = await rootchainHelpers.calculatePriority(txBytes);
        let actualContract = await rootchain.calculatePriority.call(toHex(txBytes));
        let expected = 0;

        assert.equal(actualTest, expected, "Helper function calculated the wrong priority.")
        assert.equal(actualContract, expected, "Rootchain contract calculated the wrong priority.")
        assert.equal(actualTest, actualContract, "The calculated priorties don't match.")

        // Priority of txn 1 should be bigger
        txBytes = RLP.encode([5, 4, 3, 2, 100000, 4, 3, 2, 1, 500000, accounts[0], 5000, 0, 0, 0]);

        actualTest = await rootchainHelpers.calculatePriority(txBytes);
        actualContract = await rootchain.calculatePriority.call(toHex(txBytes));
        expected = 2
            + outputIndexFactor * 3
            + txIndexFactor * 4
            + blockNumFactor * 5;

        assert.equal(actualTest, expected, "Helper function calculated the wrong priority.")
        assert.equal(actualContract, expected, "Rootchain contract calculated the wrong priority.")
        assert.equal(actualTest, actualContract, "The calculated priorties don't match.")

        // Priority of txn 2 should be bigger
        txBytes = RLP.encode([5, 4, 3, 2, 500000, 9, 8, 7, 6, 100000, accounts[0], 5000, 0, 0, 0]);

        actualTest = await rootchainHelpers.calculatePriority(txBytes);
        actualContract = await rootchain.calculatePriority.call(toHex(txBytes));
        expected = 6
            + outputIndexFactor * 7
            + txIndexFactor * 8
            + blockNumFactor * 9;

        assert.equal(actualTest, expected, "Helper function calculated the wrong priority.")
        assert.equal(actualContract, expected, "Rootchain contract calculated the wrong priority.")
        assert.equal(actualTest, actualContract, "The calculated priorties don't match.")

    })
});
