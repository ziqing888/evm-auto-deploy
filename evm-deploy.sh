#!/bin/bash

# 配置颜色与符号
BANNER_COLOR='\033[1;36m'
RESET_COLOR='\033[0m'
EMOJI_SUCCESS="🎉"
EMOJI_ERROR="⚠️"
LOG_FILE="deployment.log"

# 记录日志函数
log() {
    echo "$(date +'%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

# 打印信息函数，支持不同类型的消息
print_message() {
    local message=$1
    local type=$2
    case $type in
        "error") echo -e "${BANNER_COLOR}${EMOJI_ERROR} $message${RESET_COLOR}" ;;
        "success") echo -e "${BANNER_COLOR}${EMOJI_SUCCESS} $message${RESET_COLOR}" ;;
        *) echo -e "${BANNER_COLOR}ℹ️  $message${RESET_COLOR}" ;;
    esac
}

# 安装依赖
install_dependencies() {
    print_message "正在检查依赖..." "info"
    if ! command -v forge &> /dev/null; then
        print_message "未找到 Foundry。正在安装..." "info"
        curl -sL https://foundry.paradigm.xyz | bash
        source ~/.bashrc  # 确保 Foundry 安装后的命令可用
        log "Installed Foundry"
    fi
    print_message "依赖已安装。" "success"
}

# 获取用户输入
input_details() {
    read -p "请输入代币名称: " TOKEN_NAME
    read -p "请输入代币符号: " TOKEN_SYMBOL
    read -p "请输入私钥: " PRIVATE_KEY
    read -p "请输入网络 RPC URL: " RPC_URL

    mkdir -p token_deployment
    cat <<EOL > token_deployment/.env
TOKEN_NAME="$TOKEN_NAME"
TOKEN_SYMBOL="$TOKEN_SYMBOL"
PRIVATE_KEY="$PRIVATE_KEY"
RPC_URL="$RPC_URL"
EOL

    log "用户输入了代币信息。"
    print_message "信息已保存至 .env 文件。" "success"
}

# 部署合约
deploy_contract() {
    source token_deployment/.env

    mkdir -p src
    cat <<EOL > src/$TOKEN_NAME.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract $TOKEN_NAME is ERC20 {
    constructor() ERC20("$TOKEN_NAME", "$TOKEN_SYMBOL") {
        _mint(msg.sender, 100000 * (10 ** decimals()));
    }
}
EOL

    print_message "正在编译合约..." "info"
    forge build
    if [[ $? -ne 0 ]]; then
        print_message "合约编译失败。" "error"
        exit 1
    fi

    print_message "正在部署合约..." "info"
    DEPLOY_OUTPUT=$(forge create src/$TOKEN_NAME.sol:$TOKEN_NAME \
        --rpc-url "$RPC_URL" \
        --private-key "$PRIVATE_KEY")

    if [[ $? -ne 0 ]]; then
        print_message "合约部署失败。" "error"
        exit 1
    fi

    CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -oP 'Deployed to: \K(0x[a-fA-F0-9]{40})')
    print_message "合约部署成功，地址为: $CONTRACT_ADDRESS" "success"
    log "合约部署成功，地址: $CONTRACT_ADDRESS"
}

# 显示菜单
display_menu() {
    echo -e "\n${BANNER_COLOR}========== 脚本菜单 ==========${RESET_COLOR}"
    echo "1) 安装依赖"
    echo "2) 输入代币信息"
    echo "3) 部署合约"
    echo "4) 退出"
    read -p "请选择一个选项: " choice
}

# 主循环
while true; do
    display_menu
    case $choice in
        1) install_dependencies ;;
        2) input_details ;;
        3) deploy_contract ;;
        4) print_message "退出脚本。" "info"; exit 0 ;;
        *) print_message "无效选项，请重试。" "error" ;;
    esac
done
