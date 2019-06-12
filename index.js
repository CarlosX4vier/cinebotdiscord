var express = require('express');
var app = express();
const port = 3000;
var server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))
var io = require('socket.io', { rememberTransport: false })(server);
let ejs = require('ejs')
const youtube = require('./robots/youtube');

const Discord = require('discord.js');
const client = new Discord.Client();
const Sala = require('./classes/sala.js');
var credentials = require('./credentials');

app.set('view engine', 'ejs')
app.set('views', './view');

setInterval(() => {
  for (i = 0; i < Sala.salas.length; i++) {
    if (Sala.salas[i].playlist.length >= 1) {
      if (Sala.salas[i].tempo >= Sala.salas[i].playlist[0].duracao) {
        Sala.salas[i].tempo = 0;
        Sala.salas[i].playlist.shift();
      } else {
        Sala.salas[i].atualizarTempo();
        io.to(Sala.salas[i].id).emit("time", { duracao: Sala.salas[i].tempo, sala: Sala.salas[i].id, video: Sala.salas[i].playlist[0].id });
      }
    }
  }
}, 1000);


Sala.salas = [];

client.on('guildCreate', (guild) => {

  //guild.defaultChannel.send("Olá, eu sou a **Jessy**, a organizadora do **CineDiscord** e eu já estou pronta para começar : \n `COMANDOS` \n:arrow_right: **!assistir** *link do YouTube* - Para começar a sessão de videos \n :arrow_right:  **!doar** - Para saber como colaborar com o projeto. \n :star: E AI?! Vamos começar?! :smile:");
  let channelID;
  let channels = guild.channels;
  channelLoop:
  for (let c of channels) {
    let channelType = c[1].type;
    if (channelType === "text") {
      channelID = c[0];
      break channelLoop;
    }
  }

  let channel = guild.channels.get(guild.systemChannelID || channelID);
  channel.send(`Thanks for inviting me into this server!`);
  var msg = "Ol\u00E1, eu sou a **Jessy**, a organizadora do **Cine Discord** e eu j\u00E1 estou pronta para come\u00E7ar:\r\n\r\n`COMANDOS` \r\n:arrow_right: **!assistir** *link do YouTube* - Para come\u00E7ar a sess\u00E3o de videos\r\n:arrow_right:  **!doar** - Para saber como colaborar com o projeto. \r\n\r\n :star: E AI?! Vamos come\u00E7ar?!";
  channel.send(msg);
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

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



client.login('MzkyOTAzMTcwNTQ1ODExNDU3.XPaWwQ.J0SA8eN3y8mGEblnA6jiPB39o3U');


client.on('message', async (msg) => {
  if (msg.content.split(" ")[0] == "!assistir") {

    msg.reply("O endereço da sala do servidor '" + msg.guild.name + "' é " + credentials.site + "/?sala=" + msg.guild.id);


    /* salaUser = new Sala(salaID, "Sala numero" + salaID);
      if (verificarSala(salaUser.id) == -1) {
        Sala.salas.push(salaUser);
      }*/

    var idSala = Sala.criarSala(Sala.salas, msg.guild.id);

    var url = new URL(msg.content.split(" ")[1]);
    var idVideo = url.searchParams.get('v');
    await Sala.salas[idSala].adicionarVideo("yYzaEnt0kxs", msg);
    await Sala.salas[idSala].adicionarVideo("SEmlPFYAl-g", msg);
    await Sala.salas[idSala].adicionarVideo(idVideo, msg);
  }
});



app.get('/', (req, res) => {

  res.render("index", { teste: "AAA", site: credentials.site });

  /*console.log(client.guilds);

  var canais = client.guilds.array();
  var channels = canais;
  console.log(channels);
*/
  //canais.forEach(canal => canais.channels[585497914827210801].send("A"))

})


io.on('connection', function (socket) {
  let salaID = socket.handshake.query.sala;

  socket.join(salaID, function () {
    console.log("enviado para sala: " + salaID);

    console.log('a user connected');
    console.log(Sala.verificarSala(salaID))

  });

});