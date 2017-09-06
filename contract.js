const config = require("./config.json");
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(config.infuraNode));

function isAdmin() {
    let abi = config.contractABI;
    let contractAddress = config.address;
    let instance = new web3.eth.Contract(abi, contractAddress);

    return new Promise((resolve, reject) => {
        instance.methods.isOwner().call((error, value) => {
            if (error) {
                reject(error);
            } else {
                resolve(value);
            }
        });
    });
}


module.exports = {
    isAdmin: () => {
        return isAdmin();
    }
};