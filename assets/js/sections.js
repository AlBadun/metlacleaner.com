/* METLA — разделы ниже первого экрана: шапка, снимки, слоган, появление при прокрутке (docs/SITE_PLAN.md, разделы 3 и 4).
   Следит за прокруткой только IntersectionObserver; двигаются только transform и opacity. */
(function () {
  'use strict';

  if (!('IntersectionObserver' in window)) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Шапка: видна, когда значок первого экрана ушёл вверх; её значок прячется, пока на экране другой значок Google Play
  var bar = document.getElementById('bar');
  var heroBadge = document.querySelector('.hero .play-badge');
  var barBadge = bar.querySelector('.play-badge');
  var others = Array.prototype.filter.call(document.querySelectorAll('.play-badge'), function (b) {
    return b !== heroBadge && !bar.contains(b);
  });
  var heroGone = false;
  var seen = [];

  function paintBar() {
    bar.classList.toggle('is-on', heroGone);
    if (heroGone) bar.removeAttribute('inert');
    else bar.setAttribute('inert', '');
    barBadge.classList.toggle('is-off', seen.length > 0);
  }

  new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { heroGone = !e.isIntersecting && e.boundingClientRect.top < 0; });
    paintBar();
  }).observe(heroBadge);

  if (others.length) {
    var watchOthers = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var i = seen.indexOf(e.target);
        if (e.isIntersecting && i < 0) seen.push(e.target);
        if (!e.isIntersecting && i >= 0) seen.splice(i, 1);
      });
      paintBar();
    });
    others.forEach(function (b) { watchOthers.observe(b); });
  }

  // Снимки: компьютер — глава у середины экрана, телефон и планшет — снимок, больше всех видный в ленте
  var strip = document.getElementById('shots');
  var shots = strip.querySelectorAll('.shot');
  var stage = document.querySelectorAll('.screens__stage img');
  var nums = document.querySelectorAll('.screens__nums li');
  var dots = document.querySelectorAll('.shots__dots button');
  var wide = window.matchMedia('(min-width: 1024px) and (min-height: 700px)');
  var current = 0;

  function setShot(n) {
    if (n === current) return;
    current = n;
    for (var i = 0; i < shots.length; i++) {
      var on = i === n;
      shots[i].classList.toggle('is-on', on);
      stage[i].classList.toggle('is-on', on);
      nums[i].classList.toggle('is-on', on);
      if (on) dots[i].setAttribute('aria-current', 'true');
      else dots[i].removeAttribute('aria-current');
    }
  }

  function indexOf(el) { return Array.prototype.indexOf.call(shots, el.closest('.shot')); }

  var watch = null;
  function watchShots() {
    if (watch) watch.disconnect();
    // остановка Tab — только у ленты, которая листается (телефон, планшет, низкое окно); на компьютере список стоит.
    // Без скриптов ленты нет — снимки стоят сеткой (site.css), поэтому в разметке tabindex нет
    if (wide.matches) strip.removeAttribute('tabindex');
    else strip.setAttribute('tabindex', '0');
    if (wide.matches) {
      // глава сменяется, когда её текст проходит середину экрана — там же середина телефона
      watch = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) setShot(indexOf(e.target)); });
      }, { rootMargin: '-50% 0px -50% 0px' });
      Array.prototype.forEach.call(shots, function (s) { watch.observe(s.querySelector('figcaption')); });
      return;
    } else {
      var ratio = [];
      watch = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { ratio[indexOf(e.target)] = e.intersectionRatio; });
        var best = 0;
        for (var i = 1; i < shots.length; i++) if ((ratio[i] || 0) > (ratio[best] || 0) + 0.01) best = i;
        setShot(best);
      }, { root: strip, threshold: [0, 0.25, 0.5, 0.75, 1] });
    }
    Array.prototype.forEach.call(shots, function (s) { watch.observe(s); });
  }
  watchShots();
  wide.addEventListener('change', watchShots);

  Array.prototype.forEach.call(dots, function (d, i) {
    d.addEventListener('click', function () {
      shots[i].scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
    });
  });

  // Слоган (B11): слова по одному светлеют по прокрутке — у каждого слова своя черта (80 / 65 / 50 % высоты окна);
  // слово выше черты — в полном цвете, ниже — тусклое. Только IntersectionObserver, без обработчика прокрутки.
  var words = document.querySelectorAll('.motto__word');
  function lineOf(i) { return 80 - i * 15; }
  Array.prototype.forEach.call(words, function (word, i) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { word.classList.toggle('is-lit', e.isIntersecting || e.boundingClientRect.top < 0); });
    }, { rootMargin: '0px 0px -' + (100 - lineOf(i)) + '% 0px' }).observe(word);
  });
  // Конец страницы виден — все слова в полном цвете (слово, стоящее низко, до своей черты может не дойти);
  // ушёл из вида — каждое слово снова по своей черте
  var pageEnd = document.querySelector('.page-end');
  if (pageEnd && words.length) {
    new IntersectionObserver(function (entries) {
      var atEnd = entries[0].isIntersecting;
      Array.prototype.forEach.call(words, function (w, i) {
        w.classList.toggle('is-lit', atEnd || w.getBoundingClientRect().top < innerHeight * lineOf(i) / 100);
      });
    }).observe(pageEnd);
  }

  // Появление разделов — один раз
  var reveal = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      reveal.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  Array.prototype.forEach.call(document.querySelectorAll('[data-reveal]'), function (el) { reveal.observe(el); });
})();
