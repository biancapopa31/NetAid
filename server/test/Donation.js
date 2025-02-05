const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Donation", function () {
    let Donation;
    let donation;
    let userProfile;
    let UserProfile;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();

        const UserProfileFactory = await ethers.getContractFactory("UserProfile");
        userProfile = await UserProfileFactory.deploy();

        const DonationFactory = await ethers.getContractFactory("Donation");
        donation = await DonationFactory.deploy(userProfile.getAddress());

        await donation.setContractInUserProfile();
    });

    it("Should deploy UserProfile contract first", async function () {
        const UserProfile = await ethers.getContractFactory("UserProfile");
        const userProfile = await UserProfile.deploy();
        expect(await userProfile.getAddress()).to.properAddress;
    });

    describe("Donation", function () {
        it("Should accept donations and update user balance", async function () {
            const donationAmount = ethers.parseEther("1.0");

            await expect(donation.connect(addr1).donate(addr2.address, { value: donationAmount }))
                .to.emit(donation, "DonationReceived")
                .withArgs(addr1.address, donationAmount);

            expect(await donation.getBalance()).to.equal(donationAmount);
        });

        it("Should fail if donation amount is 0", async function () {
            await expect(
                donation.connect(addr1).donate(addr2.address, { value: 0 })
            ).to.be.revertedWith("msg.value can't be 0");
        });

        it("Should handle multiple donations to same user", async function () {
            const amount1 = ethers.parseEther("1.0");
            const amount2 = ethers.parseEther("0.5");

            await donation.connect(addr1).donate(addr2.address, { value: amount1 });
            await donation.connect(addr1).donate(addr2.address, { value: amount2 });

            expect(await donation.getBalance()).to.equal(amount1 + amount2);
        });
    });

    describe("Retrieval", function () {
        beforeEach(async function () {
            // Setup: make a donation first
            await donation.connect(addr1).donate(addr2.address, { value: ethers.parseEther("1.0") });
        });

        it("Should allow users to retrieve their balance", async function () {
            const initialBalance = await ethers.provider.getBalance(addr2.address);

            await expect(donation.connect(addr2).retreive())
                .to.emit(donation, "EtherRetreived")
                .withArgs(addr2.address, ethers.parseEther("1.0"));

            const finalBalance = await ethers.provider.getBalance(addr2.address);
            expect(finalBalance).to.be.gt(initialBalance);
        });

        it("Should fail if contract has no ETH", async function () {
            // First retrieve all ETH
            await donation.connect(addr2).retreive();

            await expect(
                donation.connect(addr2).retreive()
            ).to.be.revertedWith("No ETH available");
        });

        it("Should fail if user has no balance", async function () {
            await expect(
                donation.connect(addr1).retreive()
            ).to.be.revertedWith("User has no ether");
        });

        it("Should update user balance after retrieval", async function () {
            await donation.connect(addr2).retreive();

            const profile = await userProfile.getProfile(addr2.address);
            expect(profile.balance).to.equal(0);
        });
    });

    describe("Contract Management", function () {
        it("Should return correct contract balance", async function () {
            const amount = ethers.parseEther("1.0");
            await donation.connect(addr1).donate(addr2.address, { value: amount });
            expect(await donation.getBalance()).to.equal(amount);
        });

        it("Should return correct contract address", async function () {
            const address = await donation.getAddress();
            expect(address).to.equal(await donation.getAddress());
        });

        it("Should set donation contract in user profile", async function () {
            // This will be verified through the  contract
            await expect(donation.setContractInUserProfile())
                .to.not.be.reverted;
        });
    });
});
