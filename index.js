const express = require('express');
const app = express();
const port = 80;

let ejs = require('ejs')

const Discord = require('discord.js');
const client = new Discord.Client();
const Sala = require('./classes/sala.js');
var credentials = require('./credentials');
var path = require('path')

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs')
app.set('views', './view');

var server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))
var io = require('socket.io', { rememberTransport: false })(server);


//Seta valores
Sala.salas = [];
Sala.io = io;

setInterval(() => {
  Sala.salas.forEach((element, i) => {

    if (element.playlist.length >= 1) {

      if (element.playlist[0].comecou == false) {
        element.tempo = -2;
        element.playlist[0].comecou = true;
      } else if (element.tempo >= element.playlist[0].duracao) {
        element.playlist.shift();
        return;
      }

      if (element.tempo == -2) {
        io.to(element.id).emit("video", { video: Sala.salas[i].playlist[0].id });
        io.to(Sala.salas[i].id).emit("volume", { volume: Sala.salas[i].volume });
        element.setVolume();
      }

      if (element.tempo < element.playlist[0].duracao) {
      //  console.log(element.tempo)
        element.atualizarTempo();
      }
    }
  });
}, 1000);



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
  var msg = "Ol\u00E1, eu sou a **Jessy**, a organizadora do **Cine Discord** e eu j\u00E1 estou pronta para come\u00E7ar:\r\n\r\n"
  +"`COMANDOS` \r\n:arrow_right: **!assistir** *link do YouTube* - Para come\u00E7ar a sess\u00E3o de videos " 
  +"\r\n:arrow_right: **!assistir** *link do YouTube* - Para come\u00E7ar a sess\u00E3o de videos"
  +"\r\n:arrow_right: **!volume** *(0-100)* - Para alterar o volume da sala"
  +"\r\n:arrow_right:  **!doar** - Para saber como colaborar com o projeto. "
  +"\r\n\r\n :star: E AI?! Vamos come\u00E7ar?!";
  channel.send(msg);
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});



client.login('MzkyOTAzMTcwNTQ1ODExNDU3.XPaWwQ.J0SA8eN3y8mGEblnA6jiPB39o3U');


client.on('message', async (msg) => {
  var acao = msg.content.split(" ");
  Salaid = Sala.verificarSala(msg.guild.id);

  if (acao[0] == "!assistir") {

    if (Sala.verificarSala(msg.guild.id) == -1) {
      msg.reply("Espere só um minutinho que eu estou terminando de arrumar sua sala!! :blush:");
      Sala.criarSala(Sala.salas, msg.guild.id, msg.guild.name);
      Salaid = Sala.verificarSala(msg.guild.id);

    }
    var url = new URL(msg.content.split(" ")[1]);
    var idVideo = url.searchParams.get('v');

    /* client.user.setPresence({
       game: {
         name: "Organizando sessão de  " + Sala.salas[Salaid].nome,
         url: credentials.site + "/?sala=" + msg.guild.id
       }
     });*/
    client.user.setActivity('Sessão de ' + msg.guild.name, { type: 'WATCHING' })

      await Sala.salas[Salaid].adicionarVideo("yYzaEnt0kxs", msg);
      result = await Sala.salas[Salaid].adicionarVideo(idVideo, msg);
      if (result) {
        if (Sala.salas[Salaid].playlist.length == 0) {
          msg.reply("Pegue a pipoca :popcorn: e acesse '" + msg.guild.name + "' é " + credentials.site + "/?sala=" + msg.guild.id + " \n porque o video já vai começar!");
        } else {
          msg.reply("Coloquei esse video na playlist, agora é só esperar :thumbsup: \n\n :link: O link da sessão é '" + msg.guild.name + "' é " + credentials.site + "/?sala=" + msg.guild.id);
        }
      }else{
        msg.reply("Esse video não existe :cold_sweat: \n\n Tenta outro!!")
      }
   

  } else if (acao[0] == "!volume") {
    console.log("Sala: " + msg.guild.id + " | Index" + Salaid);
    Sala.salas[Salaid].setVolume(acao[1]);
  }
});


app.get('/room', (req, res) => {

  res.render("index", { teste: "AAA", site: credentials.host });

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
    index = Sala.verificarSala(salaID);
    if (index != -1) {
      sala = Sala.salas[index]
      if (sala != -1 && sala.playlist.length > 0) {
        socket.emit("video", { video: sala.playlist[0].id });
        socket.emit("volume", { volume: sala.volume });
      }
    }
  });

});
