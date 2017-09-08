# Parking: Front-end
See the project in action at [this website](https://parkcoin.lab9k.gent/).

## The idea
A distributed webapplication (or dapp) for the new parking system using the distributed database ethereum. It brings 
parking your car to the twenty first century!

Using this online user interface anyone can easily register their parked car on their phone and pay with parking tokens.
 Those parking tokens can even be bought beforehand with ether.

## The implementation
The application was made by [lab9k](https://github.com/lab9k) especially for the city of Ghent. 

Registrations of the 'Park' event on the ethereum contract are automatically caught by the REST api. 
A simple GET request to this api will return all the registered timestamps for each region for a given license plate. 
Discover more at our other repository: [lab9k/ParkingREST](https://github.com/lab9k/ParkingREST).

### The contract
The backbone of our dapp is our smart contract, via which anyone can buy parking tokens and paying for parking with those.

Our smart contract contains the following methods:
+ For admin:
    + *kill()* - selfdestructs the contract
    + *updateRegio(uint regio, uint price)* - changes the tariff of a zone
    + *setPrices(uint256 newBuyPrice)* - change the price of a park token by given the amount of tokens you get for 1 ether
+ For anyone:
    + *isOwner(address toCheck) returns (bool)* - return true if the supplied address is the owner of the contract, otherwise false
    + *park(string nummerplaatEncrypted, uint regio, uint tokens) returns (bool succes)* - allows someone to park 
    their car in a zone if they have enough tokens and have encrypted their license plate with the public key
    + *transfer(address to, uint256 amount) returns (bool)* - transfer tokens to another address, return true if successful
    + *buy() payable returns (bool succes)* - send ether to the contract to buy parking tokens

and following public fields:
+ string public name;
+ string public symbol;
+ uint8 public decimals;
+ uint256 public totalSupply;
+ uint public buyPrice;

+ mapping(address => uint) public balances;
+ mapping(uint => uint) public regios;
+ mapping(uint => mapping(bytes32 => uint)) public tickets;

and lastly these events that anyone can listen to:
+ event Transfer(address indexed _from, address indexed _to, uint256 _value);
+ event Buy(address who, uint tokens);
+ event Park(string nummerplaatEncrypted, bytes32 key);

### MapIt
The front-end strives to make everything as easy as possible for everyone. One way to achieve this is by automatically 
detecting the parking zone of the location specified by the user, using our own [MapIt deployment](https://mapit.lab9k.gent/).
Ofcourse the user can also let our dapp calculate their location automatically if the give their permission.
Aside from all the current parking zones the server also has information on the bounderies of 
[the 25 official districts of Ghent](https://stad.gent/over-gent-en-het-stadsbestuur/over-gent/gent-25-wijken).

Interaction with MapIt goes via http get requests and returns json by default.
The most common query is a lookup by point. With the following format:
 `https://mapit.lab9k.gent/point/[SRID]/[x],[y]`, where SRID is a unique number referring to a particular co-ordinate 
 system; the one you probably are interested in is 4326 for WGS84 normal lon/lat. x and y are the co-ordinates of the 
 point in the co-ordinate system. Note that Mapit works with longitude, latitude in contrast to many other services like 
 google maps where they use latitude, longitude. So x is longitude and y is latitude!
 
Here is an example URL:

        https://mapit.lab9k.gent/point/4326/3.735406,51.048912

This returns the following json:

        {
            "26": {
                "parent_area": null,
                "generation_high": 1,
                "all_names": {},
                "id": 26,
                "codes": {},
                "name": "Binnenstad",
                "country": "BE",
                "type_name": "Wijken",
                "generation_low": 1,
                "country_name": "België",
                "type": "WIJK"
            },
            "51": {
                "parent_area": null,
                "generation_high": 1,
                "all_names": {},
                "id": 51,
                "codes": {},
                "name": "zone11",
                "country": "BE",
                "type_name": "rood",
                "generation_low": 1,
                "country_name": "België",
                "type": "RED"
            }
        }

From the json we can extrapolate that the coordinate is situated in distric (WIJK) "Binnenstad" and parking zone RED.
With that last bit of information we can ask the contract for the tariff that applies within the RED zone.

More specifics about the MapIt API can be found at the official website of [Global MapIt](http://global.mapit.mysociety.org/).

## Technologies
* Node.js - Platform for API & Server
* Express.js - Regulates exchange between API and DB 
* Jsencypt.js - Encryption of license plates
* Node-rsa.js - Decryption of license plates
* Web3.js - Regulates exchange between API and Ethereum contracts
* MongoDB - Stores all the license plates

## Architecture

![architecture](https://raw.githubusercontent.com/lab9k/Parking/master/site/img/structure.png)

## Authors
* **Hans Fraiponts**
* **Ruben Alliet**
* **Wannes Vereecken**
* **Jef Willems**
* **Pieter-jan Philips**
* **Tom Lauwaerts**
* **Michiel Derveeuw**

## License
This project is licensed under the MIT License


