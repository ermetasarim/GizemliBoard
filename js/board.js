const KEY = "gizemliboard-v1";
const seed = () => ({
  me: null,
  users: [
    { id: 1, username: "admin", password: "GbAdmin2007", name: "Yönetim", rank: "Admin", admin: true },
    { id: 2, username: "demo", password: "123456", name: "Kardesturk", rank: "Üye", admin: false },
    { id: 3, username: "queen", password: "123456", name: "queen", rank: "Moderatör", admin: false }
  ],
  cats: [
    { title: "~~~~ TANIŞ - KAYNAŞ - ANLAŞ ~~~~", boards: [
      ["hosgeldiniz", "HOŞGELDİNİZ", "Hoşgeldiniz mesajları buraya", "Yönetim"],
      ["duyuru", "GB DUYURULAR", "Admin arkadaşlardan başka kimse duyuru açamaz", "Yönetim"],
      ["haftanin", "HAFTANIN ÜYESİ", "Unutma bir gün sıra sana da gelebilir!", "Yönetim"],
      ["yarisma", "YARIŞMALAR", "Ara ara yapılan dağıtımlar, ödüllü yarışmalar.", "Yönetim"],
      ["sorun", "SORUN SÖYLEYELİM", "Yeni üyeler için öğrenmek istediğiniz şeyler.", "Yönetim"],
      ["radyo", "RADYO GB", "Tebrik ve istek mesajları.", "DJ Exselans"]
    ]},
    { title: "~~~~ EĞLENCE ( FUN ) ~~~~", boards: [
      ["ciddi", "CİDDİ VE SEVİYELİ KONULAR", "Her tür ciddi konu burada tartışılır.", "SeZoCaN"],
      ["muhabbet", "MUHABBET KUŞLARI", "Muhabbet olmadan olmaz diyenler.", "mini_cooper"],
      ["oyunlar", "FORUM OYUNLARI", "Games takılanlar buraya.", "CiCiTuRK"],
      ["siir", "GB ŞİİR BÖLÜMÜ", "Şiir sevenler derneği.", "ProfessionaL"],
      ["anket", "ANKETLER", "Anketlerimiz burada.", "KACMAZ"],
      ["sozluk", "GB SÖZLÜK", "GB sözlük artık sizlerle.", "Yönetim"]
    ]},
    { title: "~~~~ KÜLTÜR & SANAT ve HABERLER ~~~~", boards: [
      ["ataturk", "M.KEMAL ATATÜRK", "Cumhuriyet ve Atatürk başlıkları.", "Yönetim"],
      ["kultur", "GENEL KÜLTÜR", "Bilgi, haber ve merak.", "Yönetim"],
      ["bilmece", "ZEKA OYUNLARI VE BİLMECELER", "Kısa sorular, uzun cevaplar.", "Yönetim"],
      ["memleket", "MEMLEKETİMİZ", "Şehirler ve hatıralar.", "Yönetim"]
    ]},
    { title: "~~~~ GB'DEN AŞKIM BÖLÜMÜ ~~~~", boards: [
      ["askim", "GB'DEN AŞKIM AŞKIM", "Aşk başlıkları.", "Yönetim"],
      ["itiraf", "İTİRAF EDİYORUM", "İçinden geçeni bırak.", "Yönetim"],
      ["dert", "DERT ORTAĞI", "Dertleşmek serbest.", "Yönetim"]
    ]},
    { title: "~~~~ SPOR DÜNYASI ~~~~", boards: [
      ["futbol", "FUTBOL HABER", "Maç, transfer, tribün.", "Yönetim"],
      ["fb", "FENERBAHÇE", "Sarı lacivert masa.", "Yönetim"],
      ["gs", "GALATASARAY", "Sarı kırmızı masa.", "Yönetim"],
      ["ts", "TRABZONSPOR", "Bordo mavi masa.", "Yönetim"]
    ]},
    { title: "~~~~ BOARD ÖZEL ~~~~", boards: [
      ["fikir", "FİKRİM GELDİ DİYENLER", "Pano için öneri.", "Yönetim"],
      ["test", "BOARD KARANTİNA VE TEST ODASI", "Deneme konuları.", "Yönetim"]
    ]}
  ],
  topics: [
    { id: 1, board: "hosgeldiniz", userId: 1, title: "GizemliBoard'a hoş geldiniz", pinned: true, locked: false, views: 2773, last: Date.now() - 3600000, created: Date.now() - 86400000 * 40 },
    { id: 2, board: "duyuru", userId: 3, title: "Duyuru açma kuralı", pinned: false, locked: false, views: 295, last: Date.now() - 7200000, created: Date.now() - 86400000 * 12 },
    { id: 3, board: "muhabbet", userId: 2, title: "Muhabbet olmadan olmaz", pinned: false, locked: false, views: 2038, last: Date.now() - 5400000, created: Date.now() - 86400000 * 8 },
    { id: 4, board: "ataturk", userId: 1, title: "İyisi ile kötüsü ile 1. senemiz", pinned: false, locked: false, views: 640, last: Date.now() - 86400000, created: Date.now() - 86400000 * 20 }
  ],
  posts: [
    { id: 1, topicId: 1, userId: 1, body: "Eylül 2007 arşivindeki pano düzeni. Kategoriler o günkü GizemliBoard listesinden alındı. Yazılar bu tarayıcıda durur.", created: Date.now() - 86400000 * 40 },
    { id: 2, topicId: 1, userId: 2, body: "Hoş geldiniz masasına ilk yanıt.", created: Date.now() - 3600000 },
    { id: 3, topicId: 2, userId: 3, body: "Duyuruyu yönetim açar. Diğer üyeler yanıt yazabilir.", created: Date.now() - 7200000 },
    { id: 4, topicId: 3, userId: 2, body: "Muhabbet kuşu buraya konar.", created: Date.now() - 5400000 },
    { id: 5, topicId: 4, userId: 1, body: "Arşiv alt bilgisi: Burning Board 2.3.6, Style By Delikan. Crocodile teması 1219 kişi tarafından seçiliydi.", created: Date.now() - 86400000 }
  ]
});

let db = JSON.parse(localStorage.getItem(KEY) || "null") || seed();
const save = () => localStorage.setItem(KEY, JSON.stringify(db));
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&" + "amp;", "<": "&" + "lt;", ">": "&" + "gt;", '"': "&" + "quot;" }[c]));
const when = (t) => {
  const m = (Date.now() - t) / 60000;
  if (m < 60) return "Bugün, " + new Date(t).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  if (m < 1440) return "Dün, " + new Date(t).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  return new Date(t).toLocaleDateString("tr-TR");
};
const user = (id) => db.users.find((u) => u.id === id) || { name: "?", username: "?" };
const me = () => (db.me ? user(db.me) : null);
const boardOf = (slug) => {
  for (const c of db.cats) {
    const b = c.boards.find((x) => x[0] === slug);
    if (b) return { slug: b[0], name: b[1], desc: b[2], mod: b[3], cat: c.title };
  }
  return null;
};
const replies = (id) => Math.max(0, db.posts.filter((p) => p.topicId === id).length - 1);
const topicsOf = (slug) => db.topics.filter((t) => t.board === slug);
const nextId = (list) => list.reduce((m, x) => Math.max(m, x.id), 0) + 1;

function chrome() {
  const u = me();
  document.getElementById("tools").innerHTML = u
    ? `${esc(u.name)} · <a href="#/yeni">Yeni konu</a> · <button id="out" type="button">Çıkış</button>`
    : `<a href="#/giris">Giriş</a> · <a href="#/katil">Üyelik formu</a>`;
  document.getElementById("out")?.addEventListener("click", () => { db.me = null; save(); route(); });
}

function home() {
  const rows = db.cats.map((c) => `<section class="cat"><h2>${esc(c.title)}</h2><table>
    <tr><th>Forum</th><th class="num">Cevaplar</th><th class="num">Konular</th><th class="last">Son mesaj</th><th class="mod">Moderatörler</th></tr>
    ${c.boards.map((b) => {
      const list = topicsOf(b[0]).sort((a, z) => z.last - a.last);
      const last = list[0];
      const cevap = list.reduce((n, t) => n + replies(t.id), 0);
      return `<tr><td><span class="folder"></span><a class="board-name" href="#/b/${b[0]}">${esc(b[1])}</a><div class="desc">${esc(b[2])}</div></td>
        <td class="num">${cevap}</td><td class="num">${list.length}</td>
        <td class="last">${last ? `${esc(last.title)}<br>${when(last.last)} · ${esc(user(last.userId).name)}` : "Bilgi yok"}</td>
        <td class="mod">${esc(b[3])}</td></tr>`;
    }).join("")}
  </table></section>`).join("");
  return `<div class="welcome"><b>GİZEMLİBOARD.COM'a hoş geldiniz.</b><br>Üye değilseniz üyelik formunu doldurun. Kayıtlı üye iseniz buradan giriş yapın. Eylül 2007 anasayfasındaki bölüm adları duruyor.</div>
    <div class="stats"><span>En son üyemiz: <b>_feza_</b> · arşiv: 1.223 üye, 16.319 konu, 63.923 mesaj</span><span>Bu demoda ${db.users.length} üye, ${db.topics.length} konu, ${db.posts.length} mesaj</span></div>
    ${rows}`;
}

function board(slug) {
  const b = boardOf(slug);
  if (!b) return `<div class="welcome">Bölüm yok.</div>`;
  const list = topicsOf(slug).sort((a, z) => z.pinned - a.pinned || z.last - a.last);
  return `<div class="crumb"><a href="#/">Anasayfa</a> → ${esc(b.cat)} → ${esc(b.name)}</div>
    <section class="cat"><h2>${esc(b.name)}</h2><table>
      <tr><th>Konu</th><th class="num">Cevap</th><th class="num">Bakış</th><th class="last">Son mesaj</th></tr>
      ${list.length ? list.map((t) => `<tr><td><a class="board-name" href="#/t/${t.id}">${t.pinned ? "[sabit] " : ""}${esc(t.title)}</a><div class="desc">${esc(user(t.userId).name)}</div></td><td class="num">${replies(t.id)}</td><td class="num">${t.views}</td><td class="last">${when(t.last)}</td></tr>`).join("") : `<tr><td colspan="4">Bu masada konu yok.</td></tr>`}
    </table></section>
    <div class="crumb"><a class="btn" href="#/yeni?b=${slug}">Yeni konu</a></div>`;
}

function thread(id) {
  const t = db.topics.find((x) => x.id === Number(id));
  if (!t) return `<div class="welcome">Konu yok.</div>`;
  t.views += 1; save();
  const b = boardOf(t.board);
  const u = me();
  const admin = u && u.admin ? `<div class="admin"><button class="btn ghost" data-act="pin" type="button">${t.pinned ? "Sabiti kaldır" : "Sabitle"}</button><button class="btn ghost" data-act="lock" type="button">${t.locked ? "Kilidi aç" : "Kilitle"}</button><button class="btn ghost" data-act="del" type="button">Sil</button></div>` : "";
  const form = t.locked ? `<div class="err">Bu konu kilitli.</div>` : u ? `<form id="reply"><label>Yanıt</label><textarea name="body" required></textarea><button class="btn" type="submit">Gönder</button></form>` : `<div class="err">Yanıt için <a href="#/giris">giriş yap</a>.</div>`;
  return `<div class="crumb"><a href="#/">Anasayfa</a> → <a href="#/b/${t.board}">${esc(b?.name || "")}</a> → ${esc(t.title)}</div>
    <div class="thread">${db.posts.filter((p) => p.topicId === t.id).map((p) => {
      const a = user(p.userId);
      return `<article class="post"><div class="who"><b>${esc(a.name)}</b><span class="rank">${esc(a.rank || "Üye")}</span><div>@${esc(a.username)}</div></div><div class="body"><div class="when">${when(p.created)}</div>${esc(p.body).replace(/\n/g, "<br>")}</div></article>`;
    }).join("")}</div>
    <div class="composer">${admin}${form}</div>`;
}

function compose(pre) {
  if (!me()) return `<div class="welcome">Önce <a href="#/giris">giriş yap</a>.</div>`;
  const opts = db.cats.flatMap((c) => c.boards).map((b) => `<option value="${b[0]}" ${b[0] === pre ? "selected" : ""}>${esc(b[1])}</option>`).join("");
  return `<form class="composer" id="compose"><h2>Yeni konu</h2><label>Bölüm</label><select name="board">${opts}</select><label>Başlık</label><input name="title" required /><label>İleti</label><textarea name="body" required></textarea><button class="btn" type="submit">Konuyu aç</button></form>`;
}

function auth(mode) {
  const reg = mode === "katil";
  return `<form class="auth" id="auth"><h2>${reg ? "Üyelik formu" : "Giriş"}</h2><div class="err" id="err" hidden></div>
    ${reg ? `<label>Görünen ad</label><input name="name" required />` : ""}
    <label>Kullanıcı adı</label><input name="username" required />
    <label>Şifre</label><input name="password" type="password" required />
    <button class="btn" type="submit">${reg ? "Üye ol" : "Giriş yap"}</button>
    <p>${reg ? "" : "Yönetici: admin / GbAdmin2007 · Üye: demo / 123456"}</p></form>`;
}

function search(q) {
  const n = q.trim().toLowerCase();
  const hits = n.length < 2 ? [] : db.topics.filter((t) => t.title.toLowerCase().includes(n) || db.posts.some((p) => p.topicId === t.id && p.body.toLowerCase().includes(n)));
  return `<form class="composer" id="find"><label>Arama</label><input name="q" value="${esc(q)}" /><button class="btn" type="submit">Ara</button></form>
    <section class="cat"><h2>Sonuç</h2><table>${hits.map((t) => `<tr><td><a href="#/t/${t.id}">${esc(t.title)}</a></td></tr>`).join("") || `<tr><td>Eşleşen konu yok.</td></tr>`}</table></section>`;
}

function members() {
  return `<section class="cat"><h2>Üye listesi</h2><table><tr><th>Ad</th><th>Kullanıcı</th><th>Rütbe</th></tr>${db.users.map((u) => `<tr><td>${esc(u.name)}</td><td>${esc(u.username)}</td><td>${esc(u.rank || "Üye")}</td></tr>`).join("")}</table></section>`;
}

function bind() {
  document.getElementById("reply")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = Number(location.hash.split("/")[2]);
    const body = String(new FormData(e.target).get("body") || "").trim();
    if (body.length < 2) return;
    db.posts.push({ id: nextId(db.posts), topicId: id, userId: db.me, body, created: Date.now() });
    const t = db.topics.find((x) => x.id === id);
    if (t) t.last = Date.now();
    save(); route();
  });
  document.getElementById("compose")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const title = String(f.get("title") || "").trim();
    const body = String(f.get("body") || "").trim();
    if (title.length < 3) return;
    const id = nextId(db.topics);
    db.topics.push({ id, board: f.get("board"), userId: db.me, title, pinned: false, locked: false, views: 0, last: Date.now(), created: Date.now() });
    db.posts.push({ id: nextId(db.posts), topicId: id, userId: db.me, body, created: Date.now() });
    save(); location.hash = "#/t/" + id;
  });
  document.getElementById("auth")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const username = String(f.get("username") || "").trim();
    const password = String(f.get("password") || "");
    const err = document.getElementById("err");
    if (location.hash.startsWith("#/katil")) {
      if (db.users.some((u) => u.username.toLowerCase() === username.toLowerCase())) { err.hidden = false; err.textContent = "Bu ad alınmış."; return; }
      const id = nextId(db.users);
      db.users.push({ id, username, password, name: String(f.get("name") || username), rank: "Üye", admin: false });
      db.me = id; save(); location.hash = "#/"; return;
    }
    const found = db.users.find((u) => u.username === username && u.password === password);
    if (!found) { err.hidden = false; err.textContent = "Kullanıcı adı veya şifre uyuşmuyor."; return; }
    db.me = found.id; save(); location.hash = "#/";
  });
  document.getElementById("find")?.addEventListener("submit", (e) => {
    e.preventDefault();
    location.hash = "#/arama/" + encodeURIComponent(new FormData(e.target).get("q") || "");
  });
  document.querySelectorAll("[data-act]").forEach((btn) => btn.addEventListener("click", () => {
    const id = Number(location.hash.split("/")[2]);
    const t = db.topics.find((x) => x.id === id);
    if (!t || !me()?.admin) return;
    const act = btn.getAttribute("data-act");
    if (act === "pin") t.pinned = !t.pinned;
    if (act === "lock") t.locked = !t.locked;
    if (act === "del") { db.topics = db.topics.filter((x) => x.id !== id); db.posts = db.posts.filter((p) => p.topicId !== id); save(); location.hash = "#/"; return; }
    save(); route();
  }));
}

function route() {
  const raw = (location.hash || "#/").slice(1);
  const [path, query] = raw.split("?");
  const parts = path.split("/").filter(Boolean);
  let html = home();
  if (parts[0] === "b") html = board(parts[1]);
  else if (parts[0] === "t") html = thread(parts[1]);
  else if (parts[0] === "yeni") html = compose(new URLSearchParams(query || "").get("b") || "hosgeldiniz");
  else if (parts[0] === "giris") html = auth("giris");
  else if (parts[0] === "katil") html = auth("katil");
  else if (parts[0] === "uyeler") html = members();
  else if (parts[0] === "arama") html = search(decodeURIComponent(parts[1] || ""));
  document.getElementById("app").innerHTML = html;
  chrome();
  bind();
}
window.addEventListener("hashchange", route);
route();
