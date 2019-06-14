class Sala {

    constructor(id, nome) {
        this.id = id;
        this.nome = nome;
        this.playlist = new Array()
        this.tempo = 0
        this.volume = 100;
    }

    atualizarTempo() {
        this.tempo++;
        Sala.io.emit("time", { duracao: this.tempo });
    }


    /**
     * Seta o volume da sala
     * @param {int} valor Volume da sala
     */
    setVolume(valor = this.volume) {
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

    static criarSala(salas, idSala) {
        const Sala = require('./sala.js')
        var salaUser = new Sala(idSala, "Sala numero" + idSala);

        if (this.verificarSala(idSala) == -1) {
            salas.push(salaUser);
        }

        return this.pegarSala(idSala);
    }

    async adicionarVideo(idVideo, msg) {

        const Video = require('./video');
        const Youtube = require('../robots/youtube');
        var iso = require('iso8601-duration');

        var r = await Youtube.main(idVideo);
        var indexSala = Sala.verificarSala(msg.guild.id);
        Sala.salas[indexSala].playlist.push(new Video(idVideo, r.items[0].snippet.title, iso.toSeconds(iso.parse(r.items[0].contentDetails.duration)), msg.author))
    }

}

module.exports = Sala;