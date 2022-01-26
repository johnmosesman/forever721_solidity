const { expect } = require("chai");
const { ethers } = require("hardhat");
const { smock } = require('@defi-wonderland/smock');

describe("Doppelganger", function () {
  let myFake;
  let doppelgangerContract;
  let nftOwner;
  let notNftOwner;
  const tokenId = 1;
  const dummyIPFS = "ipfs://ipfs/QmAnIpFsHaSh";

  beforeEach(async function () {

    // Original NFT contract (mocked)
    myFake = await smock.fake("ERC721");

    // Deploy the snapshot contract
    const Doppelganger = await ethers.getContractFactory("Doppelganger");
    doppelgangerContract = await Doppelganger.deploy();
    await doppelgangerContract.deployed();

    [nftOwner, notNftOwner] = await ethers.getSigners();

    // Mock the owner of the original NFT
    myFake.ownerOf.whenCalledWith(tokenId).returns(nftOwner.address);
  });

  it("cannot mint the snapshot if you are not the owner", async function () {
    await expect(
      doppelgangerContract.connect(notNftOwner).snapshot(myFake.address, tokenId, dummyIPFS)
    ).to.be.revertedWith("Doppelganger: only owner of original token can snapshot.");
  });

  it("can mint the snapshot if you are the owner", async function () {
    myFake.tokenURI.returns("http://gm.com");

    await doppelgangerContract.connect(nftOwner).snapshot(myFake.address, tokenId, dummyIPFS)

    tokensCount = await doppelgangerContract.balanceOf(nftOwner.address)
    expect(tokensCount).to.equal(1);

    const realizedTokenId = await doppelgangerContract.tokenOfOwnerByIndex(nftOwner.address, tokensCount - 1);
    expect(realizedTokenId).to.equal(tokenId);
  });

  it("stores a reference to the original", async function () {
    const snapshotTxn = await doppelgangerContract.connect(nftOwner).snapshot(myFake.address, tokenId, dummyIPFS);
    snapshotTxn.wait();

    const snapshot = await doppelgangerContract.snapshots(1);

    expect(snapshot.snapshotMinter).to.equal(nftOwner.address);
    expect(snapshot.originalTokenAddress).to.equal(myFake.address);
    expect(snapshot.originalTokenId).to.equal(tokenId);
  });

  it("stores the new tokenURI", async function () {
    const snapshotTxn = await doppelgangerContract.connect(nftOwner).snapshot(myFake.address, tokenId, dummyIPFS);
    snapshotTxn.wait();

    const snapshot = await doppelgangerContract.snapshots(1);

    const storedTokenUri = await doppelgangerContract.tokenURI[1];

    expect(storedTokenUri === dummyIPFS, "");
  });

});
