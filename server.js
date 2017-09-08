const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(express.static('site'));

const contract = require('./contract.js');

app.get('/', (req, res) => {
    res.sendFile("index.html", { root: __dirname + "/site/" })
});

app.get('/admin/:address', (req, res) => {
    let address = req.params.address;
    contract.isAdmin(address).then((value) => {
        if (value === true) {
            let fs = require('fs');
            fs.readFile('admin.html', 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                }
                res.send(data);
            });
        } else {
            res.send("<section id='content3'>not an admin</section>");
        }
    }).catch((error) => console.log(error))
});

app.listen(3000, () => {
    console.log('App listening on port 3000');
});
