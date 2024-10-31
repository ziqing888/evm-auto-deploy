#!/bin/bash

# 加载 .env 文件中的环境变量
export $(grep -v '^#' .env | xargs)

# 定义控制台颜色和格式
BOLD=$(tput bold)
NORMAL=$(tput sgr0)
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'

# 显示提示信息
show() {
    echo -e "${YELLOW}${BOLD}⏳ $1${NORMAL}"
}

# 检查是否安装了 Node.js 和 npm
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
    echo -e "${RED}Node.js 或 npm 未安装，请安装后再运行此脚本。${NORMAL}"
    exit 1
fi

# 检查是否安装 Hardhat 和 OpenZeppelin
if ! [ -d "node_modules/hardhat" ] || ! [ -d "node_modules/@openzeppelin/contracts" ]; then
    show "安装项目依赖..."
    npm install --legacy-peer-deps
fi

# 检查并安装 Solidity 编译器版本
if ! grep -q "version: \"0.8.20\"" hardhat.config.js; then
    show "配置 Hardhat 编译器为 0.8.20..."
    cat <<EOL > hardhat.config.js
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
      },
    ],
  },
};
EOL
fi

# 获取用户输入
read -p "请输入您的私钥: " PRIVATE_KEY
read -p "请输入代币名称 (例如: MyToken): " TOKEN_NAME
read -p "请输入代币符号 (例如: MTK): " TOKEN_SYMBOL
read -p "请输入代币总供应量 (例如: 1000000): " TOKEN_SUPPLY
read -p "请输入网络的 RPC URL: " RPC_URL

# 将输入的变量保存到 .env 文件中
cat <<EOL > .env
PRIVATE_KEY="$PRIVATE_KEY"
RPC_URL="$RPC_URL"
TOKEN_NAME="$TOKEN_NAME"
TOKEN_SYMBOL="$TOKEN_SYMBOL"
TOKEN_SUPPLY="$TOKEN_SUPPLY"
EOL

# 编译合约
show "编译合约..."
npx hardhat compile || { echo -e "${RED}合约编译失败。请检查编译器版本和依赖项。${NORMAL}"; exit 1; }

# 检查编译是否成功
if [ $? -ne 0 ]; then
  echo -e "${RED}合约编译失败，请检查 Solidity 版本或依赖项。${NORMAL}"
  exit 1
fi

# 部署合约
show "部署合约中..."
node scripts/deploy.js || { echo -e "${RED}合约部署失败，请检查 RPC URL 和私钥配置。${NORMAL}"; exit 1; }

echo -e "${GREEN}✅ 合约部署完成！${NORMAL}"

