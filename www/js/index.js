/**
 * Objeto JavaScript representando a aplicação.
 */
var app = {
    apiKey: '810baa30-cfa2-41b5-a290-7a72db48cd6c', // Chave da API obtida gratuitamente.

    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.start.bind(this), false);
    },

    /**
     * Método que inicializa o aplicativo após o evento de 'deviceready'.
     */
    start: function() {
        console.log('Inicializando o app...');

        let busca = $('#busca');

        $('#busca-botao').click(function () {
            let buscaTexto = busca.val();

            if (buscaTexto.length > 0) {
                this.buscarRacas(buscaTexto);
            } else {
                this.listarRacas();
            }
        }.bind(this));

        this.listarRacas();
    },

    /**
     * Método que recupera da API todos as raças.
     */
    listarRacas: function () {
        let pagina = 1;
        let por_pagina = 10;

        $('#carregando').show(); // Exibindo o elemento de informação de carregamento.

        // Obtendo a lista de raças de felinos:
        fetch(`https://api.thecatapi.com/v1/breeds?page=${pagina}&limit=${por_pagina}`, {
            headers: new Headers([
                ['x-api-key', this.apiKey], // Passando a chave de API no cabeçalho.
            ]),
        })
            .then(resultado => {
                // Coletamos o total de páginas retornado no cabeçalho da API:
                let total_paginas = resultado.headers.get('pagination-count');

                console.log(total_paginas);

                // Utilizando o resultado de retorno no formato JSON:
                resultado.json()
                    .then(dados => {
                        this.tratarResultados(dados);
                    });
            })
            .catch(razao => {
                // Tratando erro na chamada:
                console.warn(razao);
            });
    },

    /**
     * Método que realiza a busca por um termo na API.
     *
     * @param {string} busca
     */
    buscarRacas: function (busca) {
        $('#carregando').show(); // Exibindo o elemento de informação de carregamento.

        // Obtendo a lista de raças de felinos:
        fetch(`https://api.thecatapi.com/v1/breeds/search?q=${busca}`, {
            headers: new Headers([
                ['x-api-key', this.apiKey], // Passando a chave de API no cabeçalho.
            ]),
        })
            .then(resultado => {
                // Utilizando o resultado de retorno no formato JSON:
                resultado.json()
                    .then(dados => {
                        this.tratarResultados(dados);
                    });
            })
            .catch(razao => {
                // Tratando erro na chamada:
                console.warn(razao);
            });
    },

    /**
     * Método para tratamento dos itens retornados pela API.
     *
     * @param {array} dados
     */
    tratarResultados: function (dados) {
        console.log(dados);

        $('#carregando').hide(); // Escondendo o elemento de informação de carregamento.

        $('#lista').html(''); // Limpando a lista antes de inserir novos itens.

        for (let i = 0; i < dados.length; i++) {
            let raca = dados[i];

            // Clonando o elemento de template:
            let cardRaca = $('#template').clone();

            // Definindo o id:
            cardRaca.attr('id', raca.id);

            // Definindo o nome:
            cardRaca.find('.card-title').text(raca.name);

            // Definindo o país de origem:
            cardRaca.find('.card-text').text(raca.origin);

            // Definindo a ação do botão de detalhes:
            cardRaca.find('button').click(this.exibirModal.bind(this, raca));

            // Adicinando o novo elemento a lista:
            cardRaca.appendTo('#lista');
        }
    },

    /**
     * Método que substitui as informações do modal antes de exibir.
     *
     * @param {object} raca
     */
    exibirModal: function (raca) {
        console.log(raca);

        let racaDetalhes = $('#raca-info');

        // Definindo o nome:
        racaDetalhes.find('.modal-title').text(raca.name);

        // Definindo a descrição:
        racaDetalhes.find('.raca-descricao').text(raca.description);

        // Definindo o país de origem:
        racaDetalhes.find('.raca-origem').text(raca.origin);

        // Definindo o temperamento:
        racaDetalhes.find('.raca-temperamento').text(raca.temperament);

        racaDetalhes.modal('show');
    },
};

// Inicializando a aplicação por um método definido:
app.initialize();
