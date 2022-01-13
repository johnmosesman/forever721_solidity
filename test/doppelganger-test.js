const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Doppelganger", function () {
  it("can mint a new NFT", async function () {
    [deployer] = await ethers.getSigners();

    const Doppelganger = await ethers.getContractFactory("Doppelganger");
    const doppelgangerContract = await Doppelganger.deploy();
    await doppelgangerContract.deployed();

    await doppelgangerContract.mint(deployer.address, "http://gm.com");

    const tokensCount = await doppelgangerContract.balanceOf(deployer.address)
    console.log("tokensCount: ", tokensCount);

    const tokenId = await doppelgangerContract.tokenOfOwnerByIndex(deployer.address, tokensCount - 1);
    console.log("token: ", tokenId);

    // XXXXX
    // Why is this blank???
    const tokenURI = await doppelgangerContract.tokenURI(tokenId);
    console.log("tokenURI: ", tokenURI);

    //const result = await doppelgangerContract.tokenURI(newId);

    //throw result;
    //deployer.getTheToken(theId)
    //expect(doppelgangerContract.retrieve(theId).tokenUri).to.equal("hi");


    //expect(await doppelgangerContract.greet()).to.equal("Hello, world!");

    //const setGreetingTx = await doppelgangerContract.setGreeting("Hola, mundo!");

    //// wait until the transaction is mined
    //await setGreetingTx.wait();

    //expect(await doppelgangerContract.greet()).to.equal("Hola, mundo!");
  });
});
