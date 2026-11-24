const NUMERO_WHATSAPP = ''; // Informe o número comercial com DDI e DDD, somente dígitos.
const NOME_NEGOCIO = "Aura Clinic";
const ROTULO_PERFIL = "Objetivo principal";
const CAMPO_PERFIL = "objetivo_tratamento";
const FRASES_BOLHA = ["Agendar avaliação","Consultar horários"];
const palavrasServicos = ["Limpeza de Pele.","Drenagem Linfática.","Massagem Relaxante.","Revitalização Facial."];

function iniciarLinksWhatsapp() {
  const seletor = document.getElementById('porte-veiculo');
  const links = [...document.querySelectorAll('.link-whatsapp')];
  const status = document.getElementById('status-contato');
  if (!seletor || !status) return;

  const numeroConfigurado = /^[1-9]\d{10,14}$/.test(NUMERO_WHATSAPP);
  const perfilSelecionado = () => seletor.querySelector('input:checked')?.value || '';

  function atualizarLinks() {
    if (!numeroConfigurado) return;
    const perfil = perfilSelecionado();

    links.forEach(link => {
      const destino = new URL('https://wa.me/' + NUMERO_WHATSAPP);
      const servico = link.dataset.servico;
      const mensagem = `Olá! Vim pelo site da ${NOME_NEGOCIO} e gostaria de consultar valores e horários para *${servico}*.`;
      const detalhes = perfil ? ` ${ROTULO_PERFIL}: ${perfil}.` : '';
      destino.searchParams.set('text', mensagem + detalhes);
      link.href = destino.href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });
  }

  links.forEach(link => {
    link.addEventListener('click', () => {
      if (!numeroConfigurado) {
        status.textContent = 'O WhatsApp comercial está em configuração.';
        return;
      }

      (window.dataLayer ||= []).push({
        event: 'whatsapp_click',
        servico: link.dataset.servico,
        origem: link.dataset.origem,
        [CAMPO_PERFIL]: perfilSelecionado() || null
      });
    });
  });

  seletor.addEventListener('change', atualizarLinks);
  window.addEventListener('pageshow', atualizarLinks);
  atualizarLinks();
  seletor.hidden = false;
}

const ano = document.getElementById('ano-atual');
if (ano) ano.textContent = new Date().getFullYear();

function iniciarReflexoHero() {
    const palco = document.getElementById('palco-palavra');
    const palavra = document.getElementById('palavra-troca');
    if (!palco || !palavra) return;

    const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
    let indice = 0;

    setInterval(() => {
      if (document.hidden || movimentoReduzido.matches) return;
      palco.classList.add('refletindo');
      setTimeout(() => {
        indice = (indice + 1) % palavrasServicos.length;
        palavra.textContent = palavrasServicos[indice];
      }, 420);
      setTimeout(() => palco.classList.remove('refletindo'), 960);
    }, 3900);
  }

function iniciarCarrossel3D(seletorContainer, seletorCards, tempoMs) {
  const container = document.querySelector(seletorContainer);
  if (!container) return;
  const cards = [...container.querySelectorAll(seletorCards)];
  const total = cards.length;
  if (!total) return;
  let indice = 0;
  let intervalo;
  let toqueInicialX = 0;
  const ponteiro = window.matchMedia('(hover: hover)');

  function atualizar() {
    const esquerda = (indice - 1 + total) % total;
    const direita = (indice + 1) % total;
    cards.forEach((card, i) => {
      card.classList.toggle('centro', i === indice);
      card.classList.toggle('esquerda', i !== indice && i === esquerda);
      card.classList.toggle('direita', i !== indice && i !== esquerda && i === direita);
    });
  }

  function mover(direcao) {
    indice = (indice + direcao + total) % total;
    atualizar();
  }

  function iniciarTimer() {
    clearInterval(intervalo);
    if (total > 1) {
      intervalo = setInterval(() => {
        if (container.matches(':focus-within') || (ponteiro.matches && container.matches(':hover'))) return;
        mover(1);
      }, tempoMs);
    }
  }

  cards.forEach(card => {
    card.addEventListener('click', e => {
      const direcao = card.classList.contains('direita') ? 1 : card.classList.contains('esquerda') ? -1 : 0;
      if (!direcao) return;
      e.preventDefault();
      mover(direcao);
      iniciarTimer();
    });
  });

  container.addEventListener('touchstart', e => {
    clearInterval(intervalo);
    toqueInicialX = e.touches[0].clientX;
  }, { passive: true });

  container.addEventListener('touchend', e => {
    const distancia = toqueInicialX - e.changedTouches[0].clientX;
    if (Math.abs(distancia) > 40) mover(Math.sign(distancia));
    iniciarTimer();
  }, { passive: true });

  container.addEventListener('keydown', e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    mover(e.key === 'ArrowRight' ? 1 : -1);
    iniciarTimer();
  });

  container.addEventListener('touchcancel', iniciarTimer, { passive: true });
  atualizar();
  iniciarTimer();
}

function iniciarComparador() {
  const slider = document.getElementById('slider-comparador');
  const antes = document.getElementById('antes-wrapper');
  const linha = document.getElementById('linha-divisoria');
  const comparador = document.getElementById('comparador');
  const imagem = comparador?.querySelector('.img-antes');
  if (!slider || !antes || !linha || !comparador || !imagem) return;

  function ajustarImagem() {
    imagem.style.width = `${comparador.clientWidth}px`;
  }
  function atualizar() {
    antes.style.width = linha.style.left = `${slider.value}%`;
  }
  slider.addEventListener('input', atualizar);
  window.addEventListener('resize', ajustarImagem);
  window.addEventListener('load', ajustarImagem);
  ajustarImagem();
  atualizar();
}

function iniciarBolhaWhatsapp() {
  const botao = document.querySelector('.whatsapp-inteligente');
  const hero = document.querySelector('.hero');
  const bolha = document.getElementById('frase-bolha-whatsapp');
  if (!botao || !hero || !bolha) return;
  const seletor = document.getElementById('porte-veiculo');
  function atualizarFrase() {
    const perfil = seletor?.querySelector('input:checked');
    bolha.textContent = FRASES_BOLHA[perfil ? 1 : 0];
  }
  atualizarFrase();
  seletor?.addEventListener('change', atualizarFrase);
  const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
  const aberto = { opacity: 1, transform: 'translateY(0) scale(1)' };
  let animacaoBotao;
  let mensagemExibida = false;

  function alternarBotao(mostrar) {
    if (botao.inert === !mostrar) return;
    botao.inert = !mostrar;
    if (typeof botao.animate !== 'function') {
      botao.classList.toggle('visivel', mostrar);
      return;
    }

    const reduzido = movimentoReduzido.matches;
    const fechado = {
      opacity: 0,
      transform: reduzido ? 'scale(.9)' : 'translateY(16px) scale(.55)'
    };
    let inicio = mostrar ? fechado : aberto;
    if (animacaoBotao) {
      const estilo = getComputedStyle(botao);
      inicio = { opacity: estilo.opacity, transform: estilo.transform };
      animacaoBotao.cancel();
    }

    botao.classList.add('visivel');
    const animacao = botao.animate([inicio, mostrar ? aberto : fechado], {
      duration: reduzido ? 240 : mostrar ? 480 : 360,
      easing: mostrar ? 'cubic-bezier(.22, .75, .32, 1)' : 'ease-in',
      fill: 'both'
    });
    animacaoBotao = animacao;
    animacao.onfinish = () => {
      if (animacaoBotao !== animacao) return;
      botao.classList.toggle('visivel', mostrar);
      animacao.cancel();
      animacaoBotao = null;
    };
  }

  function verificarRolagem() {
    const noHero = hero.getBoundingClientRect().bottom > 0;
    alternarBotao(!noHero);
    if (noHero || mensagemExibida) return;

    const alturaDisponivel = document.documentElement.scrollHeight - window.innerHeight;
    if (alturaDisponivel <= 0) return;
    if (window.scrollY / alturaDisponivel < .35) return;
    mensagemExibida = true;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (botao.inert) {
          mensagemExibida = false;
          return;
        }
        bolha.classList.add('visivel');
        setTimeout(() => bolha.classList.remove('visivel'), 9000);
      });
    });
  }

  window.addEventListener('scroll', verificarRolagem, { passive: true });
  window.addEventListener('resize', verificarRolagem);
  window.addEventListener('load', verificarRolagem, { once: true });
  window.addEventListener('pageshow', verificarRolagem);
  verificarRolagem();
}

function iniciarSecaoProfissional() {
  const secao = document.querySelector('.secao-profissional');
  const foto = secao?.querySelector('.profissional-foto img');
  if (!foto || !('IntersectionObserver' in window)) return;

  const limiar = .18;
  let naTela = false;
  let fotoPronta = false;
  secao.classList.add('animacao-rolagem');

  function revelarSecao() {
    secao.classList.toggle('revelado', naTela && fotoPronta);
  }

  const observador = new IntersectionObserver(([entrada]) => {
    if (!entrada.isIntersecting) naTela = false;
    if (entrada.intersectionRatio >= limiar) naTela = true;
    revelarSecao();
  }, { threshold: [0, limiar] });
  observador.observe(secao);

  Promise.resolve(foto.decode?.()).catch(() => {}).then(() => {
    fotoPronta = true;
    revelarSecao();
  });
}

function iniciarAnimacoesRolagem() {
  if (window.CSS?.supports('(animation-timeline: view()) and (animation-range: entry 0% cover 32%)')) return;
  if (!('IntersectionObserver' in window)) return;

  const elementos = document.querySelectorAll('[data-rolagem]');
  document.documentElement.classList.add('sem-timeline');
  const observador = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('revelado');
      observador.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  elementos.forEach(el => observador.observe(el));
}

iniciarLinksWhatsapp();
iniciarReflexoHero();
iniciarCarrossel3D('.carrossel-galeria', '.card-carrossel', 3500);
iniciarCarrossel3D('.carrossel-depoimentos', '.card-whats-carrossel', 12000);
iniciarComparador();
iniciarBolhaWhatsapp();
iniciarSecaoProfissional();
iniciarAnimacoesRolagem();
