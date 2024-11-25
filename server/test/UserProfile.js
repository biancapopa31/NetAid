const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UserProfile", function () {
    let UserProfile, userProfile, owner, addr1, addr2;

    beforeEach(async () => {
        UserProfile = await ethers.getContractFactory("UserProfile");
        userProfile = await UserProfile.deploy();
        // await userProfile.deployed();
        [owner, addr1, addr2] = await ethers.getSigners();
    });

    describe("Profile Creation", function () {
        it("Should allow a user to create a new profile with a unique username", async function () {
            const username = "testuser";
            const bio = "This is a test bio";
            const profilePictureURI = "https://example.com/pic";

            await expect(
                userProfile.createNewProfile(username, bio, profilePictureURI)
            )
                .to.emit(userProfile, "ProfileCreated")
                .withArgs(owner.address, username, bio, profilePictureURI);

            const profile = await userProfile.getProfile(owner.address);
            expect(profile.username).to.equal(username);
            expect(profile.bio).to.equal(bio);
            expect(profile.profilePictureURI).to.equal(profilePictureURI);

            const userAddresses = await userProfile.getAllUsersAddrs();
            expect(userAddresses).to.include(owner.address);
        });

        it("Should prevent creating a profile with a taken username", async function () {
            const username = "testuser";
            const bio = "This is a test bio";
            const profilePictureURI = "https://example.com/pic";

            await userProfile.createNewProfile(username, bio, profilePictureURI);

            await expect(
                userProfile.connect(addr1).createNewProfile(username, bio, profilePictureURI)
            ).to.be.revertedWith("Username is taken");
        });

        it("Should prevent creating a profile if one already exists for the user", async function () {
            const username = "testuser";
            const bio = "This is a test bio";
            const profilePictureURI = "https://example.com/pic";

            await userProfile.createNewProfile(username, bio, profilePictureURI);

            await expect(
                userProfile.createNewProfile("newuser", "new bio", "https://newpic.com")
            ).to.be.revertedWith("Profile already exists for this address");
        });
    });

    describe("Profile Editing", function () {
        it("Should allow a user to edit their profile with a new unique username", async function () {
            const oldUsername = "olduser";
            const newUsername = "newuser";
            const bio = "Updated bio";
            const profilePictureURI = "https://example.com/newpic";

            await userProfile.createNewProfile(oldUsername, "old bio", "https://oldpic.com");

            await expect(
                userProfile.editProfile(newUsername, bio, profilePictureURI)
            )
                .to.emit(userProfile, "ProfileUpdated")
                .withArgs(owner.address, newUsername, bio, profilePictureURI);

            const profile = await userProfile.getProfile(owner.address);
            expect(profile.username).to.equal(newUsername);
            expect(profile.bio).to.equal(bio);
            expect(profile.profilePictureURI).to.equal(profilePictureURI);
        });

        it("Should prevent editing to a username that is already taken", async function () {
            const username1 = "user1";
            const username2 = "user2";
            const bio = "Test bio";
            const profilePictureURI = "https://example.com/pic";

            await userProfile.createNewProfile(username1, bio, profilePictureURI);
            await userProfile.connect(addr1).createNewProfile(username2, bio, profilePictureURI);

            await expect(
                userProfile.editProfile(username2, "new bio", "https://newpic.com")
            ).to.be.revertedWith("Username is taken");
        });
    });

    describe("Profile Retrieval", function () {
        it("Should retrieve the correct profile for a given user", async function () {
            const username = "testuser";
            const bio = "This is a test bio";
            const profilePictureURI = "https://example.com/pic";

            await userProfile.createNewProfile(username, bio, profilePictureURI);

            const profile = await userProfile.getProfile(owner.address);
            expect(profile.username).to.equal(username);
            expect(profile.bio).to.equal(bio);
            expect(profile.profilePictureURI).to.equal(profilePictureURI);
        });

        it("Should return an empty profile for an address with no profile", async function () {
            const profile = await userProfile.getProfile(addr1.address);
            expect(profile.username).to.equal("");
            expect(profile.bio).to.equal("");
            expect(profile.profilePictureURI).to.equal("");
        });

        it("Should return all user addresses", async function () {
            await userProfile.createNewProfile("user1", "bio1", "https://pic1.com");
            await userProfile.connect(addr1).createNewProfile("user2", "bio2", "https://pic2.com");

            const userAddresses = await userProfile.getAllUsersAddrs();
            expect(userAddresses).to.include(owner.address);
            expect(userAddresses).to.include(addr1.address);
        });
    });
});