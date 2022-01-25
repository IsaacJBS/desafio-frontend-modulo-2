const body = document.querySelector('body');
const trocarTemaBtn = document.querySelector('.btn-theme');
const titulo = document.querySelector('h1');

const inputPesquisar = document.querySelector('.input');

const setaEsqPreta = document.querySelector('.btn-prev');
const setaDirPreta = document.querySelector('.btn-next');
const carrossel = document.querySelector('.movies');

const videoDoHighlight = document.querySelector('.highlight__video');
const tituloDoHighlight = document.querySelector('.highlight__title');
const ratingDoHighlight = document.querySelector('.highlight__rating');
const generoDoHighlight = document.querySelector('.highlight__genres');
const descricaoDoHighlight = document.querySelector('.highlight__description');
const linkDoHighlight = document.querySelector('.highlight__video-link');
const launchDoHighlight = document.querySelector('.highlight__launch');

const modal = document.querySelector('.modal');
const fecharModal = document.querySelector('.modal__close');
const tituloModal = document.querySelector('.modal__title');
const imagemModal = document.querySelector('.modal__img');
const generosModal = document.querySelector('.modal__genres')
const descricaoModal = document.querySelector('.modal__description');
const mediaModal = document.querySelector('.modal__average');

let filmesAtuais = [];
let paginaAtual = 0;

function animacaoTitulo (elemento) {
    const tituloArray = elemento.innerHTML.split('');
    elemento.innerHTML = '';

    tituloArray.forEach((letra, i) => {
        setTimeout(() => elemento.innerHTML += letra, i * 75);
    });
};

window.addEventListener('focus', () => animacaoTitulo(titulo));

function animacaoScroll() {
    const secao = document.querySelectorAll('.js-scroll');

    if(secao.length) {
        const windowMetade = window.innerHeight * 0.6;
    
        function animaScroll () {
        secao.forEach(section => {
            const secaoTop = section.getBoundingClientRect().top;
            const sectionVisivel = (secaoTop - windowMetade) < 0;
                if  (sectionVisivel) {
                    section.classList.add('ativo');
                } else {
                    section.classList.remove('ativo');
                }
            });
        };
    
        animaScroll();
            
        window.addEventListener('scroll', animaScroll)
    };
}

animacaoScroll();

inputPesquisar.addEventListener('keydown', event => {
    if (event.key !== 'Enter') {
        return;
    }

    paginaAtual = 0;

    if (inputPesquisar.value) {
        pesquisarFilmes(inputPesquisar.value);
    } else {
        carregarFilme();
    }
    inputPesquisar.value = '';
});

function pesquisarFilmes (pesquisa) {
    const respostaPromessa = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${pesquisa}`);

    respostaPromessa.then( resposta => {
        const promiseFetchPesquisa = resposta.json();

        promiseFetchPesquisa.then( body => {
            filmesAtuais = body.results;
            carrosselFilmes();
        });
    });
};


setaEsqPreta.addEventListener('click', () => {
    if(paginaAtual === 0) {
        paginaAtual  = 3;
    } else {
        paginaAtual--;
    };
    carrosselFilmes();
});

setaDirPreta.addEventListener('click', () => {
    if(paginaAtual === 3) {
        paginaAtual  = 0;
    } else {
        paginaAtual++;
    };
    carrosselFilmes();
});

function carregarFilme () {
    const respostaPromessa = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false');

    respostaPromessa.then(resposta => {
        const promiseFetchFilme = resposta.json();
        
        promiseFetchFilme.then( body => {
            filmesAtuais = body.results;
            carrosselFilmes();
        });
    });
};

function carrosselFilmes () {
    carrossel.textContent = '';

    for (let index = paginaAtual * 5; index < (paginaAtual + 1) * 5; index++) {
        const filme = filmesAtuais[index];

        const filmeDiv = document.createElement('div');
        filmeDiv.classList.add('movie');
        filmeDiv.style.backgroundImage = `url(${filme.poster_path})`;

        filmeDiv.addEventListener('click', () => {
            abrirModal(filme.id);
        });

        const filmeInfo = document.createElement('div');
        filmeInfo.classList.add('movie__info');

        const titulo = document.createElement('span');
        titulo.classList.add('movie__title');
        titulo.textContent = filme.title;

        const filmeRating = document.createElement('span');
        filmeRating.classList.add('movie__rating');

        const estrela = document.createElement('img');
        estrela.src = './assets/estrela.svg';
        
        filmeRating.append(estrela, filme.vote_average);
        filmeInfo.append(titulo, filmeRating);
        filmeDiv.append(filmeInfo);

        carrossel.append(filmeDiv);
    };
};
carregarFilme();

modal.addEventListener('click', modalFechado);
fecharModal.addEventListener('click', modalFechado);

function modalFechado () {
    modal.classList.add('hidden');
};

function abrirModal(param) {
    modal.classList.remove('hidden');
    const respostaPromessa = fetch (`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${param}?language=pt-BR`);

    respostaPromessa.then( resposta => {
        const promiseFetchModal = resposta.json();

        promiseFetchModal.then( body => {
            tituloModal.textContent = body.title;
            imagemModal.src = body.backdrop_path;
            descricaoModal.textContent = body.overview;
            mediaModal.textContent = body.vote_average;

            generosModal.textContent = '';
            body.genres.forEach( genero => {
                const generoModal = document.createElement('span');
                generoModal.textContent = genero.name;
                generoModal.classList.add('modal__genre');
        
                generosModal.append(generoModal);
            });
        });
    });
};

function teste () {
    const respostaPromessa = fetch ('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false');

    respostaPromessa.then( resposta => {
        const promiseFetchHighlight = resposta.json();

        promiseFetchHighlight.then( body => {
            console.log(body)
        });
    });
};
teste();

function highlightDoDia () {
    const respostaPromessa = fetch ('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/524434?language=pt-BR');

    respostaPromessa.then( resposta => {
        const promiseFetchHighlight = resposta.json();

        promiseFetchHighlight.then( body => {
            console.log(body)
            tituloDoHighlight.textContent = body.title;
            ratingDoHighlight.textContent = body.vote_average;
            videoDoHighlight.style.backgroundImage = `url(${body.backdrop_path})`;
            videoDoHighlight.style.backgroundSize = 'cover';
            generoDoHighlight.textContent = `${body.genres[0].name}, ${body.genres[1].name}, ${body.genres[2].name} - `;
            launchDoHighlight.textContent = new Date(body.release_date).toLocaleDateString();
            descricaoDoHighlight.textContent = body.overview;
        });
    });
};
highlightDoDia();

videoDoHighlight.addEventListener('click', () => assistirTrailer);

function assistirTrailer () {
    const respostaPromessa = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/580489/videos?language=pt-BR');
    
    respostaPromessa.then( resposta => {
        const promiseFetchFilme = resposta.json();
        promiseFetchFilme.then( body =>{
            linkDoHighlight.href = `https://www.youtube.com/watch?v=${body.results[1].key}`;
        });
    });
};
assistirTrailer();

const temaPersistido = localStorage.getItem('theme');
let temaAtual = temaPersistido ? temaPersistido : 'light';

function temaPadrao () {
    temaAtual = 'light';
    trocarTemaBtn.src = './assets/light-mode.svg';
    setaEsqPreta.src = './assets/seta-esquerda-preta.svg';
    setaDirPreta.src = './assets/seta-direita-preta.svg';

    body.style.setProperty('--background-color', "#FFF");
    body.style.setProperty('--color', "#000");
    body.style.setProperty('--input-background-color', "#979797");
    body.style.setProperty('--highlight-background', "#FFF");
    body.style.setProperty('--highlight-color', "rgba(0, 0, 0, 0.7)");
    body.style.setProperty('--highlight-description', "#000");
};

function temaEscuro () {
    temaAtual = 'dark';
    trocarTemaBtn.src = './assets/dark-mode.svg'
    setaEsqPreta.src = './assets/seta-esquerda-branca.svg';
    setaDirPreta.src = './assets/seta-direita-branca.svg';

    body.style.setProperty('--background-color', "#242424");
    body.style.setProperty('--color', "#FFF");
    body.style.setProperty('--input-background-color', "#FFF");
    body.style.setProperty('--shadow-color', "0px 4px 8px rgba(255, 255, 255, 0.15)");
    body.style.setProperty('--highlight-background', "#454545");
    body.style.setProperty('--highlight-color', "rgba(255, 255, 255, 0.7)");
    body.style.setProperty('--highlight-description', "#FFF");
};

function trocarTema () {
    if (temaAtual === 'light') {
        temaEscuro();
    } else {
        temaPadrao();
    }

    localStorage.setItem('theme', temaAtual);
}

if (temaAtual === 'light') {
    temaPadrao();
} else {
    temaEscuro();
}

trocarTemaBtn.addEventListener('click', () => trocarTema());
