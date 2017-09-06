// Globals
//////////

const DAPPINTERFACE = [ { "constant": false, "inputs": [ { "name": "nummerplaatEncrypted", "type": "string" }, { "name": "regio", "type": "uint256" }, { "name": "tokens", "type": "uint256" } ], "name": "park", "outputs": [ { "name": "succes", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string", "value": "ParkGent" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "balances", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "name": "", "type": "uint8", "value": "0" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "kill", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "buyPrice", "outputs": [ { "name": "", "type": "uint256", "value": "26" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string", "value": "P" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "newBuyPrice", "type": "uint256" } ], "name": "setPrices", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "buy", "outputs": [ { "name": "succes", "type": "bool" } ], "payable": true, "type": "function" }, { "constant": false, "inputs": [ { "name": "to", "type": "address" }, { "name": "amount", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "regio", "type": "uint256" }, { "name": "price", "type": "uint256" } ], "name": "updateRegio", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" }, { "name": "", "type": "bytes32" } ], "name": "tickets", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "inputs": [], "payable": false, "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_from", "type": "address" }, { "indexed": true, "name": "_to", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "who", "type": "address" }, { "indexed": false, "name": "tokens", "type": "uint256" } ], "name": "Buy", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "nummerplaatEncrypted", "type": "string" }, { "indexed": false, "name": "key", "type": "bytes32" } ], "name": "Park", "type": "event" } ];
const CONTRACTADDRESS = "0x4Ef51D61c88F77e55abE1653986E81C6a396251a";
const MAPITSERVER = ""; // TODO: fill in!

// TODO: add Internationalisation with Intl
// TODO: add account switching?

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
    if (typeof web3 !== "undefined") {
        // Use Mist/MetaMask"s provider
        window.web3 = new Web3(web3.currentProvider);
    } else {
        alert("No web3? You should consider trying MetaMask!");
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    }
    // Now we have web3 locked and loaded
    let contract = web3.eth.contract(DAPPINTERFACE).at(CONTRACTADDRESS);

    // Event handlers
    /////////////////

    $("#buyBtn").on("click", function (event) {
        let tokens = document.getElementById("aantalTokens").value;
        self.buy(tokens);
    });

    $("#parkBtn").on("click", function (event) {
        let licenseplate = document.getElementById("licenseplate").value;
        let regio = document.getElementById("regio").value;
        let time = document.getElementById("time").value;
        self.park(licenseplate, regio, time);
    });

    $("#updateRegioBtn").on("click", function (event) {
        let regioId = document.getElementById("regioUpdate").value;
        let regioValue = document.getElementById("regioValue").value;
        self.updateRegion(regioId, regioValue);
    });

    $("#buyPriceBtn").on("click", function (event) {
        let buyprice = document.getElementById("buyprice").value;
        self.setPrices(buyprice);
    });

    $("#aantalTokens").on("keydown", function (event) {
        let tokens = document.getElementById("aantalTokens").value;
        contract.buyPrice((error, buyprice) => {
            let price = ((tokens) / buyprice.valueOf()) / 10;
            $("#priceEther").val(price);
        });


    });

    // Getters
    //////////

    self.accounts = function () {
        return web3.eth.accounts;
    };

    self.defaultaccount = function () {
        // TODO: replace address with default account
        return "0x4219473B52c3D8946057Ed7Ceec851B78d319D74";
        // return web3.eth.defaultAccount;
    };

    // Methods
    //////////

    /**
     * Update the page
     */
    self.update = function () {
        // update total suply
        contract.totalSupply((error, value) => {
            let field = $("#totalInOmloop");
            field.val(value.valueOf());
            field.prop("readonly", true);
        });

        // update user's balance
        contract.balances(self.defaultaccount(), (error, value) => {
            let field = $("#aantalTokensVanGebruiker");
            field.val(value.valueOf());
            field.prop("readonly", true);
        });
    };

    // TODO: give alerts some nice styling
    // TODO: use whisper to confirm the transaction has been mined (if possible)
    self.park = function (licenseplate, region, payment) {
        let crypt = new JSEncrypt();
        crypt.setKey("MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDHOGTKyEAAiNMuWe2niVKKCvXu\n" +
            "qHn/CL+GlGnFbQE5DpKIgyp+b/UYDL5OnNP9BigK6G80KwNsptk0OuWobN6DhBZy\n" +
            "qOL4mT6T62vb3o4OpdrYA+z1nGsXsnuLW0UW1N5dLgNzhq9+XeOUP+DYp5msG8s4\n" +
            "EgXYf5U1LqEK/Xy4AQIDAQAB");
        let enc = crypt.encrypt(licenseplate);

        // First execute the method with the call function to check
        // whether or not the park function will resolve correctly
        contract.park.call(enc, region, payment, (error, succesful) => {
            if(succesful.valueOf()){
                // Execute the park now we know it'll work
                contract.park(enc, region, payment, (error, val) => {
                    // TODO: calculate end time instead of returning amount of tokens
                    alert("You've parked in " + region + " for " + payment + " tokens.");
                });
            } else {
                // The park method cannot execute properly
                // Show an error message to notify the user
                alert("Couldn't park. Insufficient parking tokens.");
            }
        });
    };

    // TODO: what if not owner? js error message?
    self.updateRegion = function (region, price) {
        contract.updateRegion(region, price, (error, value) => console.log(error, value));
    };

    self.setPrice = function (newPrice) {
        contract.setPrices(newPrice, (error, value) => console.log(error, value));
    };

    /**
     * Get region
     *
     * Given a lat/long coordinate tuple this method will return which parking zone the coordinates belong to,
     * using a mapit server dedicated to this purpose. The address of the server is saved in the constant MAPITSERVER.
     *
     * Even though EPSG:4326 specifically states that the coordinate order should be latitude/longitude, mapit still
     * uses longitude/latitude. In the spirit of standardisation we'll use lat/long for the order of the function's
     * arguments.
     *
     * Inside the function we'll have to be careful to use long/lat when communicating with the mapit server.
     *
     * @param latitude
     * @param longitude
     */
    self.getRegion = function (latitude, longitude) {
        $.getJSON( MAPITSERVER + longitude + "," + latitude, function (data) {
            // TODO: get region id from data and return

            // console.log("data: " + data["958855"]["name"]);
            // let items = [];
            // $.each( data, function( key, val ) {
            //     items.push( "<li id='" + key + "'>" + val + "</li>" );
            // });
            //
            // items.forEach(function (element) {
            //     console.log(element);
            // })
        });
    };

    self.buy = function (amount) {
        contract.buyPrice((error, buyprice) => {
            let wei = (amount * Math.pow(10, 16)) / buyprice.valueOf();
            contract.buy({value: wei, gas: 2100}, (error, value) => console.log(error, value));
        });
    };
}