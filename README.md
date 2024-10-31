# EVM Auto Deploy

一个用于自动化部署以太坊代币合约的工具，支持用户在终端中输入代币信息并自动完成合约的编译与部署。



## 安装和使用指南

### 1. 克隆 GitHub 项目

在终端中运行以下命令，将项目从 GitHub 克隆到本地：

```bash
git clone https://github.com/yourusername/evm-auto-deploy.git
cd evm-auto-deploy

```

2. 安装 Node.js 和 npm
确保已安装 Node.js 和 npm，可以使用以下命令检查安装情况：

  ```bash
node -v
npm -v

 ```
3. 安装项目依赖
进入项目目录后，运行以下命令安装项目所需的依赖：


 ```bash
npm install
 ```
4. 运行主部署脚本
使用以下命令运行 deploy.sh 脚本。该脚本会引导您输入配置并进行合约的自动化部署：

 ```bash
bash deploy.sh
   ```
5. 输入部署信息
运行脚本后，按提示输入以下信息：

私钥：部署账户的私钥（请确保安全）。
代币名称：您想要创建的代币名称（例如 "MyToken"）。
代币符号：代币的符号（例如 "MTK"）。
代币总供应量：代币的总供应量（例如 1000000）。
网络 RPC URL：节点的 RPC URL（可以使用 Infura、Alchemy 等服务）。
输入完信息后，脚本会将这些内容保存到 .env 文件中，供部署脚本使用。

6. 编译和部署合约
脚本会自动执行以下操作：

使用 npx hardhat compile 编译合约。
调用 scripts/deploy.js 脚本部署合约，完成后会在终端输出合约地址。
7. 验证部署
合约部署成功后，可以在对应的区块链浏览器（如 Etherscan 或 Goerli Etherscan）中查看部署的合约地址。



常见问题
依赖安装失败：确保已正确安装 Node.js 和 npm，并检查网络连接是否正常。
私钥安全性：避免将 .env 文件上传到公共存储库，防止私钥泄露。
RPC URL 错误：请检查 RPC URL 是否正确，是否指向有效的以太坊节点。
合约未部署成功：确保私钥账户有足够的测试网代币以支付部署费用。
支持的网络
支持任何兼容以太坊的网络，只需提供正确的 RPC URL，即可使用主网或测试网。

