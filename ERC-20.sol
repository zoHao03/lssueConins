// SPDX-License-Identifier: MIT

pragma solidity ^0.8.21;

contract SimpleERC20 {
    string public name;

    string public symbol;

    uint8 public decimals = 18;

    uint256 public totalSupply;

    address public owner;

    mapping(address => uint256) public balanceOf;

    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _supply,
        address _owner
    ) {
        name = _name;
        symbol = _symbol;
        owner = _owner;
        totalSupply = _supply * 10 ** uint256(decimals);
        balanceOf[_owner] = totalSupply;
        emit Transfer(address(0), _owner, totalSupply);
    }

    function transfer(
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(
        address _spender,
        uint256 _value
    ) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(balanceOf[_from] >= _value, "Insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "Allowance exceeded");
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}

contract TokenFactory {
    address[] public allTokens;

    event TokenCreated(
        address tokenAddress,
        string name,
        string symbol,
        uint256 supply,
        address owner
    );

    function createToken(
        string calldata _name,
        string calldata _symbol,
        uint256 _supply,
        address _owner
    ) public returns (address) {
        SimpleERC20 newToken = new SimpleERC20(_name, _symbol, _supply, _owner);
        allTokens.push(address(newToken));
        emit TokenCreated(address(newToken), _name, _symbol, _supply, _owner);
        return address(newToken);
    }

    function getAllTokens() public view returns (address[] memory) {
        return allTokens;
    }
}
