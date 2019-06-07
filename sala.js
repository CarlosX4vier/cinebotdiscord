class Sala{

    constructor(id, nome){
        this.id = id;
        this.nome = nome;
        this.playlist = []
        this.tempo = 0
    }

    atualizarTempo(){
        this.tempo++;
    }
}

module.exports = Sala;