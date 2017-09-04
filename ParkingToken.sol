pragma solidity ^0.4.11;
contract owned {
    function owned() {
        owner = msg.sender;
    }
    modifier onlyowner() { 
        if (msg.sender == owner)
            _;
    }
    address owner;
}

contract mortal is owned {
    function kill() {
        if (msg.sender == owner) suicide(owner);
    }
}



contract ParkingToken is owned {
    /*Token Variables*/
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256  _totalSupply;
    uint256 public buyPrice;


    mapping(address => uint) balances;
    mapping(uint => uint) private regios;
    mapping(uint => mapping(uint => uint)) public tickets;
    
    /*Events*/
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    
    /* Initializes contract with initial supply tokens to the creator of the contract */
    function ParkingToken() {
        owner = 0x6118E6A77bBBb43Bb77f7ECc1e77499600a8A6Ef;
        name = "ParkGent";                                    // Set the name for display purposes
        symbol = "🅿️";                                    // Set the symbol for display purposes
        decimals = 0;                                    // Amount of decimals for display purposes
        _totalSupply = 0;
        buyPrice = 0.37 finney;
    }
    
    function park(uint id, uint regio, uint tokens)  {
        require(balances[msg.sender] < tokens);
        balances[msg.sender] -= tokens;
        _totalSupply -= tokens;
        uint parkingtime = (tokens * regios[regio]) * 60;
        uint time = now + parkingtime;
        tickets[regio][id] = time;
        
    }
    
    function updateRegio(uint regio, uint price) onlyowner {
        regios[regio] = price;
    }

    //Transfer the balance from owner's account to another account
    function transfer(address to, uint256 amount) returns (bool) {
        if(balances[msg.sender] < amount) {
            return false;
        }
        balances[msg.sender] -= amount;
        balances[to] += amount;
        return true;
    }
    
    //Mint tokens, owner only
    function mintToken(address target, uint256 mintedAmount) internal {
        balances[target] += mintedAmount;
        _totalSupply += mintedAmount;
        Transfer(0, owner, mintedAmount);
        Transfer(owner, target, mintedAmount);
    }
    
    
    function setPrices(uint256 newBuyPrice) onlyowner {
        buyPrice = newBuyPrice;
    }
    
    function buy() payable {
        uint tokens = (msg.value * 1 finney) / buyPrice;
        mintToken(msg.sender, tokens);
    }
    
}