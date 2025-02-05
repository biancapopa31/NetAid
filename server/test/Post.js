const { expect } = require("chai");
const { ethers } = require("hardhat");
const { anyValue } = require ("@nomicfoundation/hardhat-chai-matchers/withArgs");


describe("Post", function () {
  let Post;
  let post;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract
    const PostFactory = await ethers.getContractFactory("Post");
    post = await PostFactory.deploy();
  });

  describe("Post Creation", function () {
    it("Should create a post and mint NFT", async function () {
      const text = "Hello World";
      const photoCid = "QmTest123";

      // Create post and check event
      await expect(post.connect(addr1).createPost(text, photoCid))
        .to.emit(post, "PostCreated")
        .withArgs([0, text, photoCid, anyValue , addr1.address]);

      // Check NFT ownership
      expect(await post.ownerOf(0)).to.equal(addr1.address);
      expect(await post.balanceOf(addr1.address)).to.equal(1);
    });

    it("Should increment post ID for each new post", async function () {
      await post.connect(addr1).createPost("Post 1", "Qm1");
      await post.connect(addr1).createPost("Post 2", "Qm2");
      
      const post1 = await post.getPost(0);
      const post2 = await post.getPost(1);
      
      expect(post1[0]).to.equal(0);
      expect(post2[0]).to.equal(1);
    });
  });

  describe("Post Retrieval", function () {
    beforeEach(async function () {
      await post.connect(addr1).createPost("Post 1", "Qm1");
      await post.connect(addr2).createPost("Post 2", "Qm2");
      await post.connect(addr1).createPost("Post 3", "Qm3");
    });

    it("Should get a single post by ID", async function () {
      const postData = await post.getPost(0);
      expect(postData[1]).to.equal("Post 1"); // text
      expect(postData[2]).to.equal("Qm1"); // photoCid
      expect(postData[3]).to.equal(addr1.address); // creator
    });

    it("Should get all posts", async function () {
      const allPosts = await post.getAllPosts();
      expect(allPosts.length).to.equal(3);
      expect(allPosts[0].text).to.equal("Post 1");
      expect(allPosts[1].text).to.equal("Post 2");
      expect(allPosts[2].text).to.equal("Post 3");
    });

    it("Should get user posts", async function () {
      const addr1Posts = await post.getUserPosts(addr1.address);
      expect(addr1Posts.length).to.equal(2);
      expect(addr1Posts[0].text).to.equal("Post 1");
      expect(addr1Posts[1].text).to.equal("Post 3");
    });

    it("Should return empty array for user with no posts", async function () {
      const addr3Posts = await post.getUserPosts(owner.address);
      expect(addr3Posts.length).to.equal(0);
    });
  });

  describe("NFT Functionality", function () {
    beforeEach(async function () {
      await post.connect(addr1).createPost("Post 1", "Qm1");
      await post.connect(addr1).createPost("Post 2", "Qm2");
    });

    it("Should track token ownership", async function () {
      expect(await post.ownerOf(0)).to.equal(addr1.address);
      expect(await post.ownerOf(1)).to.equal(addr1.address);
    });

    it("Should allow token transfers", async function () {
      await post.connect(addr1).transferFrom(addr1.address, addr2.address, 0);
      expect(await post.ownerOf(0)).to.equal(addr2.address);
    });

    it("Should track total supply", async function () {
      expect(await post.totalSupply()).to.equal(2);
    });

    it("Should enumerate tokens", async function () {
      expect(await post.tokenByIndex(0)).to.equal(0);
      expect(await post.tokenByIndex(1)).to.equal(1);
    });

    it("Should enumerate owner tokens", async function () {
      expect(await post.tokenOfOwnerByIndex(addr1.address, 0)).to.equal(0);
      expect(await post.tokenOfOwnerByIndex(addr1.address, 1)).to.equal(1);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle non-existent post retrieval", async function () {
      await expect(
        post.getPost(999)
      ).to.be.revertedWith("Content does not exist");
    });

    it("Should handle multiple posts in quick succession", async function () {
      await Promise.all([
        post.connect(addr1).createPost("Post 1", "Qm1"),
        post.connect(addr2).createPost("Post 2", "Qm2"),
        post.connect(addr1).createPost("Post 3", "Qm3")
      ]);

      const allPosts = await post.getAllPosts();
      expect(allPosts.length).to.equal(3);
    });
  });
});