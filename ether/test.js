const mod = require('./deploy');

let balance;
let smartPlug;
let accounts;
let web3;

const display = async () => {
  smartPlug = await mod.contract;
  web3 = await mod.returnweb3;
  accounts = await web3.eth.getAccounts();
};

const deposited = async () => {
  await console.log("Account: ", accounts[1]);
  await smartPlug.methods.deposit().send({
    from: accounts[1],
    value: web3.utils.toWei('1', 'ether')
  });
  await console.log("Deposit successful")
}

const getBalance = async () => {
  balance = await smartPlug.methods.getBalance().call({
    from: accounts[0]
  });
  await console.log(balance);
}

const setElectron = async () => {
  await smartPlug.methods.setElectron(balance).call({
    from: accounts[2]
  });
}

const setCurr = async () => {
  await smartPlug.methods.setCurr(1).call({
    from: accounts[2]
  });
}

const setPrev = async () => {
  await smartPlug.methods.setPrev(10).call({
    from: accounts[2]
  });
}

const test = async () => {
  await display();
  await deposited();
  await getBalance();
}/mod

test();
