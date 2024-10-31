const solc = require('solc'); // 导入solc编译器模块
const fs = require('fs'); // 导入文件系统模块

function 生成合约代码(名称, 符号, 供应量) {
  const 合约代码 = `// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract ERC20 {
  mapping(address => uint256) public 余额;
  mapping(address => mapping(address => uint256)) public 授权额度;

  uint256 public 总供应量;
  string public 名称;
  string public 符号;
  uint256 public 小数位;

  event 转账(address indexed from, address indexed to, uint256 value);
  event 授权(address indexed owner, address indexed spender, uint256 value);

  constructor(string memory _名称, string memory _符号, uint256 _供应量, uint256 _小数位) {
    名称 = _名称;
    符号 = _符号;
    总供应量 = _供应量 * 10 ** _小数位;
    余额[msg.sender] = 总供应量;
    小数位 = _小数位;
  }

  function 转账(address _to, uint256 _value) public {
    require(余额[msg.sender] >= _value);
    余额[msg.sender] -= _value;
    余额[_to] += _value;
    emit 转账(msg.sender, _to, _value);
  }

  function 授权地址(address _spender, uint256 _value) public {
    授权额度[msg.sender][_spender] = _value;
    emit 授权(msg.sender, _spender, _value);
  }

  function 从授权转账(address _from, address _to, uint256 _value) public {
    require(余额[_from] >= _value);
    require(授权额度[_from][msg.sender] >= _value);
    余额[_from] -= _value;
    余额[_to] += _value;
    授权额度[_from][msg.sender] -= _value;
    emit 转账(_from, _to, _value);
  }

  function 查询余额(address _owner) public view returns (uint256) {
    return 余额[_owner];
  }

  function 查询授权额度(address _owner, address _spender) public view returns (uint256) {
    return 授权额度[_owner][_spender];
  }
}

contract ${名称.split(' ').join('')} is ERC20 {
  constructor() ERC20("${名称}", "${符号}", ${供应量}, 18) {}
}
  `;

  fs.writeFileSync('contract.sol', 合约代码);

  const 输入 = {
    language: 'Solidity',
    sources: {
      'contract.sol': {
        content: 合约代码,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  };

  const 输出 = JSON.parse(solc.compile(JSON.stringify(输入)));

  const 合约文件 =
    输出.contracts['contract.sol'][名称.split(' ').join('')];
  const 合约字节码 =
    输出.contracts['contract.sol'][名称.split(' ').join('')].evm.bytecode;
  if (!合约文件) {
    throw new Error(`合约编译失败：未在输出中找到 ${名称}。`);
  }

  return {
    bytecode: 合约字节码,
    abi: 合约文件.abi,
  };
}

module.exports = { 生成合约代码 };
