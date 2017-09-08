# Parking: Front-end
See the project in action at [this website](https://parkcoin.lab9k.gent/).

## The idea
A webapplication for the new parking system using the distributed database ethereum. It brings parking your car to the twenty first century!

Using this online user interface anyone can easily register their parked car on their phone and pay with parking tokens. Those 
parking tokens can even be bought beforehand with ether.

## The implementation
The application was made by [lab9k](https://github.com/lab9k) especially for the city of Ghent. Registrations on the ethereum contract are 
automatically caught by the back-end system (discover more at our other repository: [lab9k/ParkingREST](https://github.com/lab9k/ParkingREST)).

### MapIt
The front-end strives to make everything as easy as possible for everyone. It automatically detects the parking zone 
you're in when the user specifies their location, using our own [MapIt deployment](https://mapit.lab9k.gent/).
Aside from all the current parking zones the server also has information on the bounderies of 
[the 25 official districts of Ghent](https://stad.gent/over-gent-en-het-stadsbestuur/over-gent/gent-25-wijken).

Interaction with MapIt goes via http get requests and returns json by default.
The most common query is a lookup by point. With the following format:
 https://mapit.lab9k.gent/point/[SRID]/[x],[y], where SRID is a unique number referring to a particular co-ordinate 
 system; the one you probably are interested in is 4326 for WGS84 normal lon/lat. x and y are the co-ordinates of the 
 point in the co-ordinate system. Note that Mapit works with longitude, latitude in contrast to many other services like 
 google maps where they use latitude, longitude. So x is longitude and y is latitude!
 
Here is an example: `https://mapit.lab9k.gent/point/4326/3.735406,51.048912`

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

More specifics about the MapIt API can be found at the official website of [Global MapIt](http://global.mapit.mysociety.org/).

## Technologies
* Node.js - Platform for API & Server
* Express.js - Regulates exchange between API and DB 
* jsencypt.js - Encryption of license plates
* node-rsa.js - Decryption of license plates
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


