const SquareVerifier = artifacts.require('SquareVerifier');
const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const SquareProof = require('../../zokrates/code/square/proof.json');
const TruffleAssert = require('truffle-assertions');
// const BigNumber = require('bignumber.js');

contract('TestSolnSquareVerifier', accounts => {
    
    const owner = accounts[0];
    const account_one = accounts[1];

    // Test if a new solution can be added for contract - SolnSquareVerifier
    describe('Test for adding new solution for contract', () => {
        beforeEach(async () => {
            const squareVerifier = await SquareVerifier.new({from: owner});
            this.contract = await SolnSquareVerifier.new(squareVerifier.address, {from: owner});
        })

        it('(token) can be minted for contract', async () => {
            const mintTX = await this.contract.verifyMint(account_one, 101, SquareProof.proof.a, SquareProof.proof.b, SquareProof.proof.c, SquareProof.inputs, {from: owner});

            await TruffleAssert.eventEmitted(mintTX, "AddedSolution");
        })
    })

    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    describe('Test if an ERC721 token can be minted for contract', () => {
        beforeEach(async () => {
            let squareVerifier = await SquareVerifier.new({from: owner});
            this.contract = await SolnSquareVerifier.new(squareVerifier.address, {from: owner});
        })

        it('(token) can be minted for contract', async () => {
            let mintedStatusOne = true;
            let mintedStatusTwo = true;

            try {
                await this.contract.verifyMint(account_one, 101, SquareProof.proof.a, SquareProof.proof.b, SquareProof.proof.c, SquareProof.inputs, {from: owner});
            } catch(error) {
                mintedStatusOne = false;
            }

            try {
                await this.contract.verifyMint(account_one, 102, SquareProof.proof.a, SquareProof.proof.b, SquareProof.proof.c, SquareProof.inputs, {from: owner});
            } catch(error) {
                mintedStatusTwo = false;
            }

            assert.equal(mintedStatusOne, true, "Failed to add new solution");
            assert.equal(mintedStatusTwo, false, "Failed to use existing solution");
        })
    })

})
