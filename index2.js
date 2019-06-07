var express = require('express');
var app = express();

const port = 3000;
var server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))
var io = require('socket.io')(server);

io.on('connection', function(socket){
    console.log('a user connected');
  });
  
app.get('/', (req, res) => {
   // res.status(500)
    //res.setHeader("Content-Type", "text/html");
    res.sendFile('/home/carlos/Documentos/Projeto Discord/teste.html');
    /*console.log(client.guilds);

    var canais = client.guilds.array();
    var channels = canais;
    console.log(channels);
*/
    //canais.forEach(canal => canais.channels[585497914827210801].send("A"))

})

