const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UserProfile", function () {
  let UserProfile;
  let userProfile;
  let owner;
  let addr1;
  let addr2;
  let donationContract;

  beforeEach(async function () {
    // Get test accounts
    [owner, addr1, addr2, donationContract] = await ethers.getSigners();

    // Deploy the contract
    const UserProfileFactory = await ethers.getContractFactory("UserProfile");
    userProfile = await UserProfileFactory.deploy();


    // Set donation contract
    await userProfile.connect(donationContract).setDonationContract();
  });

  describe("Profile Creation", function () {
    it("Should create a new profile", async function () {
      const username = "testuser";
      const bio = "test bio";
      const profilePic = "bafkreielw242z5adle6zcqeml5k3vz3gwgsurvf3w7hnbgvtartlxauezy";

      await expect(
        userProfile.connect(addr1).createNewProfile(username, bio, profilePic)
      )
        .to.emit(userProfile, "ProfileCreated")
        .withArgs([username, bio, profilePic, 0]);

      const profile = await userProfile.getProfile(addr1.address);
      expect(profile.username).to.equal(username);
      expect(profile.bio).to.equal(bio);
      expect(profile.profilePictureCdi).to.equal(profilePic);
      expect(profile.balance).to.equal(0);
    });

    it("Should fail if profile already exists", async function () {
      await userProfile.connect(addr1).createNewProfile("user1", "bio1", "pic1");
      
      await expect(
        userProfile.connect(addr1).createNewProfile("user2", "bio2", "pic2")
      ).to.be.revertedWith("Profile already exists for this address");
    });

    it("Should fail if username is empty", async function () {
      await expect(
        userProfile.connect(addr1).createNewProfile("", "bio", "pic")
      ).to.be.revertedWith("Username is required");
    });

    it("Should fail if username is taken", async function () {
      await userProfile.connect(addr1).createNewProfile("user1", "bio1", "pic1");
      
      await expect(
        userProfile.connect(addr2).createNewProfile("user1", "bio2", "pic2")
      ).to.be.revertedWith("Username is taken");
    });
  });

  describe("Profile Editing", function () {
    beforeEach(async function () {
      await userProfile.connect(addr1).createNewProfile("user1", "bio1", "pic1");
    });

    it("Should edit an existing profile", async function () {
      const newUsername = "newuser";
      const newBio = "new bio";
      const newPic = "new pic";

      await expect(
        userProfile.connect(addr1).editProfile(newUsername, newBio, newPic)
      )
        .to.emit(userProfile, "ProfileUpdated")
        .withArgs([newUsername, newBio, newPic, 0]);

      const profile = await userProfile.getProfile(addr1.address);
      expect(profile.username).to.equal(newUsername);
      expect(profile.bio).to.equal(newBio);
      expect(profile.profilePictureCdi).to.equal(newPic);
    });
  });

  describe("Balance Management", function () {
    beforeEach(async function () {
      await userProfile.connect(addr1).createNewProfile("user1", "bio1", "pic1");
    });

    it("Should increase user balance", async function () {
      await userProfile.connect(donationContract).incUserBalance(addr1.address, 100);
      const profile = await userProfile.getProfile(addr1.address);
      expect(profile.balance).to.equal(100);
    });

    it("Should decrease user balance", async function () {
      await userProfile.connect(donationContract).incUserBalance(addr1.address, 100);
      await userProfile.connect(donationContract).decUserBalance(addr1.address, 50);
      const profile = await userProfile.getProfile(addr1.address);
      expect(profile.balance).to.equal(50);
    });

    it("Should only allow donation contract to modify balance", async function () {
      await expect(
        userProfile.connect(addr2).incUserBalance(addr1.address, 100)
      ).to.be.revertedWith("You are not the donation contract");

      await expect(
        userProfile.connect(addr2).decUserBalance(addr1.address, 50)
      ).to.be.revertedWith("You are not the donation contract");
    });
  });

  describe("Query Functions", function () {
    it("Should check if user exists", async function () {
      expect(await userProfile.connect(addr1).existsUser()).to.be.false;
      
      await userProfile.connect(addr1).createNewProfile("user1", "bio1", "pic1");
      expect(await userProfile.connect(addr1).existsUser()).to.be.true;
    });

    it("Should check if username exists", async function () {
      const username = "testuser";
      expect(await userProfile.existsUserByUserId(username)).to.be.false;
      
      await userProfile.connect(addr1).createNewProfile(username, "bio1", "pic1");
      expect(await userProfile.existsUserByUserId(username)).to.be.true;
    });

    it("Should get all user addresses", async function () {
      await userProfile.connect(addr1).createNewProfile("user1", "bio1", "pic1");
      await userProfile.connect(addr2).createNewProfile("user2", "bio2", "pic2");

      const addresses = await userProfile.getAllUsersAddrs();
      expect(addresses).to.include(addr1.address);
      expect(addresses).to.include(addr2.address);
      expect(addresses.length).to.equal(2);
    });
  });
});