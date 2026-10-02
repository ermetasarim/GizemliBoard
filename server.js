const path = require("path");
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const store = require("./store");

const PORT = Number(process.env.PORT || 3000);
if (!store.userByNick("admin")) {
  store.addUser({ nick: "admin", password_hash: bcrypt.hashSync("admin123", 10), name: "Yönetim", role: "admin", created_at: Date.now() });
}
if (!store.categories().length) {
  [["GENEL", "Serbest konuşma"], ["DUYURU", "Yönetim duyuruları"], ["OYUN", "Oyun sohbeti"], ["YARDIM", "Soru ve sorun"]].forEach((row, i) => store.addCategory(row[0], row[1], i + 1));
}

const app = express();
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
  secret: process.env.SESSION_SECRET || "gizemliboard-oturum",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "lax", maxAge: 1000 * 60 * 60 * 24 * 14 }
}));

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => {
  if (c === "&") return "&" + "amp;";
  if (c === "<") return "&" + "lt;";
  if (c === ">") return "&" + "gt;";
  return "&" + "quot;";
});
const when = (t) => new Date(t).toLocaleString("tr-TR");
const me = (req) => (req.session.userId ? store.userById(req.session.userId) : null);
const counts = (topicId) => store.countReplies(topicId);

function page(req, title, body) {
  const u = me(req);
  const flash = req.session.flash;
  delete req.session.flash;
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)} · GizemliBoard</title>
  <link rel="stylesheet" href="/css/forum.css">
</head>
<body>
  <div class="wrap">
    <header class="top">
      <a class="mark" href="/"><img src="/img/logo.jpg" alt="GizemliBoard"></a>
      <div class="tools">${u
        ? `${esc(u.name)} · <a href="/yeni">Yeni konu</a> · <form style="display:inline" method="post" action="/cikis"><button type="submit">Çıkış</button></form>`
        : `<a href="/giris">Giriş</a> · <a href="/kayit">Kayıt ol</a>`}</div>
    </header>
    <nav class="nav">
      <a href="/">Anasayfa</a>
      <a href="/kategoriler">Kategoriler</a>
      <a href="/konular">Konular</a>
      <a href="/uyeler">Üyeler</a>
      <a href="/arama">Arama</a>
    </nav>
    ${flash ? `<div class="flash ${flash.ok ? "" : "err"}">${esc(flash.text)}</div>` : ""}
    ${body}
    <footer class="foot">GizemliBoard · kayıtlar data/forum.json dosyasında durur.</footer>
  </div>
</body>
</html>`;
}

function needUser(req, res) {
  if (!me(req)) {
    req.session.flash = { text: "Önce giriş yap." };
    res.redirect("/giris");
    return false;
  }
  return true;
}

app.get("/", (req, res) => {
  const cats = store.categories();
  const rows = cats.map((c) => {
    const topics = store.countTopics(c.id);
    const posts = store.countPosts(c.id);
    const last = store.lastTopic(c.id);
    return `<tr>
      <td><a class="board" href="/k/${c.id}">${esc(c.title)}</a><div class="desc">${esc(c.description)}</div></td>
      <td class="num">${topics}</td>
      <td class="num">${posts}</td>
      <td class="last">${last ? `<a href="/t/${last.id}">${esc(last.title)}</a><div>${esc(last.name)} · ${when(last.updated_at)}</div>` : "henüz yok"}</td>
    </tr>`;
  }).join("");
  res.send(page(req, "Anasayfa", `<section class="cat"><h2>Kategoriler</h2><table>
    <tr><th>Kategori</th><th class="num">Konu</th><th class="num">Mesaj</th><th class="last">Son</th></tr>
    ${rows || `<tr><td colspan="4">Kategori yok.</td></tr>`}
  </table></section>`));
});

app.get("/kategoriler", (req, res) => res.redirect("/"));

app.get("/k/:id", (req, res) => {
  const c = store.category(req.params.id);
  if (!c) return res.status(404).send(page(req, "Yok", `<div class="flash err">Kategori yok.</div>`));
  const topics = store.topicsIn(c.id);
  const rows = topics.map((t) => `<tr>
    <td><a class="board" href="/t/${t.id}">${t.pinned ? "[sabit] " : ""}${t.locked ? "[kilit] " : ""}${esc(t.title)}</a><div class="desc">${esc(t.name)}</div></td>
    <td class="num">${Math.max(0, counts(t.id) - 1)}</td>
    <td class="num">${t.views}</td>
    <td class="last">${when(t.updated_at)}</td>
  </tr>`).join("");
  res.send(page(req, c.title, `<div class="crumb"><a href="/">Anasayfa</a> → ${esc(c.title)}</div>
    <section class="cat"><h2>${esc(c.title)}</h2><div class="desc" style="padding:6px 10px">${esc(c.description)}</div>
    <table><tr><th>Konu</th><th class="num">Yanıt</th><th class="num">Bakış</th><th class="last">Son</th></tr>
    ${rows || `<tr><td colspan="4">Bu kategoride konu yok.</td></tr>`}</table></section>
    <div class="crumb"><a class="btn" href="/yeni?k=${c.id}">Yeni konu</a></div>`));
});

app.get("/konular", (req, res) => {
  const topics = store.recentTopics();
  res.send(page(req, "Konular", `<section class="cat"><h2>Konular</h2><table>
    <tr><th>Konu</th><th>Kategori</th><th class="last">Son</th></tr>
    ${topics.map((t) => `<tr><td><a class="board" href="/t/${t.id}">${esc(t.title)}</a><div class="desc">${esc(t.name)}</div></td><td><a href="/k/${t.category_id}">${esc(t.category)}</a></td><td class="last">${when(t.updated_at)}</td></tr>`).join("") || `<tr><td colspan="3">Konu yok.</td></tr>`}
  </table></section>`));
});

app.get("/t/:id", (req, res) => {
  const t = store.topic(req.params.id);
  if (!t) return res.status(404).send(page(req, "Yok", `<div class="flash err">Konu yok.</div>`));
  store.bumpViews(t.id);
  const posts = store.posts(t.id);
  const u = me(req);
  const reply = t.locked && !(u && u.role === "admin")
    ? `<div class="flash err">Bu konu kilitli.</div>`
    : u
      ? `<form class="box" method="post" action="/t/${t.id}/yanit"><label>Yanıt</label><textarea name="body" required></textarea><button class="btn" type="submit">Gönder</button></form>`
      : `<div class="flash">Yanıt için <a href="/giris">giriş yap</a>.</div>`;
  const admin = u && u.role === "admin" ? `<form method="post" action="/t/${t.id}/yonet" style="display:inline">
      <button class="btn ghost" name="act" value="pin">${t.pinned ? "Sabiti kaldır" : "Sabitle"}</button>
      <button class="btn ghost" name="act" value="lock">${t.locked ? "Kilidi aç" : "Kilitle"}</button>
      <button class="btn ghost" name="act" value="del">Konuyu sil</button>
    </form>` : "";
  res.send(page(req, t.title, `<div class="crumb"><a href="/">Anasayfa</a> → <a href="/k/${t.category_id}">${esc(t.category)}</a> → ${esc(t.title)}</div>
    <section class="cat"><h2>${esc(t.title)}</h2>
      ${posts.map((p) => `<article class="post"><div class="who"><b><a href="/uye/${p.user_id}">${esc(p.name)}</a></b><div class="rank">${esc(p.role)}</div><div>@${esc(p.nick)}</div></div><div class="body"><div class="when">${when(p.created_at)}</div>${esc(p.body)}</div></article>`).join("")}
    </section>
    ${admin}${reply}`));
});

app.post("/t/:id/yanit", (req, res) => {
  if (!needUser(req, res)) return;
  const t = store.topic(req.params.id);
  const u = me(req);
  if (!t) return res.redirect("/");
  if (t.locked && u.role !== "admin") {
    req.session.flash = { text: "Konu kilitli." };
    return res.redirect("/t/" + t.id);
  }
  const body = String(req.body.body || "").trim();
  if (body.length < 2) {
    req.session.flash = { text: "Yanıt çok kısa." };
    return res.redirect("/t/" + t.id);
  }
  const now = Date.now();
  store.addPost({ topic_id: t.id, user_id: u.id, body, created_at: now });
  store.setTopic(t.id, { updated_at: now });
  res.redirect("/t/" + t.id);
});

app.post("/t/:id/yonet", (req, res) => {
  const u = me(req);
  if (!u || u.role !== "admin") return res.redirect("/");
  const t = store.topic(req.params.id);
  if (!t) return res.redirect("/");
  if (req.body.act === "pin") store.setTopic(t.id, { pinned: t.pinned ? 0 : 1 });
  if (req.body.act === "lock") store.setTopic(t.id, { locked: t.locked ? 0 : 1 });
  if (req.body.act === "del") {
    store.deleteTopic(t.id);
    req.session.flash = { ok: true, text: "Konu silindi." };
    return res.redirect("/k/" + t.category_id);
  }
  res.redirect("/t/" + t.id);
});

app.get("/yeni", (req, res) => {
  if (!needUser(req, res)) return;
  const cats = store.categories();
  const selected = Number(req.query.k || cats[0]?.id || 0);
  res.send(page(req, "Yeni konu", `<form class="box" method="post" action="/yeni"><h2>Yeni konu</h2>
    <label>Kategori</label><select name="category">${cats.map((c) => `<option value="${c.id}" ${c.id === selected ? "selected" : ""}>${esc(c.title)}</option>`).join("")}</select>
    <label>Başlık</label><input name="title" required maxlength="120">
    <label>İleti</label><textarea name="body" required></textarea>
    <button class="btn" type="submit">Konuyu aç</button>
  </form>`));
});

app.post("/yeni", (req, res) => {
  if (!needUser(req, res)) return;
  const title = String(req.body.title || "").trim();
  const body = String(req.body.body || "").trim();
  const category = store.category(req.body.category);
  if (!category || title.length < 3 || body.length < 2) {
    req.session.flash = { text: "Başlık ve ileti gerekli." };
    return res.redirect("/yeni");
  }
  const now = Date.now();
  const info = { lastInsertRowid: store.addTopic({ category_id: category.id, user_id: req.session.userId, title, created_at: now, updated_at: now }) };
  store.addPost({ topic_id: info.lastInsertRowid, user_id: req.session.userId, body, created_at: now });
  res.redirect("/t/" + info.lastInsertRowid);
});

app.get("/giris", (req, res) => {
  res.send(page(req, "Giriş", `<form class="box" method="post" action="/giris"><h2>Giriş</h2>
    <label>Nick</label><input name="nick" required>
    <label>Şifre</label><input name="password" type="password" required>
    <button class="btn" type="submit">Giriş yap</button>
  </form>`));
});

app.post("/giris", (req, res) => {
  const user = store.userByNick(String(req.body.nick || "").trim());
  if (!user || !bcrypt.compareSync(String(req.body.password || ""), user.password_hash)) {
    req.session.flash = { text: "Nick veya şifre uyuşmuyor." };
    return res.redirect("/giris");
  }
  req.session.userId = user.id;
  res.redirect("/");
});

app.get("/kayit", (req, res) => {
  res.send(page(req, "Kayıt", `<form class="box" method="post" action="/kayit"><h2>Kayıt ol</h2>
    <label>Görünen ad</label><input name="name" required maxlength="40">
    <label>Nick</label><input name="nick" required maxlength="24">
    <label>Şifre</label><input name="password" type="password" required minlength="6">
    <button class="btn" type="submit">Üye ol</button>
  </form>`));
});

app.post("/kayit", (req, res) => {
  const nick = String(req.body.nick || "").trim();
  const name = String(req.body.name || "").trim();
  const password = String(req.body.password || "");
  if (!/^[a-zA-Z0-9_.]{3,24}$/.test(nick) || name.length < 2 || password.length < 6) {
    req.session.flash = { text: "Nick 3-24 harf, rakam, alt çizgi. Şifre en az 6 karakter." };
    return res.redirect("/kayit");
  }
  if (store.userByNick(nick)) {
    req.session.flash = { text: "Bu nick alınmış." };
    return res.redirect("/kayit");
  }
  const info = { lastInsertRowid: store.addUser({ nick, password_hash: bcrypt.hashSync(password, 10), name, created_at: Date.now() }) };
  req.session.userId = Number(info.lastInsertRowid);
  req.session.flash = { ok: true, text: "Üyelik açıldı." };
  res.redirect("/");
});

app.post("/cikis", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

app.get("/uyeler", (req, res) => {
  const users = store.users();
  res.send(page(req, "Üyeler", `<section class="cat"><h2>Üyeler</h2><table>
    <tr><th>Ad</th><th>Nick</th><th>Rütbe</th><th class="last">Kayıt</th></tr>
    ${users.map((u) => `<tr><td><a href="/uye/${u.id}">${esc(u.name)}</a></td><td>@${esc(u.nick)}</td><td>${esc(u.role)}</td><td class="last">${when(u.created_at)}</td></tr>`).join("")}
  </table></section>`));
});

app.get("/uye/:id", (req, res) => {
  const u = store.userById(req.params.id);
  if (!u) return res.status(404).send(page(req, "Yok", `<div class="flash err">Üye yok.</div>`));
  const topics = store.userTopics(u.id);
  const self = me(req);
  const pass = self && self.id === u.id ? `<form class="box" method="post" action="/sifre"><h2>Şifre değiştir</h2><label>Yeni şifre</label><input name="password" type="password" required minlength="6"><button class="btn" type="submit">Kaydet</button></form>` : "";
  res.send(page(req, u.name, `<div class="crumb"><a href="/uyeler">Üyeler</a> → ${esc(u.name)}</div>
    <section class="cat"><h2>${esc(u.name)}</h2><div class="desc" style="padding:8px 10px">@${esc(u.nick)} · ${esc(u.role)} · ${when(u.created_at)}</div>
    <table>${topics.map((t) => `<tr><td><a href="/t/${t.id}">${esc(t.title)}</a></td></tr>`).join("") || `<tr><td>Konu yok.</td></tr>`}</table></section>${pass}`));
});

app.post("/sifre", (req, res) => {
  const u = me(req);
  if (!u) return res.redirect("/giris");
  const password = String(req.body.password || "");
  if (password.length < 6) {
    req.session.flash = { text: "Şifre en az 6 karakter." };
    return res.redirect("/uye/" + u.id);
  }
  store.setPassword(u.id, bcrypt.hashSync(password, 10));
  req.session.flash = { ok: true, text: "Şifre değişti." };
  res.redirect("/uye/" + u.id);
});

app.get("/arama", (req, res) => {
  const q = String(req.query.q || "").trim();
  const hits = q.length < 2 ? [] : store.search(q);
  res.send(page(req, "Arama", `<form class="box" method="get" action="/arama"><h2>Arama</h2><input name="q" value="${esc(q)}"><button class="btn" type="submit">Ara</button></form>
    <section class="cat"><h2>Sonuç</h2><table>${hits.map((t) => `<tr><td><a href="/t/${t.id}">${esc(t.title)}</a></td></tr>`).join("") || `<tr><td>Eşleşme yok.</td></tr>`}</table></section>`));
});

app.use((req, res) => res.status(404).send(page(req, "Yok", `<div class="flash err">Sayfa yok.</div>`)));

app.listen(PORT, () => {
  console.log("GizemliBoard http://localhost:" + PORT);
});
