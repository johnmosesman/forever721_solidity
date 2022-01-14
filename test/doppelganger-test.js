const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Doppelganger", function () {
  it("can mint a new NFT", async function () {
    [deployer] = await ethers.getSigners();

    const Doppelganger = await ethers.getContractFactory("Doppelganger");
    const doppelgangerContract = await Doppelganger.deploy();
    await doppelgangerContract.deployed();

    const uri = "http://gm.com";

    const txn = await doppelgangerContract.connect(deployer).mint(uri);
    await txn.wait();

    const tokensCount = await doppelgangerContract.balanceOf(deployer.address)
    const tokenId = await doppelgangerContract.tokenOfOwnerByIndex(deployer.address, tokensCount - 1);
    const tokenURI = await doppelgangerContract.tokenURI(tokenId);

    expect(tokenURI).to.equal(uri);
  });
});
