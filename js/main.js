const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyQeI5S2MjED2qa6oP1uhVDJLQOktxh89Jwj785SWM0frLu8TT3TTXKIo9XBQb85EE5/exec';

const features = [
  'Walking distance to the beach',
  'Sea or beach view',
  'Pool access',
  'Large terrace / outdoor space',
  'Fast, reliable WiFi',
  'Dedicated desk / workspace',
  'Quiet space for calls',
  'Doorman / portaria',
  'Air conditioning throughout',
  'Modern / renovated fit-out',
  'High-end kitchen',
  'Parking',
  'No restrictive HOA / rental rules',
  'Lift / elevator access'
];

const cols = [
  { key: 'dc',  label: "Don't care",    cls: 'col-dc'  },
  { key: 'wbn', label: 'Would be nice', cls: 'col-wbn' },
  { key: 'imp', label: 'Important',     cls: 'col-imp' },
  { key: 'nn',  label: 'Non-negotiable',cls: 'col-nn'  }
];

// Build feature matrix rows
const tbody = document.getElementById('feat-body');
features.forEach((f, i) => {
  const tr = document.createElement('tr');
  tr.innerHTML = `<td>${f}</td>` + cols.map(c =>
    `<td class="${c.cls}"><span class="feat-btn" data-fi="${i}" data-lv="${c.key}" onclick="pickFeat(this)"></span><input type="hidden" name="feat_${i}" id="fi${i}"></td>`
  ).join('');
  tbody.appendChild(tr);
});

// Leaflet map
const map = L.map('map', { center: [-22.963, -43.188], zoom: 13, zoomControl: false, scrollWheelZoom: false, attributionControl: false });
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);

const mkDim = L.divIcon({ html: `<div style="width:9px;height:9px;background:#fff;border-radius:50%;opacity:0.45;"></div>`, className: '', iconSize: [9,9], iconAnchor: [4,4] });
const mkBright = L.divIcon({ html: `<div style="width:11px;height:11px;background:#fff;border-radius:50%;box-shadow:0 0 0 4px rgba(255,255,255,0.2)"></div>`, className: '', iconSize: [11,11], iconAnchor: [5,5] });

const mks = {};
document.querySelectorAll('.nbhd-card[data-lat]').forEach(card => {
  const lat = +card.dataset.lat, lng = +card.dataset.lng;
  const name = card.querySelector('.nbhd-name').textContent.trim();
  const mk = L.marker([lat, lng], { icon: mkDim }).addTo(map);
  mk.bindPopup(`<span style="color:rgba(255,255,255,0.75)">${name}</span>`, { className: 'cpop', closeButton: false });
  mks[name] = { mk, lat, lng };
  mk.on('click', () => {
    const c = [...document.querySelectorAll('.nbhd-card[data-lat]')].find(c => c.querySelector('.nbhd-name').textContent.trim() === name);
    if (c) pickNbhd(c);
  });
});

function pickFeat(btn) {
  const fi = btn.dataset.fi;
  document.querySelectorAll(`.feat-btn[data-fi="${fi}"]`).forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  document.getElementById(`fi${fi}`).value = btn.dataset.lv;
}

function pickNbhd(card) {
  document.querySelectorAll('.nbhd-card').forEach(c => c.classList.remove('active'));
  document.getElementById('nbhd-any').classList.remove('on');
  card.classList.add('active');
  const name = card.querySelector('.nbhd-name').textContent.trim();
  document.getElementById('nbhd-val').value = name;
  const m = mks[name];
  if (m) {
    map.flyTo([m.lat, m.lng], 14, { duration: 0.9 });
    Object.entries(mks).forEach(([n, v]) => v.mk.setIcon(n === name ? mkBright : mkDim));
    m.mk.openPopup();
  }
}

function pickNbhdAny(btn) {
  btn.classList.toggle('on');
  if (btn.classList.contains('on')) {
    document.querySelectorAll('.nbhd-card').forEach(c => c.classList.remove('active'));
    Object.values(mks).forEach(v => v.mk.setIcon(mkDim));
    document.getElementById('nbhd-val').value = 'No preference';
  } else {
    document.getElementById('nbhd-val').value = '';
  }
}

function pick(btn) {
  const g = btn.closest('[data-name]');
  g.querySelectorAll('.opt').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  const h = document.querySelector(`input[type=hidden][name="${g.dataset.name}"]`);
  if (h) h.value = btn.textContent.trim().replace(/\s+/g, ' ');
}

function pickBand(lbl) {
  document.querySelectorAll('.inv-band').forEach(l => l.classList.remove('on'));
  lbl.classList.add('on');
  lbl.querySelector('input[type=radio]').checked = true;
}

function handleSubmit(e) {
  e.preventDefault();
  const f = e.target;

  if (!f.name.value.trim()) { f.name.classList.add('err'); f.name.focus(); return; }
  if (!f.email.value.trim()) { f.email.classList.add('err'); f.email.focus(); return; }

  const featMap = {};
  features.forEach((feat, i) => {
    const v = document.getElementById(`fi${i}`).value;
    if (v) featMap[feat] = v;
  });

  const data = new FormData(f);
  const payload = { timestamp: new Date().toISOString(), features: featMap };
  for (let [k, v] of data.entries()) {
    if (k.startsWith('feat_')) continue;
    if (payload[k]) {
      payload[k] = Array.isArray(payload[k]) ? [...payload[k], v] : [payload[k], v];
    } else {
      payload[k] = v;
    }
  }

  const submitBtn = f.querySelector('.submit-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify(payload)
  })
    .then(() => {
      document.getElementById('form-page').style.display = 'none';
      document.getElementById('success').style.display = 'block';
      window.scrollTo(0, 0);
    })
    .catch(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit';
      alert('Something went wrong — please try again or email Oliver directly.');
    });
}

document.querySelectorAll('input[type=text], input[type=email]').forEach(i =>
  i.addEventListener('input', () => i.classList.remove('err'))
);
