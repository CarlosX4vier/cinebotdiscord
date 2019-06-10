var http = require('https');
var credentials = require("../credentials.json");

var conteudo;

class Youtube {

    static async main(video) {
        var t = '';

        var p = new Promise(function (resolve, reject) {
            http.get("https://www.googleapis.com/youtube/v3/videos?part=id,snippet,contentDetails&id="+video+"&key=" + credentials.youtube
                , function (res) {
                    var texto = '';
                    res.on("data", function (body) { texto += body; });
                    res.on("end", function () {
                        t = JSON.parse(texto);
                        resolve(t);
                    });
                });
        });
        return p;
    }
}
module.exports = Youtube;