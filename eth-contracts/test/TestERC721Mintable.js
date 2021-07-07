var ERC721MintableComplete = artifacts.require('RealEstateTokenERC721Token');
// const BigNumber = require('bignumber.js');

contract('TestERC721Mintable', accounts => {

    const owner = accounts[0];
    const account_one = accounts[1];
    const account_two = accounts[2];
    const account_three = accounts[3];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: owner});

            // TODO: mint multiple tokens
            await this.contract.mint(account_one, 101, {from: owner});
            await this.contract.mint(account_one, 102, {from: owner});
            await this.contract.mint(account_two, 103, {from: owner});
            await this.contract.mint(account_three, 104, {from: owner});
        })

        it('should return total supply', async function () { 
            const tokenSupply = await this.contract.totalSupply();
            assert.equal(tokenSupply.toNumber(), 4, "Incorrect supply");
        })

        it('should get token balance', async function () { 
            const tokenBalance = await this.contract.balanceOf(account_one);
            assert.equal(tokenBalance.toNumber(), 2, "Incorrect balance");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            const tokenURI = await this.contract.tokenURI(101, {from: account_one});
            const providedURI = 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/101';
            assert.equal(tokenURI, providedURI);
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.transferFrom(account_one, account_two, 102, {from: account_one});
            const accountOneBalance = await this.contract.balanceOf.call(account_one);
            const accountTwoBalance = await this.contract.balanceOf.call(account_two);
            const tokenOwner = await this.contract.ownerOf.call(102);

            assert.equal(accountOneBalance.toNumber(), 1, "Incorrect sender's balance");
            assert.equal(accountTwoBalance.toNumber(), 2, "Incorrect receiver's balance");
            assert.equal(tokenOwner, account_two, "Incorrect owner after transaction");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: owner});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let mintStatus = false;
            try {
                await this.contract.mint(account_one, 101, {from: account_one});
            } catch (error) {
                mintStatus = true;
            }
            assert.equal(mintStatus, true, "Caller is not contract owner, so minting is successful");
        })

        it('should return contract owner', async function () { 
            let contractOwner = await this.contract.owner();
            assert.equal(contractOwner, owner, `contractOwner(${contractOwner}) is not original contract owner (${owner})`);
        })

    });
})