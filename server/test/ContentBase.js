const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ContentBase Contract", function () {
  let contentBase;
  let owner, user1;

  beforeEach(async () => {
    [owner, user1] = await ethers.getSigners();
    const ContentBase = await ethers.getContractFactory("ContentBase");
    contentBase = await ContentBase.deploy();
    // await contentBase.deployed();
  });

  it("Should add content and retrieve it", async () => {
    await contentBase._createContent("Test Content URI");
    const allContent = await contentBase.getAllContent();
    expect(allContent.length).to.equal(1);
    expect(allContent[0].contentURI).to.equal("Test Content URI");
    expect(allContent[0].creator).to.equal(user1.address);
  });

  it("Should emit an event when content is added", async () => {
    await expect(contentBase._createContent("Test Content URI"))
      .to.emit(contentBase, "ContentAdded")
      .withArgs("Test Content URI", user1.address);
  });
});
