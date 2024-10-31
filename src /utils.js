require('colors'); // 引入 colors 模块，用于控制台输出彩色文本
const fs = require('fs'); // 引入文件系统模块
const readlineSync = require('readline-sync'); // 引入 readline-sync，用于获取用户输入

// 加载网络配置函数
function 加载网络配置(网络类型) {
  const 文件路径 = `./chains/${网络类型}.json`; // 根据网络类型生成文件路径
  try {
    const 原始数据 = fs.readFileSync(文件路径); // 读取配置文件
    return JSON.parse(原始数据); // 解析 JSON 数据并返回
  } catch (错误) {
    console.error(`加载网络配置时出错: ${错误.message}`.red); // 如果读取失败，输出错误信息
    process.exit(1); // 终止进程
  }
}

// 获取用户输入函数
function 获取用户输入() {
  const 名称 = readlineSync.question('请输入代币名称: '.cyan); // 获取代币名称
  const 符号 = readlineSync.question('请输入代币符号: '.cyan); // 获取代币符号
  const 供应量 = readlineSync.question('请输入代币总量: '.cyan); // 获取代币总供应量
  return { 名称, 符号, 供应量 }; // 返回用户输入
}

// 显示头部信息函数
function 显示头部() {
  process.stdout.write('\x1Bc'); // 清空控制台
  console.log('========================================'.rainbow); // 彩虹样式分隔线
  console.log('=       🚀🎮 EVM 自动部署 🎮🚀      ='.cyan.bold);
  console.log('=     Created by HappyCuanAirdrop 🧙‍♂️   ='.magenta);
  console.log('=   https://t.me/HappyCuanAirdrop 🌐   ='.blue);
  console.log('========================================'.rainbow); // 彩虹样式分隔线
  console.log();
}

// 延迟函数
const 延迟 = (毫秒) => new Promise((resolve) => setTimeout(resolve, 毫秒)); // 返回一个延迟指定时间的 Promise

module.exports = { 加载网络配置, 获取用户输入, 显示头部, 延迟 }; // 导出这些函数以便在其他模块中使用
