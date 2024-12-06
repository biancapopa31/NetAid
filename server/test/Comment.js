const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Comment Contract", function () {
  let contentBase, postContract, commentContract;
  let owner, user1, user2;

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();

    const ContentBase = await ethers.getContractFactory("ContentBase");
    contentBase = await ContentBase.deploy();
    // await contentBase.deployed();

    const Post = await ethers.getContractFactory("PostsContract");
    postContract = await Post.deploy(contentBase.address);
    // await postContract.deployed();

    const Comment = await ethers.getContractFactory("CommentsContract");
    commentContract = await Comment.deploy(postContract.address);
    // await commentContract.deployed();
  });

  it("Should add a comment to a post", async () => {
    await postContract.connect(user1).createPost("Post URI");
    await commentContract.connect(user2).addComment(0, "Comment Content");

    const comments = await commentContract.getCommentsByPost(0);
    expect(comments.length).to.equal(1);
    expect(comments[0].contentURI).to.equal("Comment Content");
  });

  it("Should emit an event when a comment is added", async () => {
    await postContract.connect(user1).createPost("Post URI");
    await expect(commentContract.connect(user2).addComment(0, "Comment Content"))
      .to.emit(commentContract, "CommentAdded")
      .withArgs(0, "Comment Content", user2.address);
  });
});
