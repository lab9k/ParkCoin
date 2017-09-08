# Parking: Front-end
See the project in action at [this website](https://parkcoin.lab9k.gent/).

## The idea
A webapplication for the new parking system using the distributed database ethereum. It brings parking your car to the twenty first century!

Using this online user interface anyone can easily register their parked car on their phone and pay with parking tokens. Those 
parking tokens can even be bought beforehand with ether.

## The implementation
The application was made by [lab9k](https://github.com/lab9k) especially for the city of Ghent. Registrations on the ethereum contract are 
automatically caught by the back-end system (discover more at our other repository: [lab9k/ParkingREST](https://github.com/lab9k/ParkingREST)).

The front-end strives to make everying as easy as possible for everyone. It automatically detects the parking zone 
you're in when the user specifies their location, using our own [MapIt](http://global.mapit.mysociety.org/) deployment.

## Technologies
* Node.js - Platform for API & Server
* Express.js - Regulates exchange between API and DB 
* jsencypt.js - Encryption of license plates
* node-rsa.js - Decryption of license plates
* Web3.js - Regulates exchange between API and Ethereum contracts
* MongoDB - Stores all the license plates

## Architecture

![architecture](https://raw.githubusercontent.com/lab9k/Parking/master/site/img/structure.png)


##Authors
* **Hans Fraiponts**
* **Ruben Alliet**
* **Wannes Vereecken**
* **Jef Willems**
* **Pieter-jan Philips**
* **Tom Lauwaerts**
* **Michiel Derveeuw**

##License
This project is licensed under the MIT License


