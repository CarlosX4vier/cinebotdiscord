const express = require('express')
const app = express()
const port = 3000
const Discord = require('discord.js');
const client = new Discord.Client();
var io = require('socket.io')(app);

io.on('connection', function(socket){
    console.log('a user connected');
  });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    var canais = client.guilds.array();
    //var channels = 
   /* canais.forEach(
        canal =>
            canal.channels.forEach(
                a => {
                    if(a.type =='text'){
                        a.send("A");
                    }
                }
            )
    );*/
    ///   console.log(canais.member.array());

});

client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('Pong!');
    }
});

client.login('MzkyOTAzMTcwNTQ1ODExNDU3.XPaWwQ.J0SA8eN3y8mGEblnA6jiPB39o3U');


app.get('/', (req, res) => {
    res.status(500)
    res.setHeader("Content-Type", "text/html");
    console.log(client.guilds);

    var canais = client.guilds.array();
    var channels = canais;
    console.log(channels);

    //canais.forEach(canal => canais.channels[585497914827210801].send("A"))

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
