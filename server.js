const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(express.static('site'))

const contract = require('./contract.js');

app.get('/', function (req, res) {
    if (contract.isAdmin()) {
        res.sendFile("index.html", { root: __dirname + "/site/" })
    } else {
        //TODO do somethng else
    }
});

app.listen(3000, () => {
    console.log('App listening on port 3000');
});
