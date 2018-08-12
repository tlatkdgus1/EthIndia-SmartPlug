pragma solidity ^0.4.21;

contract smartPlugPayment{
    address public id;

    //constructor function
    constructor () public{
        id = msg.sender;
    }

    modifier adminAccess(address _id) {
        require(msg.sender == _id, "Sender not authorized.");
        _;
    }

    //deposits ether in the contract and returns sender address
    function deposit() payable public returns(address){
      require(msg.value == 1000000 wei);
      return msg.sender;
    }

     //function to get the current balance of the contract
    function getBalance() public view returns(uint256){
        return address(this).balance;
    }

    //pay the users
    function payUser(address[] user_addr) public {
        uint amount = address(this).balance / user_addr.length;
        for (uint i = 0; i < user_addr.length; i++) {
            user_addr[i].transfer(amount);
        }
    }
}
