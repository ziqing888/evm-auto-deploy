require('colors'); // 引入 colors 模块，用于控制台输出彩色文本
const ethers = require('ethers'); // 引入 ethers.js，用于与以太坊交互
const { generateContractCode } = require('./contractCode'); // 导入生成合约代码的函数

async function 部署合约(网络, 名称, 符号, 供应量) {
  try {
    const 提供者 = new ethers.JsonRpcProvider(网络.rpcUrl); // 连接到区块链网络的提供者
    const 钱包 = new ethers.Wallet(process.env.PRIVATE_KEY, 提供者); // 使用私钥创建钱包实例

    console.log(`\n正在部署合约到 ${网络.name}...`.yellow);

    const { bytecode, abi } = generateContractCode(名称, 符号, 供应量); // 调用生成合约代码的函数，获得字节码和ABI
    const 工厂 = new ethers.ContractFactory(abi, bytecode, 钱包); // 使用 ABI 和字节码创建合约工厂
    const 合约 = await 工厂.deploy(); // 部署合约

    console.log(`\n合约部署成功!`.green);
    console.log(`合约地址: ${合约.target}`.cyan); // 输出合约地址
    console.log(
      `浏览器 URL: ${网络.explorer}/address/${合约.target}`.blue
    ); // 输出区块链浏览器的合约地址链接

    return 合约.target;
  } catch (错误) {
    console.error(`部署合约时出错: ${错误.message}`.red); // 输出错误信息
    process.exit(1); // 退出进程
  }
}

module.exports = { 部署合约 }; // 导出部署合约的函数
