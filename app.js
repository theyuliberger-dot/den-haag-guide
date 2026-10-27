// ---------- state ----------
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
let lang = store.get('lang', 'he');
let saved = new Set(store.get('saved', []));
let bought = new Set(store.get('bought', []));
let weather = null, weatherErr = false;
const filters = { season: [4, 5, 6, 7, 8].includes(new Date().getMonth()) ? 'summer' : 'winter' };

const T = o => (o && typeof o === 'object' ? o[lang] : o);
const UI = {
  home: L(`דף הבית`, `Home`), calendar: L(`לוח שנה`, `Calendar`), saved: L(`שמורים`, `Saved`),
  main: L(`ראשי`, `Main`), cats: L(`קטגוריות`, `Categories`),
  ish: L(`בית הספר ISH`, `ISH school`), holidays: L(`חגים ומנהגים`, `Holidays and customs`),
  animals: L(`חיות`, `Animals`), weatherNav: L(`מזג אוויר וזמנים`, `Weather and times`),
  weekend: L(`סופי שבוע וחופשות`, `Weekends and holidays`), season: L(`פעילויות חורף וקיץ`, `Winter and summer`),
  fWinter: L(`חורף`, `Winter`), fSummer: L(`קיץ`, `Summer`), abroad: L(`טיולים לחו"ל`, `Trips abroad`),
  hike: L(`מסלולי הליכה`, `Hiking`), climb: L(`טיפוס ובולדרינג`, `Climbing`), ballet: L(`בלט קלאסי`, `Classical ballet`),
  appName: L(`המדריך לברגרים בהאג`, `The Bergers' Hague Guide`), family: L(`משפחת ברגר`, `The Berger family`),
  city: L(`דן האג, הולנד`, `The Hague, Netherlands`), langBtn: L(`English`, `עברית`),
  morning: L(`בוקר טוב`, `Good morning`), noon: L(`צהריים טובים`, `Good afternoon`), evening: L(`ערב טוב`, `Good evening`),
  sub: L(`מה קורה היום בהאג`, `What's happening in The Hague today`),
  wNow: L(`מזג אוויר עכשיו`, `Weather now`), sun: L(`זריחה · שקיעה`, `Sunrise · sunset`),
  nextIsh: L(`יום חופש הבא ב-ISH`, `Next ISH day off`), nextNl: L(`החג ההולנדי הבא`, `Next Dutch holiday`),
  days: L(`ימים`, `days`), today: L(`היום`, `Today`), tomorrow: L(`מחר`, `Tomorrow`), inDays: L(`בעוד`, `In`),
  dayLen: L(`אורך היום`, `Day length`), h: L(`ש'`, `h`), mn: L(`ד'`, `m`),
  wkSug: L(`הצעות לסוף השבוע`, `Weekend ideas`), upcoming: L(`בקרוב`, `Coming up`),
  dry: L(`יבש`, `Dry`), wet: L(`גשום`, `Rainy`), breakIdea: L(`רעיון לחופשה הבאה`, `Idea for the next break`),
  loading: L(`טוען…`, `Loading…`), wFail: L(`אין חיבור למזג האוויר כרגע`, `Weather is unavailable right now`),
  rainAfter: L(`גשם מ-`, `Rain from `), noRain: L(`לא צפוי גשם היום`, `No rain expected today`), wind: L(`רוח`, `Wind`), kmh: L(`קמ"ש`, `km/h`),
  feels: L(`מרגיש כמו`, `Feels like`),
  map: L(`מפה`, `Map`), site: L(`אתר`, `Website`), wiki: L(`ויקיפדיה`, `Wikipedia`), save: L(`שמירה`, `Save`),
  all: L(`הכל`, `All`), all_ish: L(`ISH`, `ISH`), nl: L(`חגים הולנדיים`, `Dutch holidays`),
  p: L(`יסודי`, `Primary`), s: L(`תיכון`, `Secondary`), b: L(`כל בית הספר`, `Whole school`), noSchool: L(`אין לימודים`, `No school`),
  emptySaved: L(`עוד לא שמרתם מקומות. לחצו על הלב בכרטיס של מקום כדי לשמור אותו כאן.`, `Nothing saved yet. Tap the heart on a place card to keep it here.`),
  forecast: L(`תחזית ל-7 ימים`, `7-day forecast`), sunTimes: L(`זריחה ושקיעה השבוע`, `Sunrise and sunset this week`),
  yearLight: L(`אור יום לאורך השנה`, `Daylight through the year`),
  danger: L(`מסוכנות`, `Dangerous`), common: L(`נפוצות`, `Common`), cool: L(`מגניבות`, `Cool`), season: L(`מתי`, `When`),
  photo: L(`תמונה: ויקיפדיה`, `Photo: Wikipedia`),
  fCity: L(`בהאג`, `In The Hague`), fNl: L(`טיולי יום בהולנד`, `Day trips in NL`), fIn: L(`בפנים (גשם)`, `Indoor (rain)`), fOut: L(`בחוץ`, `Outdoor`), fFree: L(`חינם`, `Free`),
  fShort: L(`עד שעתיים`, `Up to 2h`), fMid: L(`2–3.5 שעות`, `2–3.5h`), fLong: L(`סוף שבוע ארוך`, `Long weekend`),
  fNlh: L(`בהולנד`, `Netherlands`), fAbh: L(`בחו"ל`, `Abroad`), fEasy: L(`קל`, `Easy`), fMidH: L(`בינוני`, `Moderate`), fHard: L(`עליות`, `Hilly`),
  fRope: L(`חבל והובלה`, `Rope and lead`), fBoulder: L(`בולדרינג`, `Bouldering`), fKids: L(`שיעורים לנוער`, `Youth lessons`),
  fLearn: L(`ללמוד`, `Learn`), fWatch: L(`לצפות`, `Watch`),
  basics: L(`מושגים`, `The basics`), ishInfo: L(`פרטים`, `Details`), ishDates: L(`תאריכים חשובים`, `Key dates`),
  addr: L(`כתובת`, `Address`), web: L(`אתר`, `Website`), campus: L(`קמפוס משותף ליסודי ולתיכון`, `Shared campus for Primary and Secondary`),
  nextBreak: L(`החופשה הבאה`, `Next break`), firstLast: L(`יום אחרון ללימודים`, `Last school day`),
  refresh: L(`רענון`, `Refresh`), updated: L(`עודכן`, `Updated`),
  toBuy: L(`מה צריך לקנות ולסדר`, `What to buy and arrange`), done: L(`בוצע`, `done`), familyTag: L(`משפחה`, `Family`),
  contacts: L(`טלפונים ומיילים`, `Phones and emails`), call: L(`חיוג`, `Call`), apps: L(`אפליקציות ומערכות`, `Apps and systems`),
  rules: L(`כללים חשובים`, `Important rules`), afterSchool: L(`אחרי הלימודים וספורט`, `After school and sport`),
  recSport: L(`ספורט פנאי ומתקנים – תיכון`, `Recreational sport and facilities – Secondary`), trips: L(`טיולים ומשלחות`, `Trips and expeditions`),
  why: L(`למה?`, `Why?`), whatDo: L(`מה עושים?`, `What do people do?`),
  offDays: L(`ימי חופש רשמיים`, `Official days off`), traditions: L(`מסורות ומנהגים`, `Traditions and customs`),
  offYes: L(`יום חופש רשמי`, `Official day off`), offSome: L(`חופש רק לחלק מהאנשים`, `Day off for some people only`),
  srcGuide: L(`מקור: מדריך בית הספר ISH 2026/27`, `Source: ISH School Guide 2026/27`),
  pageSub: {
    calendar: L(`ISH ו-חגים הולנדיים במקום אחד`, `ISH and Dutch holidays in one place`),
    ish: L(`International School of The Hague · שנת 2026/27`, `International School of The Hague · 2026/27`),
    holidays: L(`החגים והמנהגים שכדאי להכיר`, `The holidays and customs worth knowing`),
    animals: L(`מה פוגשים בהאג ובהולנד`, `What you'll meet in The Hague and the Netherlands`),
    weather: L(`נתונים חיים להאג`, `Live data for The Hague`),
    weekend: L(`בהאג ובטיולי יום בהולנד`, `In The Hague and day trips in the Netherlands`),
    season: L(`מה עושים בחורף ומה בקיץ`, `What to do in winter and in summer`),
    abroad: L(`בלגיה, גרמניה, לוקסמבורג, צרפת ואנגליה`, `Belgium, Germany, Luxembourg, France and England`),
    hike: L(`דיונות, יערות וגבעות – בהולנד ומעבר לגבול`, `Dunes, forests and hills – in NL and across the border`),
    climb: L(`בולדרינג, חבל והובלה בהאג ובסביבה`, `Bouldering, rope and lead in and around The Hague`),
    ballet: L(`ללמוד ולצפות בבלט קלאסי`, `Learn and watch classical ballet`),
    saved: L(`המקומות ששמרתם`, `The places you saved`),
  },
};

const NAV = [
  { r: 'home', ic: 'layout-dashboard', k: 'home', sec: 'main' },
  { r: 'calendar', ic: 'calendar-days', k: 'calendar', c: 'sky', sec: 'main' },
  { r: 'saved', ic: 'heart', k: 'saved', c: 'pink', sec: 'main' },
  { r: 'ish', ic: 'graduation-cap', k: 'ish', c: 'blue', sec: 'cats' },
  { r: 'holidays', ic: 'party-popper', k: 'holidays', c: 'orange', sec: 'cats' },
  { r: 'animals', ic: 'paw-print', k: 'animals', c: 'lime', sec: 'cats' },
  { r: 'weather', ic: 'cloud-sun', k: 'weatherNav', c: 'sky', sec: 'cats' },
  { r: 'weekend', ic: 'ferris-wheel', k: 'weekend', c: 'violet', sec: 'cats' },
  { r: 'season', ic: 'sun-snow', k: 'season', c: 'blue', sec: 'cats' },
  { r: 'abroad', ic: 'plane', k: 'abroad', c: 'amber', sec: 'cats' },
  { r: 'hike', ic: 'footprints', k: 'hike', c: 'teal', sec: 'cats' },
  { r: 'climb', ic: 'mountain', k: 'climb', c: 'orange', sec: 'cats' },
  { r: 'ballet', ic: 'sparkles', k: 'ballet', c: 'pink', sec: 'cats' },
];

const PAGE_FILTERS = {
  weekend: [['all', 'all'], ['city', 'fCity'], ['nl', 'fNl'], ['in', 'fIn'], ['out', 'fOut'], ['free', 'fFree']],
  season: [['winter', 'fWinter'], ['summer', 'fSummer'], ['in', 'fIn'], ['free', 'fFree']],
  abroad: [['all', 'all'], ['short', 'fShort'], ['mid', 'fMid'], ['long', 'fLong']],
  hike: [['all', 'all'], ['nlh', 'fNlh'], ['abh', 'fAbh'], ['easy', 'fEasy'], ['mid', 'fMidH'], ['hard', 'fHard']],
  climb: [['all', 'all'], ['rope', 'fRope'], ['boulder', 'fBoulder'], ['kids', 'fKids']],
  ballet: [['all', 'all'], ['learn', 'fLearn'], ['watch', 'fWatch']],
  calendar: [['all', 'all'], ['ish', 'all_ish'], ['nl', 'nl']],
  holidays: [['all', 'all'], ['off', 'offDays'], ['trad', 'traditions']],
  ish: [['all', 'all'], ['p', 'p'], ['s', 's']],
  animals: [['all', 'all'], ['danger', 'danger'], ['common', 'common'], ['cool', 'cool']],
};

// ---------- dates ----------
const pad = n => String(n).padStart(2, '0');
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const todayIso = () => iso(new Date());
const diffDays = s => Math.round((parse(s) - parse(todayIso())) / 864e5);
const loc = () => (lang === 'he' ? 'he-IL' : 'en-GB');
const fmt = (s, o = { day: 'numeric', month: 'long' }) => new Intl.DateTimeFormat(loc(), o).format(parse(s));
const fmtRange = ev => ev.e ? `${fmt(ev.d, { day: 'numeric', month: 'short' })} – ${fmt(ev.e, { day: 'numeric', month: 'short' })}` : fmt(ev.d, { weekday: 'short', day: 'numeric', month: 'short' });
const when = s => { const n = diffDays(s); return n <= 0 ? T(UI.today) : n === 1 ? T(UI.tomorrow) : `${T(UI.inDays)} ${n} ${T(UI.days)}`; };
const upcomingEvents = () => EVENTS.filter(e => (e.e || e.d) >= todayIso()).sort((a, b) => a.d.localeCompare(b.d));

// ---------- weather ----------
const WCODE = {
  0: ['sun', L(`בהיר`, `Clear`)], 1: ['cloud-sun', L(`בהיר ברובו`, `Mostly clear`)], 2: ['cloud-sun', L(`מעונן חלקית`, `Partly cloudy`)],
  3: ['cloud', L(`מעונן`, `Overcast`)], 45: ['cloud-fog', L(`ערפל`, `Fog`)], 48: ['cloud-fog', L(`ערפל קפוא`, `Freezing fog`)],
  51: ['cloud-drizzle', L(`טפטוף קל`, `Light drizzle`)], 53: ['cloud-drizzle', L(`טפטוף`, `Drizzle`)], 55: ['cloud-drizzle', L(`טפטוף חזק`, `Heavy drizzle`)],
  61: ['cloud-rain', L(`גשם קל`, `Light rain`)], 63: ['cloud-rain', L(`גשם`, `Rain`)], 65: ['cloud-rain', L(`גשם חזק`, `Heavy rain`)],
  66: ['cloud-hail', L(`גשם קופא`, `Freezing rain`)], 67: ['cloud-hail', L(`גשם קופא`, `Freezing rain`)],
  71: ['snowflake', L(`שלג קל`, `Light snow`)], 73: ['snowflake', L(`שלג`, `Snow`)], 75: ['snowflake', L(`שלג כבד`, `Heavy snow`)], 77: ['snowflake', L(`פתיתי שלג`, `Snow grains`)],
  80: ['cloud-rain', L(`ממטרים`, `Showers`)], 81: ['cloud-rain', L(`ממטרים`, `Showers`)], 82: ['cloud-rain', L(`ממטרים חזקים`, `Heavy showers`)],
  85: ['snowflake', L(`ממטרי שלג`, `Snow showers`)], 86: ['snowflake', L(`ממטרי שלג`, `Snow showers`)],
  95: ['cloud-lightning', L(`סופת רעמים`, `Thunderstorm`)], 96: ['cloud-lightning', L(`סופת רעמים`, `Thunderstorm`)], 99: ['cloud-lightning', L(`סופת רעמים`, `Thunderstorm`)],
};
const wc = c => WCODE[c] || ['cloud', L(`—`, `—`)];
const hm = s => s.slice(11, 16);
// Sunrise and sunset as two icon-labelled times, so the order is clear in both RTL and LTR.
const sunVal = (rise, set, small) => `<span class="sunv${small ? " sm" : ""}"><span>${icon("sunrise")}${hm(rise)}</span><span>${icon("sunset")}${hm(set)}</span></span>`;
const dur = sec => `${Math.floor(sec / 3600)} ${T(UI.h)} ${Math.round((sec % 3600) / 60)} ${T(UI.mn)}`;

async function loadWeather(force) {
  if (weather && !force) return;
  try {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=52.0705&longitude=4.3007&timezone=Europe%2FAmsterdam&forecast_days=10'
      + '&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m'
      + '&hourly=precipitation_probability'
      + '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,sunrise,sunset,daylight_duration,wind_speed_10m_max';
    const r = await fetch(url);
    if (!r.ok) throw new Error(r.status);
    weather = await r.json(); weather.at = new Date(); weatherErr = false;
    store.set('wx', weather);
  } catch {
    weatherErr = !weather;
    const old = store.get('wx', null);
    if (old && !weather) { weather = old; weatherErr = false; }
  }
}
function rainFrom() {
  const h = weather.hourly, now = new Date(), t = todayIso();
  for (let i = 0; i < h.time.length; i++) {
    if (!h.time[i].startsWith(t)) continue;
    if (new Date(h.time[i]) < now && hm(h.time[i]) !== pad(now.getHours()) + ':00') continue;
    if (h.precipitation_probability[i] >= 50) return hm(h.time[i]);
  }
  return null;
}
const dayIdx = s => weather ? weather.daily.time.indexOf(s) : -1;

// ---------- photos from Wikipedia ----------
const wikiCache = store.get('wiki2', {});
async function wikiThumb(title) {
  if (title in wikiCache) return wikiCache[title];
  try {
    let src = null;
    for (const wl of ['en', 'nl']) {
      const r = await fetch(`https://${wl}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
      const j = r.ok ? await r.json() : {};
      if (j.thumbnail) { src = j.thumbnail.source; break; }
    }
    wikiCache[title] = src;
  } catch { return null; }
  store.set('wiki2', wikiCache);
  return wikiCache[title];
}
function fillPhotos() {
  document.querySelectorAll('[data-wiki]').forEach(async el => {
    const src = await wikiThumb(el.dataset.wiki);
    if (!src) return;
    const img = new Image(); img.alt = ''; img.src = src;
    img.onload = () => { if (!el.isConnected) return; el.innerHTML = ''; el.appendChild(img); el.classList.add('has'); };
  });
}

// ---------- building blocks ----------
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const icon = n => `<i data-lucide="${n}"></i>`;
const mapUrl = q => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const tagOf = ev => ev.t === 'nl' ? ['violet', 'lamp'] : ev.off ? ['lime', 'school'] : ['blue', 'school'];

function chips(page) {
  const cur = filters[page] || 'all';
  return `<div class="chips">${PAGE_FILTERS[page].map(([k, l]) =>
    `<button class="chip ${cur === k ? 'on' : ''}" data-filter="${page}:${k}">${T(UI[l])}</button>`).join('')}</div>`;
}
function head(title, sub, extra = '') {
  return `<div class="top"><div><h1>${title}</h1><p class="sub">${sub}</p></div><div class="btns">${topBtns()}${extra}</div></div>`;
}
function topBtns() {
  return `<button class="btn burger" data-act="menu" aria-label="menu">${icon('menu')}</button>
    <button class="btn" data-act="lang">${icon('languages')}<span>${T(UI.langBtn)}</span></button>
    <a class="btn dark" href="#calendar">${icon('calendar-days')}<span>${T(UI.calendar)}</span></a>`;
}
function eventRow(ev, showWhen = true) {
  const [c, ic] = tagOf(ev);
  const badge = ev.t === 'nl' ? '' : `<span class="tag" style="background:var(--${ev.t === 'p' ? 'blue' : ev.t === 's' ? 'violet' : 'sky'}-bg);color:var(--${ev.t === 'p' ? 'blue' : ev.t === 's' ? 'violet' : 'sky'})">ISH · ${T(UI[ev.t])}</span>`;
  return `<div class="row"><div class="dot" style="background:var(--${c}-bg);color:var(--${c})">${icon(ic)}</div>
    <div><p class="t">${T(ev.n)}</p><p class="s">${fmtRange(ev)}</p>${badge}</div>
    ${showWhen ? `<span class="when">${when(ev.d)}</span>` : ''}</div>`;
}
function placeCard(p) {
  const on = saved.has(p.id);
  const ph = p.w ? `data-wiki="${esc(p.w)}"` : '';
  const site = p.u ? `<a class="mini" href="${esc(p.u)}" target="_blank" rel="noopener">${icon(p.u.startsWith('mailto') ? 'mail' : 'external-link')}${T(UI.site)}</a>` : '';
  return `<article class="pcard">
    <div class="photo" ${ph}>${icon(p.ic || 'map-pin')}</div>
    <div class="pbody">
      <h3>${T(p.n)}</h3>
      <div class="meta">${p.m.map(x => `<span>${T(x)}</span>`).join('')}</div>
      <p>${T(p.d)}</p>
      <div class="acts">
        <a class="mini" href="${mapUrl(p.q)}" target="_blank" rel="noopener">${icon('map-pin')}${T(UI.map)}</a>
        ${site}
        <button class="heart ${on ? 'on' : ''}" data-save="${p.id}" aria-label="${T(UI.save)}">${icon('heart')}</button>
      </div>
    </div></article>`;
}
function placesPage(cat, extraTop = '') {
  const f = filters[cat] || 'all';
  const list = PLACES.filter(p => p.cat === cat && (f === 'all' || p.f.includes(f)));
  return head(T(UI[cat]), T(UI.pageSub[cat])) + extraTop + chips(cat) + `<section class="cards">${list.map(placeCard).join('')}</section>`;
}

// ---------- pages ----------
const PAGES = {
  home() {
    const hr = new Date().getHours();
    const greet = T(hr < 12 ? UI.morning : hr < 18 ? UI.noon : UI.evening);
    const up = upcomingEvents();
    const nextOff = up.find(e => e.t !== 'nl' && e.off);
    const nextNl = up.find(e => e.t === 'nl' && !e.minor && e.d >= todayIso());
    const ti = dayIdx(todayIso());

    let wCard, sCard;
    if (weather && ti >= 0) {
      const c = weather.current, [wi, wt] = wc(c.weather_code), rf = rainFrom();
      wCard = stat('blue', wi, T(UI.wNow), `${Math.round(c.temperature_2m)}°`, `${T(wt)} · ${rf ? T(UI.rainAfter) + rf : T(UI.noRain)}`);
      const d = weather.daily;
      sCard = stat('amber', 'sunset', T(UI.sun), sunVal(d.sunrise[ti], d.sunset[ti]), `${T(UI.dayLen)}: ${dur(d.daylight_duration[ti])}`);
    } else {
      const msg = weatherErr ? T(UI.wFail) : T(UI.loading);
      wCard = stat('blue', 'cloud', T(UI.wNow), '—', msg);
      sCard = stat('amber', 'sunset', T(UI.sun), '—', msg);
    }
    const ishCard = nextOff ? stat('lime', 'graduation-cap', T(UI.nextIsh), diffDays(nextOff.d) <= 0 ? T(UI.today) : `${diffDays(nextOff.d)} ${T(UI.days)}`,
      T(nextOff.n)) : '';
    const nlCard = nextNl ? stat('violet', 'lamp', T(UI.nextNl), T(nextNl.n).split(' – ')[0], fmt(nextNl.d), 'violet') : '';

    return head(`${greet}, ${T(UI.family)} 👋`, T(UI.sub)) +
      `<section class="stats">${wCard}${sCard}${ishCard}${nlCard}</section>
      <section class="grid2">
        <div class="card"><h2>${icon('compass')}${T(UI.wkSug)}</h2>${weekendIdeas()}</div>
        <div class="card"><h2>${icon('calendar-clock')}${T(UI.upcoming)}</h2>${up.slice(0, 5).map(e => eventRow(e)).join('')}
          <a class="more" href="#calendar">${T(UI.calendar)} ${icon(lang === 'he' ? 'arrow-left' : 'arrow-right')}</a></div>
      </section>`;
  },

  calendar() {
    const f = filters.calendar || 'all';
    const list = upcomingEvents().filter(e => f === 'all' || (f === 'nl' ? e.t === 'nl' : e.t !== 'nl'));
    const groups = {};
    list.forEach(e => { const k = e.d.slice(0, 7); (groups[k] = groups[k] || []).push(e); });
    return head(T(UI.calendar), T(UI.pageSub.calendar)) + chips('calendar') +
      Object.entries(groups).map(([k, evs]) => `<div class="card month"><h2>${icon('calendar')}${fmt(k + '-01', { month: 'long', year: 'numeric' })}</h2>${evs.map(e => eventRow(e)).join('')}</div>`).join('');
  },

  ish() {
    const f = filters.ish || 'all';
    const list = upcomingEvents().filter(e => e.t !== 'nl' && (f === 'all' || e.t === 'b' || e.t === f));
    const nextBreak = upcomingEvents().find(e => e.t === 'b' && e.e);
    return head(T(UI.ish), T(UI.pageSub.ish)) +
      `<section class="stats">
        ${nextBreak ? stat('lime', 'palmtree', T(UI.nextBreak), T(nextBreak.n), `${fmtRange(nextBreak)} · ${when(nextBreak.d)}`) : ''}
        ${stat('blue', 'flag', T(UI.firstLast), fmt('2027-07-14'), T(EVENTS.find(e => e.d === '2027-07-14').n).split('(')[1]?.replace(')', '') || '')}
      </section>
      <section class="grid2">
        <div class="card"><h2>${icon('info')}${T(UI.ishInfo)}</h2>
          <div class="row"><div class="dot" style="background:var(--blue-bg);color:var(--blue)">${icon('map-pin')}</div><div><p class="t">Wijndaelerweg 11, 2554 BZ Den Haag</p><p class="s">${T(UI.campus)}</p></div></div>
          <div class="acts" style="margin-top:8px">
            <a class="mini" href="${mapUrl('International School of The Hague, Wijndaelerweg 11')}" target="_blank" rel="noopener">${icon('map-pin')}${T(UI.map)}</a>
            <a class="mini" href="https://www.ishthehague.nl" target="_blank" rel="noopener">${icon('external-link')}ishthehague.nl</a>
            <a class="mini" href="https://www.ishthehague.nl/fs/pages/3687" target="_blank" rel="noopener">${icon('calendar')}${T(L(`לוח החופשות הרשמי`, `Official holiday list`))}</a>
          </div>
        </div>
        <div class="card"><h2>${icon('calendar-clock')}${T(UI.ishDates)}</h2>${chips('ish')}${list.slice(0, 8).map(e => eventRow(e)).join('')}
          <a class="more" href="#calendar">${T(UI.calendar)} ${icon(lang === 'he' ? 'arrow-left' : 'arrow-right')}</a></div>
      </section>
      ${ishGuide()}`;
  },

  holidays() {
    const f = filters.holidays || 'all';
    const list = CUSTOMS.filter(c => f === 'all' || (f === 'off' ? c.off : !c.off));
    const offTag = c => c.off ? `<span class="tag" style="background:var(--lime-bg);color:var(--lime)">${T(c.off === 'yes' ? UI.offYes : UI.offSome)}</span>` : '';
    return head(T(UI.holidays), T(UI.pageSub.holidays)) + chips('holidays') + `<section class="cards">${list.map(c => `
      <article class="card custom"><div class="stat"><div class="tile" style="background:var(--${c.c}-bg);color:var(--${c.c})">${icon(c.ic)}</div>
      <div><h3>${T(c.n)}</h3><p class="lbl">${T(c.when)}</p>${offTag(c)}</div></div>
      ${c.why ? `<p class="note"><b>${T(UI.why)}</b> ${T(c.why)}</p>` : ''}
      <p class="note">${c.why ? `<b>${T(UI.whatDo)}</b> ` : ''}${T(c.d)}</p></article>`).join('')}</section>`;
  },

  animals() {
    const f = filters.animals || 'all';
    const col = { danger: 'orange', common: 'blue', cool: 'violet' };
    const groups = ['danger', 'common', 'cool'].filter(g => f === 'all' || f === g);
    return head(T(UI.animals), T(UI.pageSub.animals)) + chips('animals') + groups.map(g => `
      <h2 class="sec-h"><span class="pill" style="background:var(--${col[g]}-bg);color:var(--${col[g]})">${T(UI[g])}</span></h2>
      <section class="cards">${ANIMALS.filter(a => a.g === g).map(a => `
        <article class="pcard"><div class="photo" data-wiki="${esc(a.w)}">${icon('paw-print')}</div>
        <div class="pbody"><h3>${T(a.n)}</h3><div class="meta"><span>${T(UI.season)}: ${T(a.s)}</span></div><p>${T(a.d)}</p>
        <div class="acts"><a class="mini" href="https://${lang === 'he' ? 'en' : 'en'}.wikipedia.org/wiki/${encodeURIComponent(a.w)}" target="_blank" rel="noopener">${icon('book-open')}${T(UI.wiki)}</a></div></div></article>`).join('')}
      </section>`).join('');
  },

  weather() {
    const refresh = `<button class="btn" data-act="refresh">${icon('refresh-cw')}<span>${T(UI.refresh)}</span></button>`;
    if (!weather) return head(T(UI.weatherNav), T(UI.pageSub.weather), refresh) + `<div class="card">${weatherErr ? T(UI.wFail) : T(UI.loading)}</div>`;
    const c = weather.current, d = weather.daily, [wi, wt] = wc(c.weather_code), rf = rainFrom();
    const days = d.time.slice(0, 7).map((t, i) => {
      const [ic, tx] = wc(d.weather_code[i]);
      return `<div class="row"><div class="dot" style="background:var(--sky-bg);color:var(--sky)">${icon(ic)}</div>
        <div><p class="t">${i === 0 ? T(UI.today) : fmt(t, { weekday: 'long', day: 'numeric', month: 'short' })}</p><p class="s">${T(tx)} · ${icon('umbrella')} ${d.precipitation_probability_max[i] ?? 0}% · ${T(UI.wind)} ${Math.round(d.wind_speed_10m_max[i])} ${T(UI.kmh)}</p></div>
        <span class="when"><b>${Math.round(d.temperature_2m_max[i])}°</b> / ${Math.round(d.temperature_2m_min[i])}°</span></div>`;
    }).join('');
    const sun = d.time.slice(0, 7).map((t, i) => `<div class="row"><div class="dot" style="background:var(--amber-bg);color:var(--amber)">${icon('sunrise')}</div>
        <div><p class="t">${i === 0 ? T(UI.today) : fmt(t, { weekday: 'short', day: 'numeric', month: 'short' })}</p><p class="s">${T(UI.dayLen)}: ${dur(d.daylight_duration[i])}</p></div>
        <span class="when">${sunVal(d.sunrise[i], d.sunset[i], true)}</span></div>`).join('');
    const year = [
      [L(`21 ביוני (היום הארוך)`, `21 June (longest day)`), `05:20 – 22:05`, L(`כ-16 ש' 45 ד'`, `about 16h 45m`)],
      [L(`21 בדצמבר (היום הקצר)`, `21 December (shortest day)`), `08:45 – 16:30`, L(`כ-7 ש' 45 ד'`, `about 7h 45m`)],
      [L(`שעון קיץ`, `Summer time`), L(`יום ראשון האחרון של מרץ`, `Last Sunday of March`), L(`השעון זז שעה קדימה`, `Clocks go forward 1 hour`)],
      [L(`שעון חורף`, `Winter time`), L(`יום ראשון האחרון של אוקטובר`, `Last Sunday of October`), L(`השעון זז שעה אחורה`, `Clocks go back 1 hour`)],
    ].map(([a, b, c2]) => `<div class="row"><div class="dot" style="background:var(--violet-bg);color:var(--violet)">${icon('sun-moon')}</div><div><p class="t">${T(a)}</p><p class="s">${T(c2)}</p></div><span class="when">${T(b)}</span></div>`).join('');
    return head(T(UI.weatherNav), `${T(UI.pageSub.weather)} · ${T(UI.updated)} ${pad(new Date(weather.at).getHours())}:${pad(new Date(weather.at).getMinutes())}`, refresh) +
      `<section class="stats">
        ${stat('blue', wi, T(UI.wNow), `${Math.round(c.temperature_2m)}°`, `${T(wt)} · ${T(UI.feels)} ${Math.round(c.apparent_temperature)}°`)}
        ${stat('sky', 'umbrella', T(L(`גשם היום`, `Rain today`)), rf || '—', rf ? T(UI.rainAfter) + rf : T(UI.noRain))}
        ${stat('teal', 'wind', T(UI.wind), `${Math.round(c.wind_speed_10m)}`, T(UI.kmh))}
        ${stat('amber', 'sunset', T(UI.sun), sunVal(d.sunrise[0], d.sunset[0]), `${T(UI.dayLen)}: ${dur(d.daylight_duration[0])}`)}
      </section>
      <section class="grid2"><div class="card"><h2>${icon('calendar-range')}${T(UI.forecast)}</h2>${days}</div>
      <div class="card"><h2>${icon('sunrise')}${T(UI.sunTimes)}</h2>${sun}</div></section>
      <div class="card" style="margin-top:18px"><h2>${icon('sun-moon')}${T(UI.yearLight)}</h2>${year}</div>`;
  },

  weekend: () => placesPage('weekend'),
  abroad: () => placesPage('abroad'),
  season: () => placesPage('season'),
  hike: () => placesPage('hike'),
  climb: () => placesPage('climb', `<div class="card" style="margin-bottom:18px"><h2>${icon('info')}${T(UI.basics)}</h2><section class="mini-grid">${INFO.climb.map(i => `
      <div class="minfo"><div class="tile sm" style="background:var(--orange-bg);color:var(--orange)">${icon(i.ic)}</div><div><p class="t">${T(i.n)}</p><p class="s">${T(i.d)}</p></div></div>`).join('')}</section></div>`),
  ballet: () => placesPage('ballet'),

  saved() {
    const list = PLACES.filter(p => saved.has(p.id));
    return head(T(UI.saved), T(UI.pageSub.saved)) + (list.length ? `<section class="cards">${list.map(placeCard).join('')}</section>` : `<div class="card empty">${icon('heart')}<p>${T(UI.emptySaved)}</p></div>`);
  },
};

function ishGuide() {
  const G = ISH_GUIDE;
  const f = filters.ish || 'all';
  const whoTag = w => w.split('').map(x => `<span class="tag" style="background:var(--${x === 'p' ? 'blue' : x === 's' ? 'violet' : 'teal'}-bg);color:var(--${x === 'p' ? 'blue' : x === 's' ? 'violet' : 'teal'})">${T(x === 'f' ? UI.familyTag : UI[x])}</span>`).join(' ');
  const items = G.buy.filter(b => f === 'all' || b.who.includes(f) || b.who === 'f');
  const doneN = items.filter(b => bought.has(b.id)).length;
  const sec = (ic, title, body, cls = '') => `<div class="card ${cls}" style="margin-top:18px"><h2>${icon(ic)}${T(title)}</h2>${body}</div>`;
  const info = list => list.map(r => `<div class="row"><div class="dot" style="background:var(--sky-bg);color:var(--sky)">${icon(r.ic)}</div><div><p class="t">${T(r.n)}</p><p class="s">${T(r.d)}</p></div></div>`).join('');
  return `
    <section class="grid2" style="margin-top:18px">${G.day.map(d => `<div class="card"><h2><span class="tile sm" style="background:var(--${d.c}-bg);color:var(--${d.c})">${icon(d.ic)}</span>${T(d.n)}</h2>
      <ul class="list">${d.rows.map(r => `<li>${T(r)}</li>`).join('')}</ul></div>`).join('')}</section>
    ${sec('shopping-cart', UI.toBuy, `<p class="s" style="margin:-4px 0 10px">${doneN}/${items.length} ${T(UI.done)}</p>` + items.map(b => `
      <label class="row check ${bought.has(b.id) ? 'done' : ''}"><input type="checkbox" data-check="${b.id}" ${bought.has(b.id) ? 'checked' : ''}>
      <div><p class="t">${T(b.n)}</p>${b.note ? `<p class="s">${T(b.note)}</p>` : ''}${whoTag(b.who)}</div></label>`).join(''))}
    <section class="grid2" style="margin-top:18px">
      <div class="card"><h2>${icon('phone')}${T(UI.contacts)}</h2>${G.contacts.map(c => `<div class="row"><div class="dot" style="background:var(--blue-bg);color:var(--blue)">${icon(c.ic)}</div>
        <div><p class="t">${T(c.n)}</p>${c.d ? `<p class="s">${T(c.d)}</p>` : ''}<div class="acts" style="margin-top:6px">
        ${c.tel ? `<a class="mini" href="tel:${c.tel}">${icon('phone')}${T(UI.call)}</a>` : ''}${c.mail ? `<a class="mini" href="mailto:${c.mail}">${icon('mail')}${c.mail}</a>` : ''}</div></div></div>`).join('')}</div>
      <div class="card"><h2>${icon('app-window')}${T(UI.apps)}</h2>${G.apps.map(a => `<div class="row"><div class="dot" style="background:var(--violet-bg);color:var(--violet)">${icon('smartphone')}</div>
        <div><p class="t">${T(a.n)} <span class="tag" style="background:#F1F5F9;color:#334155;margin:0 6px">${T(a.who)}</span></p><p class="s">${T(a.d)}</p></div></div>`).join('')}</div>
    </section>
    <section class="grid2" style="margin-top:18px">
      <div class="card"><h2>${icon('list-checks')}${T(UI.rules)}</h2>${info(G.rules)}</div>
      <div class="card"><h2>${icon('trophy')}${T(UI.afterSchool)}</h2>${info(G.after)}</div>
    </section>
    <section class="grid2" style="margin-top:18px">
      <div class="card"><h2>${icon('dumbbell')}${T(UI.recSport)}</h2>${info(G.sport)}</div>
      <div class="card"><h2>${icon('bus')}${T(UI.trips)}</h2>${info(G.trips)}</div>
    </section>
    <p class="src">${T(UI.srcGuide)} · <a href="${G.source}" target="_blank" rel="noopener">ishthehague.nl/school-guide</a></p>`;
}

function stat(c, ic, label, val, note, noteColor) {
  return `<div class="card"><div class="stat"><div class="tile" style="background:var(--${c}-bg);color:var(--${c})">${icon(ic)}</div>
    <div><p class="lbl">${label}</p><p class="val">${val}</p></div></div><p class="note"${noteColor ? ` style="color:var(--${noteColor})"` : ''}>${note}</p></div>`;
}

// Weekend picks: dry day -> outdoor place nearby, wet day -> indoor place.
function weekendIdeas() {
  const out = [];
  const now = parse(todayIso());
  const wk = [];
  for (let i = 0; i < 8 && wk.length < 2; i++) {
    const d = new Date(now); d.setDate(now.getDate() + i);
    if (d.getDay() === 6 || d.getDay() === 0) wk.push(iso(d));
  }
  const near = PLACES.filter(p => (p.cat === 'weekend' && p.f.includes('city')) || (p.cat === 'hike' && ['meijendel', 'westduin', 'haagsebos', 'awd', 'zkenn'].includes(p.id)) || (p.cat === 'weekend' && ['delft', 'leiden', 'rdam', 'naturalis', 'blijdorp'].includes(p.id)));
  wk.forEach((ds, n) => {
    const i = dayIdx(ds);
    const wet = i >= 0 ? (weather.daily.precipitation_probability_max[i] >= 50 || weather.daily.precipitation_sum[i] >= 2) : null;
    const pool = near.filter(p => wet === null ? true : wet ? p.f.includes('in') : p.f.includes('out') || p.cat === 'hike');
    const seed = parse(ds).getDate() + n * 7;
    const p = pool[seed % pool.length];
    const dayName = fmt(ds, { weekday: 'long', day: 'numeric', month: 'short' });
    const tag = wet === null ? '' : `<span class="tag" style="background:var(--${wet ? 'blue' : 'lime'}-bg);color:var(--${wet ? 'blue' : 'lime'})">${dayName} · ${wet ? T(UI.wet) : T(UI.dry)}${i >= 0 ? ` · ${Math.round(weather.daily.temperature_2m_max[i])}°` : ''}</span>`;
    out.push(ideaRow(p, tag || `<span class="tag" style="background:var(--sky-bg);color:var(--sky)">${dayName}</span>`));
  });
  const brk = upcomingEvents().find(e => e.t === 'b' && e.e && diffDays(e.d) > 0);
  if (brk) {
    const len = diffDays(brk.e) - diffDays(brk.d) + 1;
    const pool = PLACES.filter(p => p.cat === 'abroad' && (len >= 7 ? true : !p.f.includes('long')));
    const p = pool[parse(brk.d).getDate() % pool.length];
    out.push(ideaRow(p, `<span class="tag" style="background:var(--amber-bg);color:var(--amber)">${T(UI.breakIdea)}: ${T(brk.n)} · ${fmtRange(brk)}</span>`));
  }
  return out.join('');
}
function ideaRow(p, tag) {
  const pg = p.cat;
  return `<a class="row link" href="#${pg}"><div class="dot" style="background:var(--teal-bg);color:var(--teal)">${icon(p.ic || 'map-pin')}</div>
    <div><p class="t">${T(p.n)}</p><p class="s">${p.m.map(T).join(' · ')}</p>${tag}</div></a>`;
}

// ---------- shell ----------
function renderNav(route) {
  const sec = s => NAV.filter(n => n.sec === s).map(n => `<a class="${route === n.r ? 'on' : ''}" href="#${n.r}">
    <span class="ic" ${n.c ? `style="background:var(--${n.c}-bg);color:var(--${n.c})"` : ''}>${icon(n.ic)}</span>${T(UI[n.k])}
    ${n.r === 'saved' && saved.size ? `<span class="count">${saved.size}</span>` : ''}</a>`).join('');
  document.getElementById('nav').innerHTML = `<div class="sec">${T(UI.main)}</div>${sec('main')}<div class="sec">${T(UI.cats)}</div>${sec('cats')}`;
  document.getElementById('brandName').innerHTML = T(UI.appName);
  document.getElementById('famName').textContent = T(UI.family);
  document.getElementById('famCity').textContent = T(UI.city);
}
function render() {
  const route = (location.hash.slice(1) || 'home');
  const page = PAGES[route] ? route : 'home';
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
  document.title = T(UI.appName);
  renderNav(page);
  document.getElementById('main').innerHTML = PAGES[page]();
  lucide.createIcons();
  fillPhotos();
}
function closeMenu() { document.getElementById('side').classList.remove('open'); document.getElementById('scrim').classList.remove('open'); }

document.addEventListener('click', e => {
  const a = e.target.closest('[data-act],[data-filter],[data-save],#scrim,.nav a');
  if (!a) return;
  if (a.matches('.nav a') || a.id === 'scrim') { closeMenu(); return; }
  if (a.dataset.act === 'menu') { document.getElementById('side').classList.add('open'); document.getElementById('scrim').classList.add('open'); }
  if (a.dataset.act === 'lang') { lang = lang === 'he' ? 'en' : 'he'; store.set('lang', lang); render(); }
  if (a.dataset.act === 'refresh') { a.disabled = true; loadWeather(true).then(render); }
  if (a.dataset.filter) { const [pg, k] = a.dataset.filter.split(':'); filters[pg] = k; render(); }
  if (a.dataset.save) {
    const id = a.dataset.save;
    saved.has(id) ? saved.delete(id) : saved.add(id);
    store.set('saved', [...saved]);
    render();
  }
});
document.addEventListener('change', e => {
  const id = e.target.dataset && e.target.dataset.check;
  if (!id) return;
  e.target.checked ? bought.add(id) : bought.delete(id);
  store.set('bought', [...bought]);
  const y = window.scrollY; render(); window.scrollTo(0, y);
});
window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });

render();
loadWeather().then(render);
// Weather refreshes every 30 min while open, and when the app comes back to the screen with stale data
// (phones freeze background timers, so the interval alone isn't enough).
const WX_MAX_AGE = 30 * 60 * 1000;
const refreshWeather = () => { const y = window.scrollY; return loadWeather(true).then(() => { render(); window.scrollTo(0, y); }); };
setInterval(refreshWeather, WX_MAX_AGE);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && (!weather || Date.now() - new Date(weather.at) > WX_MAX_AGE)) refreshWeather();
});
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js');
