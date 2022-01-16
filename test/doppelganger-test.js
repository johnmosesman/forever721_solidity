const { expect } = require("chai");
const { ethers } = require("hardhat");
const { waffle } = require("hardhat");
// const {MockProvider} = require('@ethereum-waffle/provider');
const MockProvider = waffle.provider;
// const {deployMockContract} = require('@ethereum-waffle/mock-contract');
const deployMockContract = waffle.deployMockContract

const ERC721 = require('../artifacts/@openzeppelin/contracts/token/ERC721/ERC721.sol/ERC721.json');
const IERC721 = require('../artifacts/@openzeppelin/contracts/token/ERC721/IERC721.sol/IERC721.json');
// const IERC20 = require('../build/IERC20');


describe("Doppelganger", function () {
  let mockContract, doppelgangerContract;

  beforeEach(async function () {
    // get a mock ERC721 contract
    const [sender, receiver] = MockProvider.getWallets();
    mockContract = await deployMockContract(sender, IERC721.abi);
    // // Original NFT contract
    // const ERC721Mock = await ethers.getContractFactory("ERC721Mock");
    // mockContract = await ERC721Mock.deploy();
    // await mockContract.deployed();

    // Deploy the snapshot contract
    const Doppelganger = await ethers.getContractFactory("Doppelganger");
    doppelgangerContract = await Doppelganger.deploy();
    await doppelgangerContract.deployed();
  });

  it("cannot mint the snapshot if you are not the owner", async function () {
    [nftOwner, notNftOwner] = await ethers.getSigners();

    // prime mock - Mint the original NFT
    const tokenUri = "http://google.com/nfts";
    const tokenId = 1;
    // mockContract.mock.mint.withArgs(new_token_uri).returns(new_token_id);

    // prime mock - set owner of this token
    mockContract.mock.ownerOf.withArgs(tokenId).returns(nftOwner);

    // // prime mock - Get the original NFT tokenId
    // mockContract.mock.balanceOf.withArgs(nftOwner.address).returns()
    // // Mint the original NFT
    // const txn = await mockContract.connect(nftOwner).mint(new_token_uri);
    // await txn.wait();
    //
    // // Get the original NFT tokenId
    // let tokensCount = await mockContract.balanceOf(nftOwner.address)
    // const tokenId = await mockContract.tokenOfOwnerByIndex(nftOwner.address, tokensCount - 1);

    // Minting the snapshot should fail if you're not the owner
    await expect(
      doppelgangerContract.connect(notNftOwner).snapshot(mockContract, tokenId)
    ).to.be.revertedWith("Doppelganger: only owner of original token can snapshot.");
  });

  it("can mint the snapshot if you are the owner", async function () {
    [nftOwner] = await ethers.getSigners();

    let tokenId = 1;
    mockContract.mock.ownerOf.withArgs(tokenId).returns(nftOwner.address);
    // // Mint the original NFT
    // const txn = await mockContract.connect(nftOwner).mint("http://google.com/nfts");
    // await txn.wait();

    // // Get the original NFT tokenId
    // let tokensCount = await mockContract.balanceOf(nftOwner.address)
    // let tokenId = await mockContract.tokenOfOwnerByIndex(nftOwner.address, tokensCount - 1);

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
