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
        if (msg.sender == owner) selfdestruct(owner);
    }
}

contract ParkingToken is mortal {
    /*Token Variables*/
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    uint public buyPrice;


    mapping(address => uint) public balances;
    mapping(uint => uint) private regios;
    mapping(uint => mapping(bytes32 => uint)) public tickets;
    
    /*Events*/
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Buy(address who, uint tokens);
    event Park(string nummerplaatEncrypted, bytes32 key);
    
    /* Initializes contract with initial supply tokens to the creator of the contract */
    function ParkingToken() {
        owner = msg.sender;
        name = "ParkGent";                                    // Set the name for display purposes
        symbol = "P";                                    // Set the symbol for display purposes
        decimals = 0;                                    // Amount of decimals for display purposes
        totalSupply = 0;
        buyPrice = 26;
        regios[0] = 100;
        regios[1] = 50;
        regios[2] = 150;
        regios[3] = 200;
    }
    
    function park(string nummerplaatEncrypted, uint regio, uint tokens) returns (bool succes) {
        if (balances[msg.sender] < tokens) return false;
        balances[msg.sender] -= tokens;
        totalSupply -= tokens;
        uint parkingtime = (tokens * regios[regio] * 60) /100;
        
        uint time = now + parkingtime;
        
        bytes32 hash = sha3(nummerplaatEncrypted);

        uint temp = tickets[regio][hash];

        if (temp > now){
            tickets[regio][hash] += parkingtime;
        } else {
            tickets[regio][hash] = time;
        }
        
        Park(nummerplaatEncrypted, hash);

        return true;
        
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
        totalSupply += mintedAmount;
        Transfer(0, owner, mintedAmount);
        Transfer(owner, target, mintedAmount);
    }
    
    
    function setPrices(uint256 newBuyPrice) onlyowner {
        buyPrice = newBuyPrice;
    }
    
    function buy() payable returns (bool succes){
        uint tokens = (msg.value / 1000000000000000) * (buyPrice) /10 +1;
        mintToken(msg.sender, tokens);
        Buy(msg.sender, tokens);
        return true;
    }
    
}