var http = require('https');
var HTMLParser = require('node-html-parser');

class Crunchyroll {

    async main(video) {
        var t = '';

        var p = new Promise(function (resolve, reject) {
            http.get(video, function (res) {
                var texto = '';
                res.on("data", function (body) { texto += body; });
                res.on("end", function () {
                    t += texto;
                    console.log("---")
                    console.log(t)
                    resolve(t);
                });
            });
        });
        return p;
    }

    async getIframe(video) {

        var fs = require('fs');
        var html = HTMLParser.parse(await this.main(video));
        console.log(html.querySelector("#showmedia_video_player"));

        fs.writeFile("meuarquivo.html", html.toString(), function (erro) {

            if (erro) {
                throw erro;
            }

            console.log("Arquivo salvo");
        });

    }
}

module.exports = Crunchyroll;