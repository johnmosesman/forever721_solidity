const { expect } = require("chai");
const { ethers } = require("hardhat");
const { smock } = require('@defi-wonderland/smock');

describe("Doppelganger", function () {
  let myFake;
  let doppelgangerContract;

  beforeEach(async function () {
    // Original NFT contract (mocked)
    const myErc721Factory = await ethers.getContractFactory("ERC721");
    myFake = await smock.fake(myErc721Factory);

    // Deploy the snapshot contract
    const Doppelganger = await ethers.getContractFactory("Doppelganger");
    doppelgangerContract = await Doppelganger.deploy();
    await doppelgangerContract.deployed();
  });

  it("cannot mint the snapshot if you are not the owner", async function () {
    [nftOwner, notNftOwner] = await ethers.getSigners();

    // prime mock - owner addr of this token
    const tokenId = 1;
    myFake.ownerOf.returns(nftOwner.address);

    // Minting the snapshot should fail if you're not the owner
    await expect(
      doppelgangerContract.connect(notNftOwner).snapshot(myFake.address, tokenId)
    ).to.be.revertedWith("Doppelganger: only owner of original token can snapshot.");
  });

  it("can mint the snapshot if you are the owner", async function () {
    [nftOwner] = await ethers.getSigners();

    // prime mock - owner addr of this token
    const tokenId = 1;
    myFake.ownerOf.returns(nftOwner.address);
    myFake.tokenURI.returns("http://gm.com");

    // Minting the snapshot should work if you are the owner
    await expect(
      doppelgangerContract.connect(nftOwner).snapshot(myFake.address, tokenId)
    )
      .to.emit(doppelgangerContract, "SnapshotCreated")
      .withArgs(nftOwner.address, tokenId);


    tokensCount = await doppelgangerContract.balanceOf(nftOwner.address)
    expect(tokensCount).to.equal(1);

    const realizedTokenId = await doppelgangerContract.tokenOfOwnerByIndex(nftOwner.address, tokensCount - 1);
    expect(realizedTokenId).to.equal(tokenId);
    const tokenUri = await doppelgangerContract.tokenURI(realizedTokenId);
    expect(tokenUri).to.equal("http://gm.com");
  });

  it("mints with empty tokenURI if the contract doesn't implement tokenURI", async function () {
    [nftOwner] = await ethers.getSigners();

    // prime mock - owner addr of this token
    const tokenId = 1;
    myFake.ownerOf.returns(nftOwner.address);

    // Minting the snapshot should work if you are the owner
    const snapshotTxn = await doppelgangerContract.connect(nftOwner).snapshot(myFake.address, tokenId);
    snapshotTxn.wait();

    tokensCount = await doppelgangerContract.balanceOf(nftOwner.address)
    expect(tokensCount).to.equal(1);

    const realizedTokenId = await doppelgangerContract.tokenOfOwnerByIndex(nftOwner.address, tokensCount - 1);
    expect(realizedTokenId).to.equal(tokenId);
    const tokenUri = await doppelgangerContract.tokenURI(realizedTokenId);
    expect(tokenUri).to.equal('');
  });

  it("stores a reference to the original", async function () {
    [nftOwner] = await ethers.getSigners();

    // prime mock - owner addr of this token
    const tokenId = 1;
    myFake.ownerOf.returns(nftOwner.address);

    const snapshotTxn = await doppelgangerContract.connect(nftOwner).snapshot(myFake.address, tokenId);
    snapshotTxn.wait();

    const snapshot = await doppelgangerContract.snapshots(1);

    expect(snapshot.wallet).to.equal(nftOwner.address);
    expect(snapshot.originalTokenAddress).to.equal(myFake.address);
    expect(snapshot.originalTokenId).to.equal(tokenId);
  });
});
