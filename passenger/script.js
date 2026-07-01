/* ============================================================
   CommutAI — Passenger App
   All data below is 100% simulated in-memory (no backend/API).
   ============================================================ */

/* ---------- Fake data store ---------- */
const DB = {
  passenger: { name: "Juan Dela Cruz", initials: "JD", type: "Regular" },

  terminals: [
    { name: "Manolo Fortich Central Terminal", brgy: "Poblacion", dist: "0.4 km", status: "ok", buses: 6 },
    { name: "Agora Terminal", brgy: "Cagayan de Oro", dist: "27.9 km", status: "busy", buses: 14 },
    { name: "Dalirig Terminal", brgy: "Dalirig", dist: "3.1 km", status: "ok", buses: 2 },
    { name: "Alae Junction", brgy: "Alae", dist: "5.6 km", status: "ok", buses: 3 },
    { name: "Lindaban Terminal", brgy: "Lindaban", dist: "8.2 km", status: "busy", buses: 5 },
  ],

  upcoming: [
    { title: "MF ⇄ CDO Loop", sub: "Bus 014 · Terminal A", time: "2:10 PM" },
    { title: "MF ⇄ Malaybalay", sub: "Bus 027 · Terminal B", time: "3:45 PM" },
    { title: "MF ⇄ Impasugong", sub: "Bus 009 · Terminal A", time: "5:00 PM" },
  ],

  history: [
    { route: "Manolo Fortich ⇄ Cagayan de Oro", date: "Jun 28, 2026", fare: "₱65.00", status: "Completed" },
    { route: "Manolo Fortich ⇄ Malaybalay", date: "Jun 24, 2026", fare: "₱58.00", status: "Completed" },
    { route: "Manolo Fortich ⇄ Impasugong", date: "Jun 19, 2026", fare: "₱40.00", status: "Completed" },
    { route: "Manolo Fortich ⇄ Cagayan de Oro", date: "Jun 12, 2026", fare: "₱65.00", status: "Completed" },
  ],

  notifications: [
    { type: "info", icon: "fa-bus", title: "Bus arriving in 3 minutes", text: "Bus 014 is approaching Manolo Fortich Central Terminal.", time: "Just now" },
    { type: "warn", icon: "fa-users", title: "Terminal crowded", text: "Agora Terminal is experiencing high passenger volume.", time: "12 min ago" },
    { type: "info", icon: "fa-circle-check", title: "Trip completed", text: "Your trip to Cagayan de Oro has been marked complete.", time: "Yesterday" },
    { type: "danger", icon: "fa-ban", title: "Bus full", text: "Bus 027 (MF-Malaybalay) has reached maximum capacity.", time: "Yesterday" },
    { type: "info", icon: "fa-bullhorn", title: "Schedule update", text: "An additional 5:30 PM trip has been added on the MF-CDO Loop.", time: "2 days ago" },
  ],

  weathers: [
    { icon: "fa-cloud-sun", temp: "29°C", desc: "Partly cloudy · Manolo Fortich" },
    { icon: "fa-sun", temp: "32°C", desc: "Sunny · Manolo Fortich" },
    { icon: "fa-cloud-showers-heavy", temp: "25°C", desc: "Light rain · Manolo Fortich" },
    { icon: "fa-cloud", temp: "27°C", desc: "Overcast · Manolo Fortich" },
  ],
};

/* ---------- Navigation ---------- */
function goTo(screenName){
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const target = document.querySelector(`.screen[data-screen="${screenName}"]`);
  if(target){ target.classList.add("active"); target.scrollTop = 0; }

  // bottom nav visibility + active state
  const tabsWithNav = ["home","buyticket","notifications","profile"];
  const bottomNav = document.getElementById("bottom-nav");
  bottomNav.style.display = tabsWithNav.includes(screenName) ? "flex" : "none";
  document.querySelectorAll(".nav-item").forEach(item=>{
    item.classList.toggle("active", item.dataset.nav === screenName);
  });
}

function showToast(msg){
  const toast = document.getElementById("toast");
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${msg}`;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=> toast.classList.remove("show"), 2400);
}

/* Wire up every element with data-nav */
document.addEventListener("click", (e)=>{
  const el = e.target.closest("[data-nav]");
  if(!el) return;
  // let form submit handler manage forms; buttons/anchors navigate immediately
  if(el.tagName === "FORM") return;
  e.preventDefault();
  goTo(el.dataset.nav);
  if(el.dataset.toast) showToast(el.dataset.toast);
});

/* Forms with data-nav should navigate on submit (simulated auth) */
document.addEventListener("submit", (e)=>{
  const form = e.target.closest("form[data-nav]");
  if(!form) return;
  if(form.id === "ticket-form") return; // handled separately
  e.preventDefault();
  goTo(form.dataset.nav);
  if(form.dataset.toast) showToast(form.dataset.toast);
});

/* ---------- Splash → Login ---------- */
window.addEventListener("load", ()=>{
  setTimeout(()=>{ goTo("login"); }, 2200);
});

/* ---------- Render: upcoming trips (home) ---------- */
function renderUpcoming(){
  const wrap = document.getElementById("upcoming-trips");
  wrap.innerHTML = DB.upcoming.map(t => `
    <div class="trip-mini">
      <div class="trip-mini-icon"><i class="fa-solid fa-bus"></i></div>
      <div class="trip-mini-body">
        <p class="trip-mini-title">${t.title}</p>
        <p class="trip-mini-sub">${t.sub}</p>
      </div>
      <span class="trip-mini-time">${t.time}</span>
    </div>
  `).join("");
}

/* ---------- Render: nearby terminals ---------- */
function renderTerminals(){
  const wrap = document.getElementById("terminal-list");
  wrap.innerHTML = DB.terminals.map(t => `
    <div class="terminal-card">
      <div class="terminal-icon"><i class="fa-solid fa-building-shield"></i></div>
      <div class="terminal-body">
        <p class="terminal-name">${t.name}</p>
        <p class="terminal-meta">Brgy. ${t.brgy} · ${t.buses} buses active</p>
        <div class="terminal-tags">
          <span class="tag ${t.status === 'busy' ? 'tag--busy' : 'tag--ok'}">
            ${t.status === 'busy' ? 'Crowded' : 'Normal flow'}
          </span>
        </div>
      </div>
      <span class="terminal-dist">${t.dist}</span>
    </div>
  `).join("");
}

/* ---------- Render: notifications ---------- */
function renderNotifications(){
  const wrap = document.getElementById("notif-list");
  wrap.innerHTML = DB.notifications.map((n,i) => `
    <div class="notif-card" style="animation-delay:${i*60}ms">
      <div class="notif-icon notif-icon--${n.type}"><i class="fa-solid ${n.icon}"></i></div>
      <div class="notif-body">
        <p class="notif-title">${n.title}</p>
        <p class="notif-text">${n.text}</p>
        <span class="notif-time">${n.time}</span>
      </div>
    </div>
  `).join("");
}

/* ---------- Render: trip history ---------- */
function renderHistory(){
  const wrap = document.getElementById("history-list");
  wrap.innerHTML = DB.history.map(h => `
    <div class="history-card">
      <div class="history-top">
        <span class="history-route">${h.route}</span>
        <span class="history-fare">${h.fare}</span>
      </div>
      <div class="history-meta">
        <span><i class="fa-solid fa-calendar"></i> ${h.date}</span>
        <span><i class="fa-solid fa-circle-check"></i> ${h.status}</span>
      </div>
    </div>
  `).join("");
}

/* ---------- Simulated weather rotation ---------- */
function rotateWeather(){
  const w = DB.weathers[Math.floor(Math.random()*DB.weathers.length)];
  const iconEl = document.querySelector(".weather-icon");
  document.getElementById("weather-temp").textContent = w.temp;
  document.getElementById("weather-desc").textContent = w.desc;
  iconEl.className = `fa-solid ${w.icon} weather-icon`;
}

/* ---------- Live bus simulation (Home mini-map) ---------- */
let homeSeats = 12, homeOnboard = 33, homeEtaMin = 4;
function tickHomeLive(){
  homeSeats = Math.max(0, Math.min(45, homeSeats + (Math.random() > 0.5 ? -1 : 1)));
  homeOnboard = Math.max(0, Math.min(45, homeOnboard + (Math.random() > 0.5 ? 1 : -1)));
  homeEtaMin = Math.max(1, homeEtaMin - (Math.random() > 0.6 ? 1 : 0));
  if(homeEtaMin <= 1) homeEtaMin = 8; // loop back around

  document.getElementById("home-seats").textContent = homeSeats;
  document.getElementById("home-onboard").textContent = homeOnboard;
  document.getElementById("home-eta").textContent = `${homeEtaMin} min`;

  // move bus dot along the fake SVG path
  const path = document.getElementById("route-path");
  const bus = document.getElementById("bus-dot");
  if(path && bus){
    const len = path.getTotalLength();
    const progress = (1 - homeEtaMin / 8);
    const pt = path.getPointAtLength(len * Math.max(0, Math.min(1, progress)));
    bus.setAttribute("cx", pt.x);
    bus.setAttribute("cy", pt.y);
  }
}

/* ---------- Live tracking screen simulation ---------- */
let trackSeconds = 4*60 + 12;
let trackSeats = 12, trackOnboard = 33, trackSpeed = 38;
function tickTracking(){
  if(trackSeconds > 0) trackSeconds--;
  else trackSeconds = 4*60+12;
  const m = String(Math.floor(trackSeconds/60)).padStart(2,"0");
  const s = String(trackSeconds%60).padStart(2,"0");
  document.getElementById("track-eta").textContent = `${m}:${s}`;

  trackSpeed = Math.max(0, Math.min(60, trackSpeed + (Math.random()>0.5?2:-2)));
  document.getElementById("track-speed").textContent = trackSpeed;

  if(Math.random() > 0.85){
    trackSeats = Math.max(0, Math.min(45, trackSeats + (Math.random()>0.5?-1:1)));
    trackOnboard = Math.max(0, Math.min(45, trackOnboard + (Math.random()>0.5?1:-1)));
    document.getElementById("track-seats").textContent = trackSeats;
    document.getElementById("track-onboard").textContent = trackOnboard;
  }

  const path = document.getElementById("track-path");
  const bus = document.getElementById("track-bus");
  if(path && bus){
    const len = path.getTotalLength();
    const progress = 1 - (trackSeconds / (4*60+12));
    const pt = path.getPointAtLength(len * Math.max(0, Math.min(1, progress)));
    bus.setAttribute("cx", pt.x);
    bus.setAttribute("cy", pt.y);
  }
}

/* ---------- Trip info progress simulation ---------- */
let tripProgress = 38;
function tickTripProgress(){
  tripProgress = tripProgress >= 96 ? 10 : tripProgress + 1;
  const bar = document.getElementById("tripinfo-progress");
  if(bar) bar.style.width = tripProgress + "%";
}

/* ---------- Buy ticket → fare calc ---------- */
const typeSelect = document.getElementById("ticket-type");
const fareLabel = document.getElementById("fare-amount");
function updateFare(){
  const opt = typeSelect.options[typeSelect.selectedIndex];
  const fare = opt.dataset.fare || "65";
  fareLabel.textContent = `₱${parseFloat(fare).toFixed(2)}`;
}
typeSelect.addEventListener("change", updateFare);

/* ---------- Fake QR code drawing (canvas, deterministic-looking noise) ---------- */
function drawFakeQR(canvas, seed){
  const ctx = canvas.getContext("2d");
  const size = canvas.width;
  const cells = 21; // like a small QR grid
  const cell = size / cells;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0,0,size,size);
  ctx.fillStyle = "#263238";

  // simple seeded PRNG so each ticket looks unique but stable
  let s = seed;
  function rand(){ s = (s * 9301 + 49297) % 233280; return s / 233280; }

  for(let y=0; y<cells; y++){
    for(let x=0; x<cells; x++){
      // draw finder patterns (corners) solid, else random noise
      const inTopLeft = x < 7 && y < 7;
      const inTopRight = x >= cells-7 && y < 7;
      const inBottomLeft = x < 7 && y >= cells-7;
      if(inTopLeft || inTopRight || inBottomLeft){
        const lx = inTopLeft ? x : inTopRight ? x-(cells-7) : x;
        const ly = inBottomLeft ? y-(cells-7) : y;
        const border = lx===0||lx===6||ly===0||ly===6;
        const core = lx>=2&&lx<=4&&ly>=2&&ly<=4;
        if(border || core) ctx.fillRect(x*cell, y*cell, cell, cell);
      } else {
        if(rand() > 0.56) ctx.fillRect(x*cell, y*cell, cell, cell);
      }
    }
  }
}

function randomCode(){
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "CMT-";
  for(let i=0;i<6;i++) out += chars[Math.floor(Math.random()*chars.length)];
  return out;
}

/* ---------- Ticket form submit → generate QR ---------- */
document.getElementById("ticket-form").addEventListener("submit", (e)=>{
  e.preventDefault();
  const route = document.getElementById("ticket-route").value;
  const dest = document.getElementById("ticket-destination").value;
  const fare = fareLabel.textContent;
  const code = randomCode();
  const seat = `${Math.floor(Math.random()*20)+1}${["A","B","C","D"][Math.floor(Math.random()*4)]}`;

  document.getElementById("qr-route").textContent = route;
  document.getElementById("qr-dest").textContent = dest;
  document.getElementById("qr-fare").textContent = fare;
  document.getElementById("qr-seat").textContent = seat;
  document.getElementById("qr-code").textContent = code;
  document.getElementById("qr-status").textContent = "Valid";

  const canvas = document.getElementById("qr-canvas");
  drawFakeQR(canvas, code.length * 777 + Date.now() % 1000);

  goTo("qrticket");
  showToast("Ticket generated");
});

/* ---------- Dark mode toggle ---------- */
const darkToggle = document.getElementById("dark-toggle");
darkToggle.addEventListener("change", ()=>{
  document.body.dataset.theme = darkToggle.checked ? "dark" : "light";
  document.getElementById("app").parentElement.dataset.theme = darkToggle.checked ? "dark" : "light";
  document.getElementById("app").dataset.theme = darkToggle.checked ? "dark" : "light";
});

/* ---------- Notification badge count ---------- */
function refreshBadge(){
  const badge = document.getElementById("nav-badge");
  badge.textContent = DB.notifications.length;
  badge.style.display = DB.notifications.length ? "flex" : "none";
}

/* ---------- Random live notification injection ---------- */
const randomNotifPool = [
  { type:"info", icon:"fa-bus", title:"Bus arriving in 3 minutes", text:"Bus 014 is approaching your nearest terminal." },
  { type:"warn", icon:"fa-users", title:"Terminal crowded", text:"Higher than usual passenger volume detected nearby." },
  { type:"info", icon:"fa-circle-check", title:"Trip completed", text:"A trip on your saved route has just been completed." },
  { type:"danger", icon:"fa-ban", title:"Bus full", text:"The next scheduled bus has reached maximum capacity." },
];
function maybeInjectNotification(){
  if(Math.random() > 0.75){
    const n = randomNotifPool[Math.floor(Math.random()*randomNotifPool.length)];
    DB.notifications.unshift({ ...n, time: "Just now" });
    if(DB.notifications.length > 8) DB.notifications.pop();
    refreshBadge();
    if(document.querySelector('.screen[data-screen="notifications"]').classList.contains("active")){
      renderNotifications();
    }
  }
}

/* ---------- Init ---------- */
function init(){
  renderUpcoming();
  renderTerminals();
  renderNotifications();
  renderHistory();
  refreshBadge();
  updateFare();
  document.getElementById("bottom-nav").style.display = "none"; // hidden until home

  setInterval(tickHomeLive, 2200);
  setInterval(tickTracking, 1000);
  setInterval(tickTripProgress, 3000);
  setInterval(rotateWeather, 9000);
  setInterval(maybeInjectNotification, 7000);
}
init();
