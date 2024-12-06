const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Post Contract", function () {
  let contentBase, postContract;
  let owner, user1, user2;

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();

    const ContentBase = await ethers.getContractFactory("ContentBase");
    contentBase = await ContentBase.deploy();
    // await contentBase.deployed();

    const Post = await ethers.getContractFactory("PostsContract");
    postContract = await Post.deploy(contentBase.address);
    // await postContract.deployed();
  });

  it("Should create a post and retrieve it", async () => {
    await postContract.connect(user1).createPost("Post URI");
    const post = await postContract.getPost(0);
    expect(post.contentURI).to.equal("Post URI");
  });

  it("Should fetch all posts for a user", async () => {
    await postContract.connect(user1).createPost("Post 1");
    await postContract.connect(user1).createPost("Post 2");
    const userPosts = await postContract.getPostsByUser(user1.address);
    expect(userPosts.length).to.equal(2);
  });

  it("Should emit an event when a post is created", async () => {
    await expect(postContract.connect(user1).createPost("Post URI"))
      .to.emit(postContract, "PostCreated")
      .withArgs(user1.address, 0, "Post URI");
  });
});
