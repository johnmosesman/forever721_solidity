const { expect } = require("chai");
const { ethers } = require("hardhat");

// TODO: this import is failing; maybe try v2?
const { smoddit, smockit } = require("@eth-optimism/smock");


describe("Doppelganger", function () {
  let myERC721;
  let MyMockContract;
  let mockContract, doppelgangerContract;

  beforeEach(async function () {
    const MyERC721 = await ethers.getContractFactory("ERC721");
    myERC721 = await MyERC721.deploy();
    await myERC721.deployed();

    // Original NFT contract
    const MyMockContract = await smockit(myERC721);

    // Original NFT contract
    const ERC721Mock = await ethers.getContractFactory("ERC721Mock");
    mockContract = await ERC721Mock.deploy();
    await mockContract.deployed();

    // Deploy the snapshot contract
    const Doppelganger = await ethers.getContractFactory("Doppelganger");
    doppelgangerContract = await Doppelganger.deploy();
    await doppelgangerContract.deployed();
  });

  it("cannot mint the snapshot if you are not the owner", async function () {
    [nftOwner, notNftOwner] = await ethers.getSigners();

    // prime mock
    const tokenId = 1;
    MyMockContract.smocked.ownerOf.will.return.with(nftOwner.address);

    // // Mint the original NFT
    // const txn = await mockContract.connect(nftOwner).mint("http://google.com/nfts");
    // await txn.wait();

    // // Get the original NFT tokenId
    // let tokensCount = await mockContract.balanceOf(nftOwner.address)
    // const tokenId = await mockContract.tokenOfOwnerByIndex(nftOwner.address, tokensCount - 1);

    // Minting the snapshot should fail if you're not the owner
    await expect(
      doppelgangerContract.connect(notNftOwner).snapshot(MyMockContract.address, tokenId)
    ).to.be.revertedWith("Doppelganger: only owner of original token can snapshot.");
  });

  it("can mint the snapshot if you are the owner", async function () {
    [nftOwner] = await ethers.getSigners();

    // Mint the original NFT
    const txn = await mockContract.connect(nftOwner).mint("http://google.com/nfts");
    await txn.wait();

    // Get the original NFT tokenId
    let tokensCount = await mockContract.balanceOf(nftOwner.address)
    let tokenId = await mockContract.tokenOfOwnerByIndex(nftOwner.address, tokensCount - 1);

    // Minting the snapshot should fail if you're not the owner
    const snapshotTxn = await doppelgangerContract.connect(nftOwner).snapshot(mockContract.address, tokenId);
    snapshotTxn.wait();

    tokensCount = await doppelgangerContract.balanceOf(nftOwner.address)
    expect(tokensCount).to.equal(1);

    tokenId = await doppelgangerContract.tokenOfOwnerByIndex(nftOwner.address, tokensCount - 1);
    const tokenUri = await doppelgangerContract.tokenURI(tokenId);
    expect(tokenUri).to.equal("blah");
  });
});
