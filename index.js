var express = require('express');
var app = express();
const port = 3000;
var server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))
var io = require('socket.io')(server);

const Discord = require('discord.js');
const client = new Discord.Client();
var duration = 0;
const Sala = require('./sala.js');

setInterval(() => {
  // io.emit("time", { duracao: duration });
  for (i = 0; i < salas.length; i++) {
    salas[i].atualizarTempo();
    io.to(salas[i].id).emit("time", { duracao: salas[i].tempo, sala: salas[i].id });
    // console.log("eMITINDO: " + salas[i].tempo + " para " + salas[i].id);
  }
}, 1000);


var salas = [];

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

function verificarSala(salaTeste) {
  return salas.findIndex(salaCheck => salaCheck.id == salaTeste);
}

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
});

client.login('MzkyOTAzMTcwNTQ1ODExNDU3.XPaWwQ.J0SA8eN3y8mGEblnA6jiPB39o3U');

app.get('/', (req, res) => {
  res.sendFile('/home/carlos/Documentos/Projeto Discord/teste.html');


  /*console.log(client.guilds);

  var canais = client.guilds.array();
  var channels = canais;
  console.log(channels);
*/
  //canais.forEach(canal => canais.channels[585497914827210801].send("A"))

})


io.on('connection', function (socket) {
  let salaID = socket.handshake.query.sala;
  console.log(socket.handshake.query);
  salaUser = new Sala(salaID, "Sala numero" + salaID);

  socket.join(salaUser.id, function () {
    console.log("enviado para sala: " + salaUser.id);

    console.log('a user connected');
    console.log(verificarSala(salaUser.id))
    if (verificarSala(salaUser.id) == -1) {
      salas.push(salaUser);
    }
  });

});