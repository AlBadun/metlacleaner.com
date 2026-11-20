/* METLA — страница: язык EN / RU (тексты, значки, снимки), сфера (живая или картинка), пятна фона и вкладка в фоне. */
(function () {
  'use strict';

  var NB = ' ';
  var WJ = '⁠'; // соединитель слов (невидимый): строка не рвётся после «-» и «–»
  var PLAY = 'https://play.google.com/store/apps/details?id=com.metla.cleaner&hl=';

  // Слова — только из references/texts.md навыка (реестр фактов и описание Google Play).
  var TEXT = {
    en: {
      title: 'METLA Cleaner — Delete. Rethink. Restore.',
      description: 'METLA Cleaner helps you free up space on your device carefully: deleted files go to Quarantine first, and you can restore them while they’re there.',
      skip: 'Skip to content',
      langGroup: 'Language',
      sloganA: 'Delete. Rethink.',
      sloganB: 'Restore.',
      lead: 'METLA Cleaner helps you free up space on your device carefully: deleted files go to Quarantine first, and you can restore them while they’re there.',
      fact: 'Android' + NB + '8 and newer · English and Russian',
      // строка о России под строкой-фактом — только на русской странице (решение владельца 18.11.2026 в 14:08:57)
      russia: '',
      screensTitle: 'What METLA does',
      shotsLabel: 'Screenshots',
      dot1: 'Screenshot 1',
      dot2: 'Screenshot 2',
      dot3: 'Screenshot 3',
      dot4: 'Screenshot 4',
      shotMonitorT: 'Know before you delete',
      shotMonitorL: 'Monitor shows what is safe to remove and what needs a look',
      shotCleanableT: 'You choose what goes',
      shotCleanableL: 'Open a category and delete only what you pick',
      shotDuplicatesT: 'Only exact copies',
      shotDuplicatesL: 'Byte-' + WJ + 'for-' + WJ + 'byte matches — and the original stays',
      shotQuarantineT: 'Changed your mind?',
      shotQuarantineL: 'Deleted files go to Quarantine first — restore them while they’re there',
      altMonitor: 'METLA Cleaner screenshot: the Monitor screen',
      altCleanable: 'METLA Cleaner screenshot: the “What can be cleaned” screen',
      altDuplicates: 'METLA Cleaner screenshot: the Duplicates screen',
      altQuarantine: 'METLA Cleaner screenshot: the Quarantine screen',
      benefitsTitle: 'Careful cleaning',
      benefit1T: 'Time to rethink',
      benefit1D: 'Quarantine: files are kept for 30' + NB + 'days by default (7, 14 or 30' + NB + 'days free; 60' + NB + 'days or no time limit with Pro).',
      benefit2T: 'Your files stay on your device',
      benefit2D: 'Scanning and cleaning happen on the device. METLA does not share your list of apps with anyone.',
      benefit3T: 'Only exact copies',
      benefit3D: 'Finds exact duplicate files (byte for byte) and keeps one original.',
      benefit4T: 'Honest about what Android allows',
      benefit4D: 'App cache: with usage access, METLA shows how much space it takes and opens the settings where you can clear it (Android does not let one app clear another app’s cache).',
      howTitle: 'How it works',
      step1T: 'Find',
      step1D: 'Shows what can be cleaned, by category: thumbnails, downloads, duplicates, old and large files, empty folders.',
      step2T: 'Delete',
      step2D: 'Open any category to see the files and delete only what you choose. Deleted files go to Quarantine first.',
      step3T: 'Restore',
      step3D: 'Restore files while they’re there. Space is freed when files leave Quarantine.',
      // ролик (макет 20.11.2026, ждёт «да» владельца)
      videoTitle: 'METLA in action',
      videoLabel: 'METLA Cleaner video',
      mottoW1: 'Delete.',
      mottoW2: 'Rethink.',
      mottoW3: 'Restore.',
      plansTitle: 'Free and Pro',
      plansFreeT: 'Free',
      plansF1: '3' + NB + 'cleanups a day',
      plansF2: 'Open any category to see the files and delete only what you choose',
      plansF3: 'Quarantine: files are kept for 7, 14 or 30' + NB + 'days',
      plansF4: 'Anti-Spy shows access; it is not an antivirus',
      plansP1: 'Unlimited cleaning (free plan: 3' + NB + 'cleanups a day)',
      plansP2: 'Delete or restore everything in one tap',
      plansP3: 'Nightly auto-clean',
      plansP4: 'Radar checks every 6' + NB + 'hours: it tells you (Android' + NB + '10 and newer) when an app you restricted runs in the background again, and on Android' + NB + '8–' + WJ + '13 asks Android to stop that app’s background work',
      plansP5: 'Live Device Pulse and longer Quarantine storage',
      plansBuyT: 'Purchase options',
      plansB1: 'A subscription for a month, 3' + NB + 'months or a year, or a one-' + WJ + 'time purchase — for yourself or your family',
      plansB3: 'Google Play shows the price for your country',
      faqTitle: 'Questions and answers',
      q1: 'Is Anti-Spy an antivirus?',
      a1: 'Activity and Anti-Spy: see how much apps run and which apps have been granted or request access to your camera, microphone, location, contacts, phone, SMS and storage — with a direct link to change it in settings. Anti-Spy shows access; it is not an antivirus.',
      q2: 'Why does METLA need All files access?',
      a2: 'On Android' + NB + '11 and newer, METLA needs All files access to find duplicates of any file type, empty folders and old downloads across your storage, and to move deleted files into Quarantine and back. Without it these features don’t start. METLA never opens other apps’ private folders.',
      q3: 'What happens when Quarantine is full?',
      a3: 'Its size is limited (1' + NB + 'GB by default, you can change it): when space runs out, METLA warns you and asks before deleting the oldest files for good.',
      q4: 'When are analytics sent?',
      a4: 'METLA asks for the permissions Android asks you about only when a feature needs them. Analytics and crash reports are sent only after your consent, and you can turn them off in Settings.',
      privacy: 'Privacy Policy',
      q6: 'How does the free trial work?',
      a6: 'The 7-day free trial is available once per Google Play account. If you don’t cancel before it ends, the plan price is charged, and the subscription then renews automatically until you cancel it in Google Play. All payments go through Google Play.',
      q7: 'Does Pro work on my other devices?',
      a7: 'Pro works on every device with the same Google Play account; family members get it by signing in to their METLA account.',
      q8: 'Which devices and languages?',
      a8: 'Works on phones and tablets with Android' + NB + '8 and newer, in English and Russian.',
      q9: 'How do I contact support?',
      a9: 'Questions or ideas? Write to us from the app: Profile → Support.',
      ctaAsk: 'Ready to free up space on your device carefully?',
      cta1: 'Free plan: 3' + NB + 'cleanups a day',
      cta2: 'The 7-day free trial is available once per Google Play account (not' + NB + 'in' + NB + 'Russia)',
      cta3: 'All payments go through Google Play',
      footSupport: 'Support',
      footLegal: 'Legal',
      footSocial: 'Social',
      terms: 'Terms of Use',
      footData: 'This site sets no cookies and runs no analytics. It is hosted on GitHub Pages: GitHub logs and stores each visitor’s IP address for security purposes.',
      socialTelegram: 'METLA Cleaner on Telegram',
      socialX: 'METLA Cleaner on X',
      copyright: '© 2026 Al Badu team. All rights reserved.',
      trademark: 'Google Play and the Google Play logo are trademarks of Google LLC.'
    },
    ru: {
      title: 'METLA Cleaner — Удалил. Передумал. Вернул.',
      description: 'METLA Cleaner помогает бережно освободить место на устройстве: удалённые файлы сначала уходят в Карантин, и их можно вернуть, пока они там.',
      skip: 'Перейти к' + NB + 'содержимому',
      langGroup: 'Язык',
      sloganA: 'Удалил. Передумал.',
      sloganB: 'Вернул.',
      lead: 'METLA Cleaner помогает бережно освободить место на' + NB + 'устройстве: удалённые файлы сначала уходят в' + NB + 'Карантин, и' + NB + 'их можно вернуть, пока они там.',
      fact: 'Android' + NB + '8 и' + NB + 'новее · русский и' + NB + 'английский',
      russia: 'В' + NB + 'России METLA в' + NB + 'Google Play недоступна' + NB + '— готовим версию для' + NB + 'RuStore.',
      screensTitle: 'Что умеет METLA',
      shotsLabel: 'Снимки экрана',
      dot1: 'Снимок 1',
      dot2: 'Снимок 2',
      dot3: 'Снимок 3',
      dot4: 'Снимок 4',
      shotMonitorT: 'Понятно, что удалять',
      shotMonitorL: 'Монитор показывает, что безопасно удалить, а' + NB + 'что' + NB + '— проверить',
      shotCleanableT: 'Решаете вы',
      shotCleanableL: 'Откройте раздел и' + NB + 'удалите только то, что выбрали',
      shotDuplicatesT: 'Только точные копии',
      shotDuplicatesL: 'Совпадают байт в' + NB + 'байт' + NB + '— оригинал остаётся',
      shotQuarantineT: 'Передумали? Верните',
      shotQuarantineL: 'Удалённое сначала уходит в' + NB + 'Карантин' + NB + '— вернуть можно, пока оно там',
      altMonitor: 'Снимок экрана METLA Cleaner: экран «Монитор»',
      altCleanable: 'Снимок экрана METLA Cleaner: экран «Что можно очистить»',
      altDuplicates: 'Снимок экрана METLA Cleaner: экран «Дубликаты»',
      altQuarantine: 'Снимок экрана METLA Cleaner: экран «Карантин»',
      benefitsTitle: 'Бережная очистка',
      benefit1T: 'Время передумать',
      benefit1D: 'Карантин: по' + NB + 'умолчанию файлы хранятся 30' + NB + 'дней (бесплатно' + NB + '— 7, 14 или 30' + NB + 'дней; с' + NB + 'Pro' + NB + '— 60' + NB + 'дней или без' + NB + 'срока).',
      benefit2T: 'Ваши файлы остаются на' + NB + 'устройстве',
      benefit2D: 'Поиск и' + NB + 'очистка идут на' + NB + 'самом устройстве. METLA никому не' + NB + 'передаёт список ваших приложений.',
      benefit3T: 'Только точные копии',
      benefit3D: 'Находит точные копии файлов (байт в' + NB + 'байт) и' + NB + 'оставляет один оригинал.',
      benefit4T: 'Честно о' + NB + 'том, что позволяет Android',
      benefit4D: 'Кэш приложений: с' + NB + 'доступом к' + NB + 'статистике использования METLA показывает, сколько он занимает, и' + NB + 'открывает настройки, где его можно очистить (Android не' + NB + 'даёт одному приложению очищать кэш других).',
      howTitle: 'Как это работает',
      step1T: 'Найдите',
      step1D: 'Показывает, что можно очистить, по' + NB + 'категориям: эскизы, загрузки, дубликаты, старые и' + NB + 'большие файлы, пустые папки.',
      step2T: 'Удалите',
      step2D: 'Откройте категорию' + NB + '— увидите файлы и' + NB + 'удалите только то, что выберете. Удалённые файлы сначала уходят в' + NB + 'Карантин.',
      step3T: 'Верните',
      step3D: 'Файлы можно вернуть, пока они там. Место освобождается, когда файлы покидают Карантин.',
      videoTitle: 'METLA в' + NB + 'деле',
      videoLabel: 'Ролик METLA Cleaner',
      mottoW1: 'Удалил.',
      mottoW2: 'Передумал.',
      mottoW3: 'Вернул.',
      plansTitle: 'Бесплатно и' + NB + 'Pro',
      plansFreeT: 'Бесплатно',
      plansF1: '3' + NB + 'очистки в' + NB + 'день',
      plansF2: 'Откройте категорию' + NB + '— увидите файлы и' + NB + 'удалите только то, что выберете',
      plansF3: 'Карантин: файлы хранятся 7, 14 или 30' + NB + 'дней',
      plansF4: 'Anti-Spy показывает доступы; это не' + NB + 'антивирус',
      plansP1: 'Очистка без' + NB + 'ограничений (бесплатно' + NB + '— 3' + NB + 'очистки в' + NB + 'день)',
      plansP2: 'Удалить или' + NB + 'вернуть всё одним нажатием',
      plansP3: 'Ночная автоочистка',
      plansP4: 'Радар проверяет раз в' + NB + '6' + NB + 'часов: сообщает (на' + NB + 'Android' + NB + '10 и' + NB + 'новее), если приложение, которое вы ограничили, снова работает в' + NB + 'фоне, а' + NB + 'на' + NB + 'Android' + NB + '8–' + WJ + '13 просит Android остановить его фоновую работу',
      plansP5: 'Device Pulse с' + NB + 'обновлением в' + NB + 'реальном времени и' + NB + 'более долгое хранение в' + NB + 'Карантине',
      plansBuyT: 'Варианты покупки',
      plansB1: 'Подписка на' + NB + 'месяц, на' + NB + '3' + NB + 'месяца или на' + NB + 'год либо разовая покупка' + NB + '— для себя или' + NB + 'для семьи',
      plansB3: 'Цену для вашей страны показывает Google Play',
      faqTitle: 'Вопросы и ответы',
      q1: 'Anti-Spy' + NB + '— это антивирус?',
      a1: 'Активность и' + NB + 'Anti-Spy: сколько работают приложения и' + NB + 'каким выдан или' + NB + 'кто просит доступ к' + NB + 'камере, микрофону, местоположению, контактам, телефону, СМС и' + NB + 'памяти' + NB + '— с' + NB + 'переходом в' + NB + 'настройки, чтобы его изменить. Anti-Spy показывает доступы; это не' + NB + 'антивирус.',
      q2: 'Зачем METLA доступ ко' + NB + 'всем файлам?',
      a2: 'На' + NB + 'Android' + NB + '11 и' + NB + 'новее METLA нужен доступ ко' + NB + 'всем файлам, чтобы находить дубликаты файлов любого типа, пустые папки и' + NB + 'старые загрузки во' + NB + 'всей памяти и' + NB + 'переносить удалённые файлы в' + NB + 'Карантин и' + NB + 'обратно. Без' + NB + 'него эти функции не' + NB + 'запускаются. METLA никогда не' + NB + 'открывает личные папки других приложений.',
      q3: 'Что будет, когда Карантин заполнится?',
      a3: 'Объём Карантина ограничен (по' + NB + 'умолчанию 1' + NB + 'ГБ, можно изменить): когда место кончается, METLA предупреждает и' + NB + 'спрашивает, прежде чем удалить самые старые файлы насовсем.',
      q4: 'Когда отправляется аналитика?',
      a4: 'Разрешения, о' + NB + 'которых Android спрашивает вас, METLA просит, когда они нужны функции. Аналитика и' + NB + 'отчёты о' + NB + 'сбоях отправляются только после вашего согласия, их можно выключить в' + NB + 'Настройках.',
      privacy: 'Политика конфиденциальности',
      q6: 'Как работает пробный период?',
      a6: 'Пробный период 7' + NB + 'дней' + NB + '— один раз на' + NB + 'аккаунт Google Play. Если не' + NB + 'отменить его до' + NB + 'конца, спишется цена тарифа, дальше подписка продлевается сама, пока вы не' + NB + 'отмените её в' + NB + 'Google Play. Вся оплата' + NB + '— через Google Play. В' + NB + 'России METLA в' + NB + 'Google Play недоступна' + NB + '— готовим версию для' + NB + 'RuStore.',
      q7: 'Pro работает на' + NB + 'других моих устройствах?',
      a7: 'Pro действует на' + NB + 'всех устройствах с' + NB + 'тем же аккаунтом Google Play; у' + NB + 'участника семьи' + NB + '— через вход в' + NB + 'аккаунт METLA.',
      q8: 'Какие устройства и' + NB + 'языки?',
      a8: 'Работает на' + NB + 'телефонах и' + NB + 'планшетах с' + NB + 'Android' + NB + '8 и' + NB + 'новее, на' + NB + 'русском и' + NB + 'английском.',
      q9: 'Как связаться с' + NB + 'поддержкой?',
      a9: 'Вопросы и' + NB + 'идеи' + NB + '— пишите нам из' + NB + 'приложения: Профиль → Поддержка.',
      ctaAsk: 'Готовы бережно освободить место на' + NB + 'устройстве?',
      cta1: 'Бесплатно' + NB + '— 3' + NB + 'очистки в' + NB + 'день',
      cta2: 'Пробный период 7' + NB + 'дней' + NB + '— один раз на' + NB + 'аккаунт Google Play (кроме' + NB + 'России)',
      cta3: 'Вся оплата' + NB + '— через Google Play',
      footSupport: 'Поддержка',
      footLegal: 'Документы',
      footSocial: 'Соцсети',
      terms: 'Условия использования',
      footData: 'Сайт не' + NB + 'ставит cookie и' + NB + 'не' + NB + 'считает посетителей. Его размещает GitHub Pages: GitHub записывает и' + NB + 'хранит IP-' + WJ + 'адрес каждого посетителя для' + NB + 'безопасности.',
      socialTelegram: 'METLA Cleaner в' + NB + 'Telegram',
      socialX: 'METLA Cleaner в' + NB + 'X',
      copyright: '© 2026 Al Badu team. Все права защищены.',
      trademark: 'Google Play и' + NB + 'логотип Google Play являются товарными знаками Google LLC.'
    }
  };

  // Ссылки наружу — по языку страницы (references/texts.md, «Ссылки»)
  var LINKS = {
    privacy: { en: 'https://albadun.github.io/metla-privacy/en.html', ru: 'https://albadun.github.io/metla-privacy/' },
    terms: { en: 'https://albadun.github.io/metla-privacy/terms/en.html', ru: 'https://albadun.github.io/metla-privacy/terms/' },
    telegram: { en: 'https://t.me/metla_cleaner_en', ru: 'https://t.me/metla_cleaner' }
  };

  var root = document.documentElement;

  function applyLang(lang) {
    var t = TEXT[lang];
    root.lang = lang;
    document.title = t.title;
    document.querySelector('meta[name="description"]').setAttribute('content', t.description);
    // каноническая ссылка — адрес своего языка (её отдаёт «Поделиться» в Chrome на Android)
    document.querySelector('link[rel="canonical"]').href = document.querySelector('link[hreflang="' + lang + '"]').href;
    var nodes = document.querySelectorAll('[data-t]');
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = t[nodes[i].getAttribute('data-t')];
    var labelled = document.querySelectorAll('[data-t-label]');
    for (var k = 0; k < labelled.length; k++) labelled[k].setAttribute('aria-label', t[labelled[k].getAttribute('data-t-label')]);
    var groups = document.querySelectorAll('.lang');
    for (var g = 0; g < groups.length; g++) groups[g].setAttribute('aria-label', t.langGroup);
    // В значке обе картинки; видна и грузится только картинка своего языка (CSS по <html lang>, loading="lazy")
    var badges = document.querySelectorAll('.play-badge');
    for (var b = 0; b < badges.length; b++) badges[b].href = PLAY + lang;
    var links = document.querySelectorAll('[data-link]');
    for (var n = 0; n < links.length; n++) links[n].href = LINKS[links[n].getAttribute('data-link')][lang];
    // Снимки — своего языка; подпись для чтения с экрана — у снимков в ленте (у телефона слева её нет)
    var shots = document.querySelectorAll('img[data-shot]');
    for (var s = 0; s < shots.length; s++) {
      shots[s].src = '/assets/img/screen-' + shots[s].getAttribute('data-shot') + '-' + lang + '.webp';
      if (shots[s].hasAttribute('data-alt')) shots[s].alt = t[shots[s].getAttribute('data-alt')];
    }
    // Ролик — свой файл по языку страницы; грузится только по нажатию (preload="none"), заставка — кадр со знаком METLA.
    // При смене языка — новый элемент вместо load(): после load() Chrome грузит ролик и при preload="none" (замер 20.11.2026)
    var videos = document.querySelectorAll('video[data-video]');
    for (var v = 0; v < videos.length; v++) {
      var file = '/assets/video/metla-' + lang + '.mp4';
      if (videos[v].querySelector('source').getAttribute('src') !== file) {
        var fresh = videos[v].cloneNode(true);
        fresh.querySelector('source').setAttribute('src', file);
        fresh.setAttribute('poster', '/assets/img/video-poster-' + lang + '.webp');
        videos[v].parentNode.replaceChild(fresh, videos[v]);
      }
    }
    var buttons = document.querySelectorAll('.lang button');
    for (var j = 0; j < buttons.length; j++) {
      buttons[j].setAttribute('aria-pressed', String(buttons[j].getAttribute('data-lang') === lang));
    }
  }

  // Язык — по адресу: <html lang> в HTML страницы (/ — английский, /ru/ — русский; tools/make_ru.py)
  var lang = root.lang === 'ru' ? 'ru' : 'en';
  applyLang(lang);
  // Переключатель — без перезагрузки: слова меняются на месте, адрес — на / или /ru/; выбор помнит вкладка
  // (history.state), поэтому корень с выбором EN не уходит на язык браузера (index.html, <head>)
  function onLangClick(e) {
    var b = e.target.closest('button[data-lang]');
    if (!b) return;
    lang = b.getAttribute('data-lang');
    applyLang(lang);
    history.replaceState({ lang: lang }, '', (lang === 'ru' ? '/ru/' : '/') + location.search + location.hash);
  }
  var langGroups = document.querySelectorAll('.lang');
  for (var lg = 0; lg < langGroups.length; lg++) langGroups[lg].addEventListener('click', onLangClick);

  // Сфера: живая — если есть WebGL и не просили «уменьшить движение», иначе неподвижная картинка той же сферы.
  var orb = document.querySelector('.orb');
  if (window.MetlaSphere) window.MetlaSphere.mount(orb);
  else orb.querySelector('img').src = '/assets/img/sphere.webp';

  // Пятна фона стоят, пока вкладка скрыта.
  function onVisibility() { root.classList.toggle('is-hidden', document.hidden); }
  document.addEventListener('visibilitychange', onVisibility);
  onVisibility();
})();
