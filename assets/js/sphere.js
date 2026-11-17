/* METLA — сфера первого экрана. Свой WebGL-шейдер, без библиотек.
   Знак METLA: угловатая M внутри стеклянной сферы, не вращается; по поверхности — широты и меридианы, сфера
   оборачивается вокруг наклонной оси. Вокруг — дуги пульсара и дыхание ореола, как на Мониторе приложения
   (METLA_Cleaner, DashboardScreen.kt — DashboardPulseOrb; OrbBreathing.kt), в темпе сайта.
   Точки Карантина (решение владельца 02.11.2026 в 14:32:43): появляются в глубине сферы, за буквой M, выходят сквозь
   стекло на внешнее кольцо и идут вместе с его бирюзовыми дугами; одна из трёх возвращается в центр. */
(function () {
  'use strict';

  // Угловатая M — снята со значка приложения (METLA_Promo/avatar), в долях радиуса сферы; последняя точка замыкает.
  var M_SHAPE = [
    -0.72, 0.337, -0.443, 0.337, 0.0, -0.10, 0.443, 0.337, 0.72, 0.337,
    0.72, -0.336, 0.432, -0.336, 0.432, 0.016, 0.15, -0.326, -0.15, -0.326,
    -0.432, 0.016, -0.432, -0.336, -0.72, -0.336,
    -0.72, 0.337
  ];

  // Размеры, общие для шейдера и расчёта точек (холст — от −1 до 1)
  var R = 0.60;              // радиус сферы
  var OUTER = 120 / 85;      // кольца дуг в радиусах сферы: 120 и 102,5 dp при сфере 85 dp
  var INNER = 102.5 / 85;

  // Точки Карантина. Раз в 8 с точка выходит из центра сферы — из-за буквы M (3,5 с), сквозь стекло на внешнее кольцо
  // и идёт по нему по часовой вместе с бирюзовыми дугами (оборот 16 с); через 12 с одна из трёх возвращается в центр,
  // за M (3,5 с), две другие тихо гаснут на кольце (2,5 с). На кольце — не больше двух точек. Расписание повторяется
  // каждые 24 с (в ритме 48 с); положение — функция времени: пауза и неподвижный кадр его не сбивают.
  var DOT_GAP = 8, DOT_CYCLE = 24, RISE = 3.5, DWELL = 12, FADE = 2.5, BACK = 3.5;
  var OMEGA = 2 * Math.PI / 16;
  var CENTER_Y = -0.17;      // откуда выходят и куда возвращаются: середина M, в радиусах (точку закрывает буква)
  var DOTS = [
    { lift: [0.10, 0.30], enter: 38, back: true },
    { lift: [-0.12, 0.30], enter: 82 },
    { lift: [0.0, 0.32], enter: 58 }
  ];
  var STILL_DOT = 35;        // неподвижная картинка: одна точка на кольце, угол в градусах

  function f(x) { return x.toFixed(6); }

  var VERT = [
    'attribute vec2 aPos;',
    'varying vec2 vP;',
    'void main() { vP = aPos; gl_Position = vec4(aPos, 0.0, 1.0); }'
  ].join('\n');

  var FRAG = [
    '#extension GL_OES_standard_derivatives : enable',
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#else',
    'precision mediump float;',
    '#endif',
    '',
    'varying vec2 vP;',
    'uniform float uTime;',
    'uniform float uPx;',      // один пиксель экрана в единицах vP
    'uniform float uDpr;',
    'uniform vec2 uM[14];',
    'uniform vec3 uDots[3];',  // точки Карантина: где (единицы vP) и яркость
    '',
    'const float PI = 3.14159265;',
    'const float TAU = 6.28318531;',
    'const float R = ' + f(R) + ';',
    'const float SPIN = 48.0;',       // оборот сферы, с — один ритм с дугами (решение владельца 02.11.2026 в 14:15:35)
    'const float STEP = 0.39269908;', // 22,5° между линиями
    'const float MSCALE = 0.82;',     // размер M в сфере
    'const float OUTER = ' + f(OUTER) + ';',
    'const float INNER = ' + f(INNER) + ';',
    // цвета — только палитра (DESIGN_SYSTEM 3.1)
    'const vec3 AQUA = vec3(0.0, 0.941, 0.784);',     // AquaCore #00F0C8
    'const vec3 AQUAGLOW = vec3(0.4, 1.0, 0.890);',   // AquaGlow #66FFE3 — точки Карантина
    'const vec3 VIOLET = vec3(0.6, 0.4, 0.8);',       // ElectricViolet #9966CC
    'const vec3 WHITE = vec3(0.941, 0.953, 0.980);',  // TextPrimary #F0F3FA
    '',
    'vec4 acc;', // цвет с умноженной прозрачностью
    'void over(vec3 c, float a) { acc.rgb = c * a + acc.rgb * (1.0 - a); acc.a = a + acc.a * (1.0 - a); }',
    'void light(vec3 c, float a) { acc.rgb += c * a; }',
    '',
    // точка сферы в её собственных осях: наклон оси и оборот
    'vec3 toLocal(vec3 n, float spin) {',
    '  float cz = cos(0.40), sz = sin(0.40);',
    '  n = vec3(cz * n.x - sz * n.y, sz * n.x + cz * n.y, n.z);',
    '  float cx = cos(0.30), sx = sin(0.30);',
    '  n = vec3(n.x, cx * n.y + sx * n.z, -sx * n.y + cx * n.z);',
    '  float ca = cos(spin), sa = sin(spin);',
    '  return vec3(ca * n.x + sa * n.z, n.y, -sa * n.x + ca * n.z);',
    '}',
    '',
    // широты и меридианы: a, b — номер линии; da, db — сколько линий на пиксель
    'float grid(float a, float b, float da, float db, float qy) {',
    '  float w = 0.55 * uDpr;',
    '  float la = abs(fract(a + 0.5) - 0.5) / max(da, 1e-4);',
    '  float lb = abs(fract(b + 0.5) - 0.5) / max(db, 1e-4);',
    '  float pa = (1.0 - smoothstep(w, w + 1.0, la)) * (1.0 - smoothstep(0.16, 0.42, da));',
    '  float pb = (1.0 - smoothstep(w, w + 1.0, lb)) * (1.0 - smoothstep(0.16, 0.42, db));',
    '  pb *= 1.0 - smoothstep(0.80, 0.965, abs(qy));',
    '  float eq = (1.0 - smoothstep(w * 1.4, w * 1.4 + 1.0, abs(a) / max(da, 1e-4))) * (1.0 - smoothstep(0.16, 0.42, da));',
    '  return max(max(pa * 0.42, pb * 0.36), eq * 0.8);',
    '}',
    '',
    // расстояние до M со знаком (минус — внутри)
    'float sdM(vec2 p) {',
    '  float d = 1e3; float s = 1.0;',
    '  for (int i = 0; i < 13; i++) {',
    '    vec2 a = uM[i]; vec2 b = uM[i + 1];',
    '    vec2 e = b - a; vec2 w = p - a;',
    '    vec2 h = w - e * clamp(dot(w, e) / dot(e, e), 0.0, 1.0);',
    '    d = min(d, dot(h, h));',
    '    if ((a.y > p.y) != (b.y > p.y) && p.x < e.x * (p.y - a.y) / e.y + a.x) s = -s;',
    '  }',
    '  return s * sqrt(d);',
    '}',
    '',
    // Пара дуг друг напротив друга на радиусе rr (как drawArc в DashboardPulseOrb): c — середина дуги
    // (угол против часовой стрелки), hs — половина дуги, dir — куда идёт вращение (+1 — против часовой).
    // Голова дуги — по ходу вращения, с прозрачностью alpha; к хвосту — тише. Концы круглые, вокруг — свечение
    // той же силы, что на макете 1 (владелец 02.11.2026: «свечение вокруг дуг, у каждой дуги начало ярче конца»).
    // Толщина — в CSS-пикселях на любой ширине (DESIGN_SYSTEM 5.2: толщина линий не пересчитывается).
    'void arcs(vec2 p, float r, float ang, float rr, float c, float hs, float dir, float widthCss, float alpha, vec3 col) {',
    '  float a = mod(ang - c + PI * 0.5, PI) - PI * 0.5;',
    '  float d = abs(r - rr);',
    '  if (abs(a) > hs) {',
    '    float e = ang - a + sign(a) * hs;',
    '    d = length(p - rr * vec2(cos(e), sin(e)));',
    '  }',
    '  float hw = 0.5 * widthCss * uDpr * uPx;',
    '  float line = 1.0 - smoothstep(hw - 0.5 * uPx, hw + 0.5 * uPx, d);',
    '  float head = mix(0.3, 1.0, 0.5 + 0.5 * clamp(a / hs, -1.0, 1.0) * dir);',
    '  light(col, exp(-d / 0.016) * 0.32 * head);',
    '  over(col, line * alpha * head);',
    '}',
    '',
    // точка Карантина: ядро 2 CSS px и мягкое свечение, AquaGlow; без вспышек — яркость меняется только плавно
    'void qdot(vec2 p, vec2 c, float a) {',
    '  float d = length(p - c);',
    '  float rc = 2.0 * uDpr * uPx;',
    '  light(AQUAGLOW, exp(-d / 0.014) * 0.45 * a);',
    '  over(AQUAGLOW, (1.0 - smoothstep(rc - 0.5 * uPx, rc + 0.5 * uPx, d)) * a);',
    '}',
    // доля точки, которая ещё внутри стекла (за буквой M и под передней стенкой)
    'float inside(vec2 c) { return 1.0 - smoothstep(0.9 * R, 1.05 * R, length(c)); }',
    '',
    'void main() {',
    '  acc = vec4(0.0);',
    '  float t = uTime;',
    '  float r = length(vP);',
    '  float ang = atan(vP.y, vP.x);',
    '  float breath = 0.5 - 0.5 * cos(TAU * t / 4.0);',
    '',
    // всё, что требует производных, считается для каждого пикселя — до ветвлений
    '  vec2 s = vP / R;',
    '  float s2 = min(dot(s, s), 1.0);',
    '  float z = sqrt(1.0 - s2);',
    '  vec3 nF = vec3(s, z);',
    '  vec3 nB = vec3(s, -z);',
    '  float spin = TAU * t / SPIN;',
    '  vec3 qF = toLocal(nF, spin);',
    '  vec3 qB = toLocal(nB, spin);',
    '  float aF = asin(clamp(qF.y, -1.0, 1.0)) / STEP;',
    '  float bF = atan(qF.z, qF.x) / STEP;',
    '  float cF = atan(-qF.z, -qF.x) / STEP;',
    '  float aB = asin(clamp(qB.y, -1.0, 1.0)) / STEP;',
    '  float bB = atan(qB.z, qB.x) / STEP;',
    '  float cB = atan(-qB.z, -qB.x) / STEP;',
    '  float daF = fwidth(aF); float dbF = min(fwidth(bF), fwidth(cF));',
    '  float daB = fwidth(aB); float dbB = min(fwidth(bB), fwidth(cB));',
    '',
    // ореол постоянного размера, от 0,96 до 1,22 радиуса; дышит только яркость 0,04 → 0,22 за 4 с (OrbBreathing.kt)
    '  float hf = 1.0 - clamp((r - 0.96 * R) / (0.26 * R), 0.0, 1.0);',
    '  light(AQUA, mix(0.04, 0.22, breath) * hf * hf);',
    '',
    // дуги пульсара (DashboardPulseOrb): внешнее кольцо — бирюзовые 90° по часовой (0,7) и фиолетовые 60° против
    // часовой (0,55), толщина 2,5; внутреннее — бирюзовые против часовой (0,45), толщина 2, и фиолетовые по часовой
    // (0,4), толщина 1,8. Начала дуг: бирюзовых — 30° и 210°, фиолетовых — 120° и 300°. Темп сайта — вдвое медленнее
    // Монитора, один ритм 48 с (решение владельца 02.11.2026 в 14:15:35): бирюзовые внешние и фиолетовые внутренние —
    // оборот 16 с, фиолетовые внешние и бирюзовые внутренние — 12 с; дыхание 4 с — четверть оборота бирюзовых внешних
    '  arcs(vP, r, ang, OUTER * R, -1.30899694 - TAU * t / 16.0, PI / 4.0, -1.0, 2.5, 0.7, AQUA);',
    '  arcs(vP, r, ang, OUTER * R, -2.61799388 + TAU * t / 12.0, PI / 6.0, 1.0, 2.5, 0.55, VIOLET);',
    '  arcs(vP, r, ang, INNER * R, -1.30899694 + TAU * t / 12.0, PI / 4.0, 1.0, 2.0, 0.45, AQUA);',
    '  arcs(vP, r, ang, INNER * R, -2.61799388 - TAU * t / 16.0, PI / 6.0, -1.0, 1.8, 0.4, VIOLET);',
    '',
    '  if (r < R + 3.0 * uPx) {',
    '    float cov = 1.0 - smoothstep(R - uPx, R + uPx, r);',
    '    vec3 L = normalize(vec3(-0.5, 0.62, 0.6));',
    '    float diff = max(dot(nF, L), 0.0);',
    '    float fres = pow(1.0 - z, 2.2);',
    '    float tint = smoothstep(-0.85, 0.9, s.x);',
    '',
    // стекло — как тёмная сфера Монитора: радиальный перелив #0D1F1A → #060D0B → #020808 (DESIGN_SYSTEM 12.2;
    // DashboardScreen.kt), середина сдвинута вверх влево (решение владельца 02.11.2026: «Как в приложении»)
    '    float gt = clamp(length(s - vec2(-0.15, 0.18)) / 0.95, 0.0, 1.0);',
    '    vec3 glass = gt < 0.5 ? mix(vec3(0.051, 0.122, 0.102), vec3(0.024, 0.051, 0.043), gt * 2.0)',
    '                          : mix(vec3(0.024, 0.051, 0.043), vec3(0.008, 0.031, 0.031), gt * 2.0 - 1.0);',
    '    over(glass, 0.92 * cov);',
    '',
    // задняя сторона — сквозь стекло, тише и фиолетовее
    '    light(mix(AQUA, VIOLET, 0.5), grid(aB, bB, daB, dbB, qB.y) * 0.26 * cov);',
    '',
    // точки, пока они внутри стекла, — под буквой M и под передней стенкой
    '    for (int i = 0; i < 3; i++) qdot(vP, uDots[i].xy, uDots[i].z * inside(uDots[i].xy) * cov);',
    '',
    // свет изнутри и M — резкая (сглаживание 1 пиксель), свечение слабое и узкое, заливка — перелив
    // AquaCore → ElectricViolet по ширине самой буквы, как слово METLA (решение владельца 02.11.2026 в 14:32:43)
    '    light(mix(AQUA, VIOLET, tint), 0.10 * exp(-s2 * 3.0) * cov);',
    '    vec2 mp = s / MSCALE;',
    '    float dm = sdM(mp) * MSCALE * R;',
    '    float core = 1.0 - smoothstep(-0.5 * uPx, 0.5 * uPx, dm);',
    '    vec3 mc = mix(AQUA, VIOLET, clamp((mp.x + 0.72) / 1.44, 0.0, 1.0));',
    '    float pulse = 0.9 + 0.1 * breath;',
    '    float g = exp(-max(dm, 0.0) / 0.013) * 0.275 + exp(-max(dm, 0.0) / 0.05) * 0.12;',
    '    light(mc, g * (1.0 - core) * pulse * cov);',
    '    float deep = 1.0 - smoothstep(-0.045, 0.0, dm);',
    '    over(mix(mc, WHITE, (0.10 + 0.36 * deep * deep) / 3.0), core * 0.97 * cov);',
    '    light(WHITE, (1.0 - smoothstep(0.0, 1.4 * uPx, abs(dm + 1.0 * uPx))) * 0.14 * cov);',
    '',
    // передняя сторона, освещённая
    '    float front = grid(aF, bF, daF, dbF, qF.y);',
    '    light(mix(AQUA, VIOLET, tint * 0.6), front * (0.25 + 0.75 * diff + 0.45 * fres) * (1.0 - 0.55 * core) * cov);',
    '',
    // край: аква сверху слева, фиолет снизу справа; блик; отражённый свет
    '    light(mix(AQUA, VIOLET, smoothstep(-0.6, 0.6, (s.x - s.y) * 0.7)), fres * 0.55 * cov);',
    '    float nh = max(dot(nF, normalize(L + vec3(0.0, 0.0, 1.0))), 0.0);',
    '    over(WHITE, pow(nh, 70.0) * 0.8 * cov);',
    '    light(WHITE, pow(nh, 8.0) * 0.05 * cov);',
    '    light(VIOLET, pow(max(dot(nF, normalize(vec3(0.6, -0.7, 0.25))), 0.0), 6.0) * fres * 0.6 * cov);',
    // внутренний отблеск стекла — дуга у края со стороны света
    '    float bub = exp(-abs(sqrt(s2) - 0.86) / 0.012) * smoothstep(0.35, 0.95, dot(s, vec2(-0.62, 0.78)) / max(sqrt(s2), 1e-3));',
    '    light(WHITE, bub * 0.16 * cov);',
    '  }',
    '',
    // точки, вышедшие из стекла, — поверх всего
    '  for (int i = 0; i < 3; i++) qdot(vP, uDots[i].xy, uDots[i].z * (1.0 - inside(uDots[i].xy)));',
    '',
    // лёгкий шум против ступенек в свечении — только там, где что-то нарисовано
    '  acc.rgb += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0 * min(acc.a * 8.0, 1.0);',
    '  acc = clamp(acc, 0.0, 1.0);',
    '  acc.a = max(acc.a, max(acc.r, max(acc.g, acc.b)));',
    '  gl_FragColor = acc;',
    '}'
  ].join('\n');

  function compile(gl, type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      if (window.console) console.warn('METLA sphere: shader', gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;
  }

  function smooth01(x) { x = Math.min(Math.max(x, 0), 1); return x * x * (3 - 2 * x); }

  function bez(a, b, c, d, u) {
    var v = 1 - u;
    return v * v * v * a + 3 * v * v * u * b + 3 * v * u * u * c + u * u * u * d;
  }

  // Точки Карантина на время t: по три числа (x, y, яркость) на точку; oneDot — кадр для неподвижной картинки:
  // одна точка на кольце. Пути — кривые Безье; скорость в конце выхода и в начале возврата равна скорости по кольцу,
  // поэтому точка входит на кольцо и сходит с него без рывка.
  function quarantineDots(t, oneDot, out) {
    var rO = OUTER * R;
    var cy = CENTER_Y * R;
    for (var i = 0; i < out.length; i++) out[i] = 0;
    if (oneDot) {
      var a = STILL_DOT * Math.PI / 180;
      out[0] = rO * Math.cos(a);
      out[1] = rO * Math.sin(a);
      out[2] = 1;
      return;
    }
    for (var j = 0; j < DOTS.length; j++) {
      var dot = DOTS[j];
      var tl = ((t - j * DOT_GAP) % DOT_CYCLE + DOT_CYCLE) % DOT_CYCLE;
      var enter = dot.enter * Math.PI / 180;
      var x, y, alpha, u;
      if (tl < RISE) {
        var ex = rO * Math.cos(enter), ey = rO * Math.sin(enter);
        var k = OMEGA * rO * RISE / 3;
        u = tl / RISE;
        u = u * u * (2 - u);
        x = bez(0, dot.lift[0], ex - k * Math.sin(enter), ex, u);
        y = bez(cy, cy + dot.lift[1], ey + k * Math.cos(enter), ey, u);
        alpha = smooth01(tl / 0.8);
      } else if (tl < RISE + DWELL || (!dot.back && tl < RISE + DWELL + FADE)) {
        var th = enter - OMEGA * (tl - RISE);
        x = rO * Math.cos(th);
        y = rO * Math.sin(th);
        alpha = 1 - smooth01((tl - RISE - DWELL) / FADE);
      } else if (dot.back && tl < RISE + DWELL + BACK) {
        var th2 = enter - OMEGA * DWELL;
        var bx = rO * Math.cos(th2), by = rO * Math.sin(th2);
        var k2 = OMEGA * rO * BACK / 3;
        u = (tl - RISE - DWELL) / BACK;
        u = u + u * u - u * u * u;
        x = bez(bx, bx + k2 * Math.sin(th2), 0, 0, u);
        y = bez(by, by - k2 * Math.cos(th2), cy + 0.3, cy, u);
        alpha = 1 - smooth01((tl - RISE - DWELL - BACK + 0.6) / 0.6);
      } else {
        continue;
      }
      out[j * 3] = x;
      out[j * 3 + 1] = y;
      out[j * 3 + 2] = alpha;
    }
  }

  /* Запускает сферу на холсте. Возвращает управление или null, если WebGL нет — тогда страница показывает
     неподвижную картинку. options: still (номер секунды для одного кадра), oneDot (одна точка на кольце — для
     неподвижной картинки), maxDpr, onLost (WebGL отняли — показать картинку). */
  function start(canvas, options) {
    options = options || {};
    var still = typeof options.still === 'number';
    var gl;
    try {
      gl = canvas.getContext('webgl', {
        alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false,
        preserveDrawingBuffer: still, powerPreference: 'low-power'
      });
    } catch (e) { gl = null; }
    if (!gl || !gl.getExtension('OES_standard_derivatives')) return null;

    var vs = compile(gl, gl.VERTEX_SHADER, VERT);
    var fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    var u = {
      time: gl.getUniformLocation(prog, 'uTime'),
      px: gl.getUniformLocation(prog, 'uPx'),
      dpr: gl.getUniformLocation(prog, 'uDpr'),
      m: gl.getUniformLocation(prog, 'uM'),
      dots: gl.getUniformLocation(prog, 'uDots')
    };
    gl.uniform2fv(u.m, new Float32Array(M_SHAPE));

    var dots = new Float32Array(9);
    var elapsed = still ? options.still : 0;
    var raf = 0, last = 0, onScreen = true, stopped = false;

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, options.maxDpr || 1.75);
      var size = Math.max(1, Math.round(canvas.clientWidth * dpr));
      if (canvas.width !== size || canvas.height !== size) {
        canvas.width = size;
        canvas.height = size;
      }
      gl.viewport(0, 0, size, size);
      gl.uniform1f(u.px, 2 / size);
      gl.uniform1f(u.dpr, dpr);
    }

    function draw() {
      gl.uniform1f(u.time, elapsed);
      quarantineDots(elapsed, !!options.oneDot, dots);
      gl.uniform3fv(u.dots, dots);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    function frame(now) {
      raf = 0;
      if (last) elapsed += Math.min((now - last) / 1000, 0.1);
      last = now;
      draw();
      schedule();
    }

    // кадры — только пока вкладка видна и сфера на экране
    function schedule() {
      if (raf || stopped || still || document.hidden || !onScreen) { last = 0; return; }
      raf = requestAnimationFrame(frame);
    }

    function pause() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
    }

    function onVisibility() { if (document.hidden) pause(); else schedule(); }
    document.addEventListener('visibilitychange', onVisibility);

    var io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (entries) {
        onScreen = entries[entries.length - 1].isIntersecting;
        if (onScreen) schedule(); else pause();
      });
      io.observe(canvas);
    }

    var ro = null;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(function () { resize(); if (!raf) draw(); });
      ro.observe(canvas);
    } else {
      window.addEventListener('resize', resize);
    }

    function onLost(e) {
      e.preventDefault();
      stop();
      if (options.onLost) options.onLost();
    }
    canvas.addEventListener('webglcontextlost', onLost);

    function stop() {
      stopped = true;
      pause();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onLost);
      if (io) io.disconnect();
      if (ro) ro.disconnect();
    }

    resize();
    draw();
    schedule();

    return {
      // замер для проверок: среднее время отрисовки кадра, мс (readPixels дожидается конца работы видеокарты)
      frameCost: function (frames) {
        var px = new Uint8Array(4);
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
        var t0 = performance.now();
        for (var i = 0; i < frames; i++) draw();
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
        return (performance.now() - t0) / frames;
      },
      stop: stop
    };
  }

  /* Сфера в блоке .orb (холст и картинка): живая — если есть WebGL и не просили «уменьшить движение», иначе
     неподвижная картинка той же сферы (tools/make_still.py). */
  function mount(orb) {
    var canvas = orb.querySelector('canvas');
    var img = orb.querySelector('img');
    var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    var live = null;
    // Первый экран знает, что сфера живая (is-orb-live): пятна фона движутся только при ней (site.css, навык B7)
    var hero = orb.parentNode;
    while (hero && !(hero.classList && hero.classList.contains('hero'))) hero = hero.parentNode;

    function setLive(on) {
      if (on) orb.classList.add('is-live'); else orb.classList.remove('is-live');
      if (hero) { if (on) hero.classList.add('is-orb-live'); else hero.classList.remove('is-orb-live'); }
    }

    function showStill() {
      setLive(false);
      img.src = '/assets/img/sphere.webp';
    }

    function run() {
      if (live) { live.stop(); live = null; }
      if (reduce && reduce.matches) { showStill(); return; }
      live = start(canvas, { onLost: function () { live = null; showStill(); } });
      if (live) setLive(true); else showStill();
    }

    run();
    if (reduce) {
      if (reduce.addEventListener) reduce.addEventListener('change', run);
      else if (reduce.addListener) reduce.addListener(run);
    }
  }

  window.MetlaSphere = { start: start, mount: mount };
})();
