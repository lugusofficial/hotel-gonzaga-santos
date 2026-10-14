// Fotos do apartamento em slides: uma por vez com fade, setas, pontos e contador.
// Troca sozinho a cada 5 s ate a primeira interacao, e pausa com o mouse ou o foco dentro.
// Sem script as fotos aparecem uma embaixo da outra; com movimento reduzido nao troca sozinho.
(function () {
  'use strict';
  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  [].slice.call(document.querySelectorAll('[data-slides]')).forEach(function (raiz) {
    var itens = [].slice.call(raiz.querySelectorAll('.slides__item'));
    if (itens.length < 2) { return; }
    var nav = raiz.querySelector('.slides__nav');
    var contador = raiz.querySelector('.slides__contador');
    var atual = 0, timer = null, parado = false;
    raiz.classList.add('is-live');

    var pontos = itens.map(function (item, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'slides__ponto';
      b.setAttribute('aria-label', 'Foto ' + (i + 1) + ' de ' + itens.length);
      b.addEventListener('click', function () { parar(); ir(i); });
      nav.appendChild(b);
      return b;
    });

    function ir(i) {
      atual = (i + itens.length) % itens.length;
      itens.forEach(function (item, k) {
        var sim = k === atual;
        item.classList.toggle('is-atual', sim);
        item.setAttribute('aria-hidden', sim ? 'false' : 'true');
      });
      pontos.forEach(function (b, k) { b.setAttribute('aria-current', k === atual ? 'true' : 'false'); });
      if (contador) { contador.textContent = (atual + 1) + ' / ' + itens.length; }
    }
    function parar() { parado = true; clearInterval(timer); }
    function rodar() {
      clearInterval(timer);
      if (reduzido || parado) { return; }
      timer = setInterval(function () { ir(atual + 1); }, 5000);
    }

    raiz.querySelector('[data-slides-ant]').addEventListener('click', function () { parar(); ir(atual - 1); });
    raiz.querySelector('[data-slides-prox]').addEventListener('click', function () { parar(); ir(atual + 1); });
    raiz.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { parar(); ir(atual - 1); }
      if (e.key === 'ArrowRight') { parar(); ir(atual + 1); }
    });
    raiz.addEventListener('mouseenter', function () { clearInterval(timer); });
    raiz.addEventListener('mouseleave', rodar);
    raiz.addEventListener('focusin', function () { clearInterval(timer); });

    // Arrastar com o dedo troca a foto.
    var x0 = null;
    raiz.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') { x0 = e.clientX; } });
    raiz.addEventListener('pointerup', function (e) {
      if (x0 === null) { return; }
      var dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) { parar(); ir(atual + (dx < 0 ? 1 : -1)); }
    });

    ir(0);
    rodar();
  });
})();
