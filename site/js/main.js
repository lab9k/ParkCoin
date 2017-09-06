// Globals
//////////

const DAPPINTERFACE = [{"constant":false,"inputs":[{"name":"nummerplaatEncrypted","type":"string"},{"name":"regio","type":"uint256"},{"name":"tokens","type":"uint256"}],"name":"park","outputs":[{"name":"succes","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"regios","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"buyPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newBuyPrice","type":"uint256"}],"name":"setPrices","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"buy","outputs":[{"name":"succes","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"regio","type":"uint256"},{"name":"price","type":"uint256"}],"name":"updateRegio","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"bytes32"}],"name":"tickets","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"who","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Buy","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"nummerplaatEncrypted","type":"string"},{"indexed":false,"name":"key","type":"bytes32"}],"name":"Park","type":"event"}];
const CONTRACTADDRESS = "0xae8fbebdb5f8386b0bc5eba80f24318da74e1389";

const PUBLICKEY = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDHOGTKyEAAiNMuWe2niVKKCvXu\n" +
    "qHn/CL+GlGnFbQE5DpKIgyp+b/UYDL5OnNP9BigK6G80KwNsptk0OuWobN6DhBZy\n" +
    "qOL4mT6T62vb3o4OpdrYA+z1nGsXsnuLW0UW1N5dLgNzhq9+XeOUP+DYp5msG8s4\n" +
    "EgXYf5U1LqEK/Xy4AQIDAQAB";

const MAPITSERVER = "http://ushahidi.lab9k.gent:8000";

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
        // Use MetaMask's provider
        window.web3 = new Web3(web3.currentProvider);
    } else {
        alert("No web3? You should consider trying MetaMask!");
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    }
    // Now we have web3 locked and loaded

    // Private fields
    /////////////////

    let contract = web3.eth.contract(DAPPINTERFACE).at(CONTRACTADDRESS);

    /**
     * A mapping which maps all the different parking zones included in mapit to a number from the contract
     *
     * @type {{RED: number, ORANGE: number, YELLOW: number, GREEN: number, BLUE: number, OLIVE: number}}
     */
    let zoneMapping = {
        "RED": 0,
        "ORANGE": 1,
        "YELLOW": 2,
        "GREEN": 3,
        "BLUE": 4,
        "OLIVE": 5
    };

    // Event handlers
    /////////////////

    $("#buyBtn").on("click", function (event) {
        let tokens = document.getElementById("aantalTokens").value;
        self.buy(tokens);
    });

    $("#parkBtn").on("click", function (event) {
        // Get input
        let regio = document.getElementById("regio").value;
        let licenseplate = document.getElementById("licenseplate").value;
        let time = document.getElementById("time").value;

        console.log(licenseplate);

        // Validate input
        if (/[0-9]+/.test(time) && licenseplate !== "") {
            // Park
            self.park(licenseplate, regio, time);
        } else {
            // Wrong input
        }
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
            $("#priceEther").val(price + " ether");
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

    /**
     * Asynchronous getter for the rate of a certain zone
     *
     * @param zone one of the following strings: RED,YELLOW,GREEN,BLUE,OLIVE
     * @returns {Promise} when resolved it returns the rate for the given zone
     */
    self.getRate = function (zone) {
        return new Promise((resolve, reject) => {
            contract.regios(zoneMapping[zone], (error, value) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(value);
                }
            })
        });
    };

    // Methods
    //////////

    /**
     * Update the page
     */
    self.update = function () {
        // update user's balance
        contract.balances(self.defaultaccount(), (error, value) => {
            let field = $("#tokensCountUser");
            field.val(value.valueOf());
            field.prop("readonly", true);
        });
    };

    // TODO: give alerts some nice styling
    self.park = function (licenseplate, region, payment) {
        let crypt = new JSEncrypt();
        crypt.setKey(PUBLICKEY);
        let enc = crypt.encrypt(licenseplate);

        // First execute the method with the call function to check
        // whether or not the park function will resolve correctly
        contract.park.call(enc, region, payment, (error, succesful) => {
            if(succesful.valueOf()){
                // Execute the park now we know it'll work
                contract.park(enc, region, payment, (error, val) => {
                    // TODO: calculate end time instead of returning amount of tokens
                    if(!error) {
                        $("#parkBtn").addClass("ui loading button");
                        $("#parkBtn").prop('disabled', true);
                        self.confirmTransactionPark(enc);
                    }
                    else {
                        alert("User rejected transactions");
                    }
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
        // Get the supported areatypes from the zone mapping
        let areatypes = [];
        for (let prop in zoneMapping) {
            areatypes.push(prop);
        }

        // Execute http request to mapit server to get json
        $.getJSON( MAPITSERVER + "/point/4326/" + longitude + "," + latitude + "?type=" + areatypes.join(","), function (data) {
            // We never get more than one zone back from mapit because none of the parking zones overlap
            // and we only show those (see AREATYPES)
            let zone = data[Object.keys(data)[0]]["type"];
            if (zone === undefined) {
                // No zone was found you're not in a parking zone
                // Notify the user
                alert("Couldn't find a parking zone for your location.")
            } else {
                // We did find a zone. Look the corresponding integer up in the mapping and get the rate for the zone
                self.getRate(zone);
            }
        });
    };

    self.buy = function (amount) {
        contract.buyPrice((error, buyprice) => {
            let wei = (amount * Math.pow(10, 16)) / buyprice.valueOf();
            console.log("start");
            contract.buy({value: wei, gas: 210000}, (error, val) => {
                console.log("callback");
                if(!error) {
                    console.log("succes?");
                    $("#buyBtn").addClass("ui loading button");
                    $("#buyBtn").prop('disabled', true);
                    self.confirmTransactionBuy();
                }
                else {
                    alert("User rejected transactions");
                }
            });
            console.log("gedaan");
        });
    };

    self.confirmTransactionPark = function (enc) {
        let event = contract.Park();

        // watch for changes
        event.watch(function(error, result){
            // result will contain various information
            // including the argumets given to the Deposit
            // call.
            if (!error){
                console.log(result);
                if(result["args"]["nummerplaatEncrypted"] === enc) {
                    let parkbutton = $("#parkBtn");
                    parkbutton.removeClass("ui loading button");
                    parkbutton.prop('disabled', false);
                    alert("Transaction confirmed.");
                    event.stopWatching();
                }
            }

        });
    };

    self.confirmTransactionBuy = function () {
        let event = contract.Buy();

        // watch for changes
        event.watch(function(error, result){
            // result will contain various information
            // including the argumets given to the Deposit
            // call.
            if (!error){
                console.log(result);
                if(result["args"]["who"].toUpperCase() === self.defaultaccount().toUpperCase()) {
                    $("#buyBtn").removeClass("ui loading button");
                    $("#buyBtn").prop('disabled', false);
                    alert("Transaction confirmed. " + result["args"]["tokens"] + " tokens added.");
                    event.stopWatching();
                }
            }

        });
    };
}