const express = require('express');
const app = express();
const port = 3000;

let ejs = require('ejs')

const Discord = require('discord.js');
const client = new Discord.Client();
const Sala = require('./classes/sala.js');
var credentials = require('./credentials');
var path = require('path')

const Crunchyroll = require("./robots/crunchyroll")

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs')
app.set('views', './view');

var server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))
var io = require('socket.io', { rememberTransport: false })(server);


//Seta valores
Sala.salas = [];
Sala.io = io;

app.get('/room', async (req, res) => {
    t = new Crunchyroll
    t.getIframe("https://www.crunchyroll.com/pt-br/attack-on-titan/episode-56-the-basement-783663");
    res.render("index", { teste: "AAA", site: credentials.host });

})

