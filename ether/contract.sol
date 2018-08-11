pragma solidity ^0.4.17;
//   conract is invoked from a trusted and verified source
//   args{hash id, int usage, int limit, address addr }
//   store ethers
//   pay ethers to the user
//   generate balance if less electricity consumed
//   transfer the balance to the users address
//   close
contract smartPlugPayment{
    string id;
    uint16 limit;
    uint32 prev;
    uint32 curr;
    uint32 electron;
    //constructor funciton
    constructor (string _id) public{
        id = _id;
    }
    //set previous usage value
    function setPrev(uint32 _prev) public{
        prev = _prev;
    }
    //set current usage value
    function setCurr(uint32 _curr) public{
        curr = _curr;
    }
    //set limit
    function setLimit(uint16 _limit) public{
        limit = _limit;
    }
    //deposits ether in the contract
    function deposit(uint256 amount) payable public{
        require(msg.value == amount);
    } 
     //function to get the current balance of the contract
    function getBalance() public view returns(uint256){
        return address(this).balance;
    }
    function payUser(address user_addr) payable public {
        user_addr.call.value(msg.value).gas(20317)();
    }
    function generateMoney() public view returns(uint32){
         //logic for coin generation and payment
         if(curr < prev && curr <= limit){
             return (electron*(1 - 1/(prev - curr)));
         }
         else{
             return 0;
         }
    }
   
    
}

