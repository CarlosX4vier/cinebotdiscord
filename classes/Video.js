class Video {
    constructor(id, nome, duracao, autor) {
        this.id = id;
        this.nome = nome;
        this.duracao = duracao;
        this.autor = autor;
        this.comecou = false;
        this.pause = false;
    }
}

module.exports = Video;