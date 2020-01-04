class Sala {

    constructor(id, nome) {
        this.id = id;
        this.nome = nome;
        this.playlist = new Array()
        this.tempo = -2
        this.volume = 100;
    }

    atualizarTempo() {
        this.tempo = this.tempo + 1;
        if (this.tempo >= 0) {
            Sala.io.to(this.id).emit("time", { duracao: this.tempo });
        }
    }


    /**
     * Seta o volume da sala
     * @param {int} valor Volume da sala
     */
    setVolume(valor = this.volume) {
        //console.log(">Volume da sala " + msg.guild.id + " setado para "+valor);
        this.volume = valor;
        Sala.io.to(this.id).emit("volume", { volume: valor });
    }

    static verificarSala(salaTeste) {
        return Sala.salas.findIndex(salaCheck => salaCheck.id == salaTeste);
    }

    /**
     * 
     * @param {*} idSala O id do Discord do canal
     * @returns O index da sala na variavel Sala.salas
     */
    static pegarSala(idSala) {
        return Sala.verificarSala(idSala)
    }

    static criarSala(salas, idSala, nome) {
        const Sala = require('./sala.js')
        var salaUser = new Sala(idSala, nome);

        if (this.verificarSala(idSala) == -1) {
            console.log(">Criação da sala do servidor " + nome)
            salas.push(salaUser);
        }

        return this.pegarSala(idSala);
    }

    static async getYoutubeAPI(idVideo) {
        const Youtube = require('../robots/youtube');

        var r = await Youtube.main(idVideo);
        return r;
    }

    proximoVideo() {
        this.tempo = -2;
        if (this.playlist.length > 1) {
            this.playlist.shift();
            return true
        } else {
            return false
        }
    }

    async adicionarVideo(idVideo, msg) {

        const Video = require('./video');
        var iso = require('iso8601-duration');

        var r = await Sala.getYoutubeAPI(idVideo);

        if (r.items[0] != null) {
            var indexSala = Sala.verificarSala(msg.guild.id);
            setTimeout(() => {
                Sala.salas[indexSala].playlist.push(new Video(idVideo, r.items[0].snippet.title, iso.toSeconds(iso.parse(r.items[0].contentDetails.duration)), msg.author))
            }, 5000);
            return true;
        } else {
            return false;

        }
    }

}

module.exports = Sala;