const express = require('express')
const app = express()
const port = 3000
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

app.get('/', (req, res) => {
    res.status(500)
    res.setHeader("Content-Type", "text/html");

    MongoClient.connect(url, function (err, db) {
        var dbo = db.db("app")
        dbo.collection("produtos").find({}).toArray(function (err, result) {
            res.send(result);

        })
    });
})

app.get('/produtos/', (req, res) => {
    res.status(500)
    res.setHeader("Content-Type", "text/json");

    MongoClient.connect(url, function (err, db) {
        var dbo = db.db("app")
        dbo.collection("produtos").find({}).toArray(function (err, result) {
            res.send(result);

        })
    });
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))