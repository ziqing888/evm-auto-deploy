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

# 安装 Node.js 项目依赖
show "安装项目依赖..."
npm install

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
npx hardhat compile

# 使用 Node.js 脚本部署合约
show "部署合约中..."
node scripts/deploy.js

echo -e "${GREEN}✅ 合约部署完成！${NORMAL}"
