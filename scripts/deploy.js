require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("部署账户地址:", deployer.address);

  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy(process.env.TOKEN_NAME, process.env.TOKEN_SYMBOL, process.env.TOKEN_SUPPLY);

  await token.deployed();

  console.log("合约已成功部署，地址:", token.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
