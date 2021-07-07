pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract SquareVerifier{
    function verifyTx(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public returns(bool);
}


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is RealEstateTokenERC721Token {
    SquareVerifier squareVerifierContract;

    constructor(address squareVerifierContractAddress) public {
        squareVerifierContract = SquareVerifier(squareVerifierContractAddress);
    }

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 index;
        address provider;
    }

    // TODO define an array of the above struct
    Solution[] private solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) private uniqueSolutions;

    // TODO Create an event to emit when a solution is added
    event AddedSolution(uint256 index, address provider);


    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(bytes32 solutionKey) internal {
        uint256 index = solutions.length.add(1);
        Solution memory currentSolution = Solution(index, msg.sender);

        solutions.push(currentSolution);
        
        uniqueSolutions[solutionKey] = currentSolution;

        emit AddedSolution(index, msg.sender);
    }


    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function verifyMint(address to, uint256 tokenId, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public returns(bool){
        bytes32 solutionKey = keccak256(abi.encodePacked(a, b, c, input));

        require(squareVerifierContract.verifyTx(a, b, c, input), "Invalid proof");
        require(uniqueSolutions[solutionKey].index == 0, "Current solution exists");

        addSolution(solutionKey);

        bool mintStatus = mint(to, tokenId);
        return mintStatus;
    }

}

  


























