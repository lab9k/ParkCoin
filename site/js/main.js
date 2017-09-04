// Globals
//////////

const dappInterface = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"},{"name":"regio","type":"uint256"},{"name":"tokens","type":"uint256"}],"name":"park","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"buyPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newBuyPrice","type":"uint256"}],"name":"setPrices","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"tickets","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"buy","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"regio","type":"uint256"},{"name":"price","type":"uint256"}],"name":"updateRegio","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"}];
const contractAddress = "0x592641BeE4Fb0A36c9D0Dc2602b768f25B39Bd8E";

// window.addEventListener('load', function () {
//
//     // Checking if Web3 has been injected by the browser (Mist/MetaMask)
//     if (typeof web3 !== 'undefined') {
//         // Use Mist/MetaMask's provider
//         window.web3 = new Web3(web3.currentProvider);
//
//     } else {
//         console.log('No web3? You should consider trying MetaMask!');
//         // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
//     }
//
//     // Now you can start your app & access web3 freely:
//     contractEvents.init();
// });

/**
 * The class ParkingTokenMarket
 * Calculates the price of parking tokens
 *
 * @constructor
 */
function ParkingTokenMarket () {
  let self = this;

  self.getPrice = function (amount) {
    // Return the price for the specified amount of parking tokens
  }
}

/**
 * The ParkingRegistry class
 *
 * Should only be created after the window is loaded.
 * @constructor
 */
function ParkingRegistry () {
  let self = this;

  // Load web3
  ////////////

  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);

  } else {
    console.log('No web3? You should consider trying MetaMask!');
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  }
  // Now we have web3 locked and loaded

  // Getters
  //////////

  self.accounts = function () {
    return web3.eth.accounts;
  };

  self.defaultaccount = function () {
    return web3.eth.defaultAccount;
  };

  // Methods
  //////////

  // TODO: don't write errors to the console
  self.park = function (id, region, payment) {
    let contract = web3.eth.contract(dappInterface).at(contractAddress);
    contract.park(id, region, payment, (error, value) => console.log(error, value));
  };

  // TODO: what if not owner? js error message?
  self.updateRegion = function (region, price) {
    let contract = web3.eth.contract(dappInterface).at(contractAddress);
    contract.updateRegion(region, price, (error, value) => console.log(error, value));
  };

  self.setPrices = function (newPrice) {
    let contract = web3.eth.contract(dappInterface).at(contractAddress);
    contract.setPrices(newPrice, (error, value) => console.log(error, value));
  };

  self.buy = function () {
    let contract = web3.eth.contract(dappInterface).at(contractAddress);
    contract.buy((error, value) => console.log(error, value));
  };
}