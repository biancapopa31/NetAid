const { expect } = require("chai");
const { ethers } = require("hardhat");
const { formatBytes32String, parseBytes32String } = ethers.utils;

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
    const encodedComment = formatBytes32String("Comment Content");
    await commentContract.connect(user2).createComment(encodedComment, 0);

    const comments = await commentContract.getCommentsForPost(0);
    const decodedComments = comments.map(comment => ({
      id: comment.id.toNumber(),
      text: parseBytes32String(comment.text),
      timestamp: comment.timestamp.toNumber(),
      creator: comment.creator,
      postId: comment.postId.toNumber()
    }));
    expect(decodedComments.length).to.equal(1);
    expect(decodedComments[0].text).to.equal("Comment Content");
    expect(decodedComments[0].postId).to.equal(0);
  });

  it("Should emit an event when a comment is added", async () => {
    await postContract.connect(user1).createPost("Post URI");
    const encodedComment = formatBytes32String("Comment Content");
    await expect(commentContract.connect(user2).createComment(encodedComment, 0))
      .to.emit(commentContract, "CommentCreated")
      .withArgs(0, "Comment Content", user2.address, 0);
  });
});
