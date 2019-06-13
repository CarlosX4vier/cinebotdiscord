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
  var msg = "Ol\u00E1, eu sou a **Jessy**, a organizadora do **Cine Discord** e eu j\u00E1 estou pronta para come\u00E7ar:\r\n\r\n`COMANDOS` \r\n:arrow_right: **!assistir** *link do YouTube* - Para come\u00E7ar a sess\u00E3o de videos\r\n:arrow_right:  **!doar** - Para saber como colaborar com o projeto. \r\n\r\n :star: E AI?! Vamos come\u00E7ar?!";
  channel.send(msg);
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});



client.login('MzkyOTAzMTcwNTQ1ODExNDU3.XPaWwQ.J0SA8eN3y8mGEblnA6jiPB39o3U');


client.on('message', async (msg) => {
  if (msg.content.split(" ")[0] == "!assistir") {

    console.log("Sala existe: "+Sala.verificarSala(msg.guild.id));
    if (Sala.verificarSala(msg.guild.id) == -1) {
      msg.reply("Espere só um minutinho que eu estou terminando de arrumar sua sala!! :blush:");
      msg.reply("Pegue a pipoca :popcorn: e acesse '" + msg.guild.name + "' é " + credentials.site + "/?sala=" + msg.guild.id + " \n porque o video já vai começar!");
    } else {
      msg.reply("Coloquei esse video na playlista, agora é só esperar :thumbsup: \n\n :link: O link da sessão é '" + msg.guild.name + "' é " + credentials.site + "/?sala=" + msg.guild.id);
    }
    var idSala = Sala.criarSala(Sala.salas, msg.guild.id);

    var url = new URL(msg.content.split(" ")[1]);
    var idVideo = url.searchParams.get('v');
    setTimeout(async () => {
      await Sala.salas[idSala].adicionarVideo("yYzaEnt0kxs", msg);
      await Sala.salas[idSala].adicionarVideo(idVideo, msg);
    }, 5000);
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