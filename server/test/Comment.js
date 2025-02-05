const { expect } = require("chai");
const { ethers } = require("hardhat");
const { anyValue } = require ("@nomicfoundation/hardhat-chai-matchers/withArgs");
const {bigint} = require("hardhat/internal/core/params/argumentTypes");


describe("Comment", function () {
    let Comment;
    let comment;
    let owner;
    let addr1;
    let addr2;
    let Post;
    let post;

    beforeEach(async function () {
        // Get signers
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy Post contract first (since comments are linked to posts)
        const PostFactory = await ethers.getContractFactory("Post");
        post = await PostFactory.deploy();

        // Deploy Comment contract
        const CommentFactory = await ethers.getContractFactory("Comment");
        comment = await CommentFactory.deploy();

        // Create a test post to comment on
        await post.connect(addr1).createPost("Test Post", "QmTest");
    });

    describe("Comment Creation", function () {
        it("Should create a comment for a post", async function () {
            const commentText = "This is a test comment";
            const postId = 0;

            await expect(comment.connect(addr2).createComment(commentText, postId))
                .to.emit(comment, "CommentCreated")
                .withArgs([
                    0, // id
                    commentText,
                    anyValue,
                    addr2.address
                ]);

            const newComment = await comment.getComment(0);
            expect(newComment.text).to.equal(commentText);
            expect(newComment.creator).to.equal(addr2.address);
        });

        it("Should fail if comment text is empty", async function () {
            await expect(
                comment.createComment("", 0)
            ).to.be.revertedWith("Content cannot be empty");
        });

        it("Should increment comment ID for each new comment", async function () {
            await comment.connect(addr1).createComment("Comment 1", 0);
            await comment.connect(addr1).createComment("Comment 2", 0);

            expect(await comment.nextCommentId()).to.equal(2);

            const comment1 = await comment.getComment(0);
            const comment2 = await comment.getComment(1);

            expect(comment1.id).to.equal(0);
            expect(comment2.id).to.equal(1);
        });
    });

    describe("Comment Retrieval", function () {
        beforeEach(async function () {
            // Create multiple posts and comments
            await post.connect(addr1).createPost("Post 2", "Qm2");

            await comment.connect(addr2).createComment("Comment 1 for Post 0", 0);
            await comment.connect(addr1).createComment("Comment 2 for Post 0", 0);
            await comment.connect(addr2).createComment("Comment 1 for Post 1", 1);
        });

        it("Should get a single comment by ID", async function () {
            const commentData = await comment.getComment(0);
            expect(commentData.text).to.equal("Comment 1 for Post 0");
            expect(commentData.creator).to.equal(addr2.address);
        });

        it("Should get all comments for a specific post", async function () {
            const postComments = await comment.getCommentsForPost(0);
            expect(postComments.length).to.equal(2);
            expect(postComments[0].text).to.equal("Comment 1 for Post 0");
            expect(postComments[1].text).to.equal("Comment 2 for Post 0");
        });

        it("Should return empty array for post with no comments", async function () {
            const postComments = await comment.getCommentsForPost(999);
            expect(postComments.length).to.equal(0);
        });

        it("Should fail when getting non-existent comment", async function () {
            await expect(
                comment.getComment(999)
            ).to.be.revertedWith("Comment does not exist");
        });
    });

    describe("Multiple Comments Handling", function () {
        it("Should handle multiple comments on the same post", async function () {
            for(let i = 0; i < 5; i++) {
                await comment.connect(addr1).createComment(`Comment ${i}`, 0);
            }

            const postComments = await comment.getCommentsForPost(0);
            expect(postComments.length).to.equal(5);

            for(let i = 0; i < 5; i++) {
                expect(postComments[i].text).to.equal(`Comment ${i}`);
            }
        });

        it("Should handle comments across different posts", async function () {
            // Create another post
            await post.connect(addr1).createPost("Second Post", "Qm2");

            // Add comments to both posts
            await comment.connect(addr1).createComment("Comment on post 0", 0);
            await comment.connect(addr1).createComment("Comment on post 1", 1);

            const post0Comments = await comment.getCommentsForPost(0);
            const post1Comments = await comment.getCommentsForPost(1);

            expect(post0Comments.length).to.equal(1);
            expect(post1Comments.length).to.equal(1);
            expect(post0Comments[0].text).to.equal("Comment on post 0");
            expect(post1Comments[0].text).to.equal("Comment on post 1");
        });
    });

    describe("Edge Cases", function () {
        it("Should handle concurrent comment creation", async function () {
            await Promise.all([
                comment.connect(addr1).createComment("Concurrent 1", 0),
                comment.connect(addr2).createComment("Concurrent 2", 0),
                comment.connect(addr1).createComment("Concurrent 3", 0)
            ]);

            const postComments = await comment.getCommentsForPost(0);
            expect(postComments.length).to.equal(3);
        });

        it("Should maintain correct comment order", async function () {
            await comment.connect(addr1).createComment("First", 0);
            await comment.connect(addr2).createComment("Second", 0);
            await comment.connect(addr1).createComment("Third", 0);

            const postComments = await comment.getCommentsForPost(0);
            expect(postComments[0].text).to.equal("First");
            expect(postComments[1].text).to.equal("Second");
            expect(postComments[2].text).to.equal("Third");
        });
    });
});