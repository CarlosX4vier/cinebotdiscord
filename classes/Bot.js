class Bot {

    static nome = "Chessy";
    static version = 0.1;

    static enviarParaTodos(servidores, conteudo) {
        servidores.forEach(
            canal =>
                canal.channels.forEach(
                    a => {
                        if (a.type == 'text') {
                            a.send(conteudo);
                        }
                    }
                )
        );
    }
}