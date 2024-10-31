require('dotenv').config(); // 加载 .env 文件中的环境变量
require('colors'); // 引入 colors 模块，用于控制台输出彩色文本
const {
  loadNetworkConfig, // 从 utils 模块加载加载网络配置功能
  getUserInput, // 从 utils 模块加载获取用户输入功能
  displayHeader, // 从 utils 模块加载显示头部信息功能
  delay, // 从 utils 模块加载延迟功能
} = require('./src/utils');
const { deployContract } = require('./src/deploy'); // 从 deploy 模块加载合约部署功能
const readlineSync = require('readline-sync'); // 引入 readline-sync，用于获取用户的控制台输入

// 主函数 main
async function main() {
  displayHeader(); // 显示头部信息
  console.log(`请稍候...\n`.yellow);

  await delay(3000); // 延迟 3 秒，表示程序正在初始化

  console.log('欢迎使用 EVM 自动部署工具！'.green.bold);

  const networkType = process.argv[2] || 'testnet'; // 获取命令行中的网络类型参数，默认为 'testnet'
  const networks = loadNetworkConfig(networkType); // 加载指定的网络配置

  console.log(`可用的网络：`.yellow);
  networks.forEach((network, index) => {
    console.log(`${index + 1}. ${network.name}`); // 列出所有可用网络
  });

  // 让用户选择网络
  const networkIndex =
    parseInt(readlineSync.question('\n选择一个网络（输入数字）：'.cyan)) - 1;
  const selectedNetwork = networks[networkIndex];

  if (!selectedNetwork) {
    console.error('无效的网络选择'.red);
    process.exit(1); // 如果网络选择无效，输出错误并终止进程
  }

  const { name, symbol, supply } = getUserInput(); // 获取用户输入的代币名称、符号和供应量

  // 调用合约部署函数
  const contractAddress = await deployContract(
    selectedNetwork,
    name,
    symbol,
    supply
  );

  console.log(`\n部署完成！`.green.bold);
  console.log(`代币名称：${name}`);
  console.log(`代币符号：${symbol}`);
  console.log(`代币总量：${supply}`);
  console.log(`合约地址：${contractAddress}`);
}

// 捕获执行过程中的错误
main().catch((error) => {
  console.error(error);
  process.exit(1); // 输出错误信息并终止进程
});
