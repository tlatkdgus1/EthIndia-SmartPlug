const ganache = require('ganache-cli');
const Web3 = require('web3');
const {interface, bytecode} = require('./compile');
const web3 = new Web3(ganache.provider());

let address;

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  //console.log("Deploying from account", accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
  .deploy({data: '0x' + bytecode})
  .send({gas: '1000000', from: accounts[0]});

  //console.log("Deployed to address", result.options.address);

  address = result.options.address;

  return result;
};

const returnweb3 = async () => {
  return web3;
};

module.exports.contract = deploy();
module.exports.returnweb3 = returnweb3();
