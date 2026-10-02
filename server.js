const path = require("path");
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const store = require("./store");

const PORT = Number(process.env.PORT || 3000);
const PAGE = 20;
if (!store.userByNick("admin")) store.addUser({ nick: "admin", password_hash: bcrypt.hashSync("admin123", 10), name: "Yönetim", role: "admin", created_at: Date.now() });
if (!store.categories().length) {
  const genel = store.addCategory("GENEL", "Sohbet ve duyuru");
  store.addForum({ category_id: genel, title: "DUYURULAR", description: "Yönetim duyuruları" });
  store.addForum({ category_id: genel, title: "SERBEST KÜRSÜ", description: "Konu sınırı yok" });
  const oyun = store.addCategory("OYUN", "Oyun sohbeti");
  store.addForum({ category_id: oyun, title: "OYUN SOHBETİ", description: "Oyunlar hakkında" });
  store.addForum({ category_id: oyun, title: "YARDIM", description: "Soru ve sorun" });
}

const app = express();
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: process.env.SESSION_SECRET || "gizemliboard-oturum", resave: false, saveUninitialized: false, cookie: { httpOnly: true, sameSite: "lax", maxAge: 1000 * 60 * 60 * 24 * 14 } }));

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => {
  if (c === "&") return "&" + "amp;";
  if (c === "<") return "&" + "lt;";
  if (c === ">") return "&" + "gt;";
  return "&" + "quot;";
});
const when = (t) => t ? new Date(t).toLocaleString("tr-TR") : "";
const me = (req) => req.session.userId ? store.userById(req.session.userId) : null;
const pageNo = (req) => Math.max(1, Number(req.query.sayfa) || 1);
const rank = (u) => u.role === "admin" ? "Yönetici" : u.post_count >= 100 ? "Kıdemli üye" : u.post_count >= 10 ? "Üye" : "Yeni üye";
function bb(s) {
  let t = esc(s);
  t = t.replace(/\[b\]([\s\S]*?)\[\/b\]/gi, "<b>$1</b>").replace(/\[i\]([\s\S]*?)\[\/i\]/gi, "<i>$1</i>").replace(/\[u\]([\s\S]*?)\[\/u\]/gi, "<u>$1</u>");
  t = t.replace(/\[quote\]([\s\S]*?)\[\/quote\]/gi, "<blockquote>$1</blockquote>");
  t = t.replace(/\[url=([^\]]+)\]([\s\S]*?)\[\/url\]/gi, (m, href, label) => `<a href="${esc(href)}" rel="nofollow">${label}</a>`);
  return t.replace(/\n/g, "<br>");
}
function pager(base, page, total) {
  const pages = Math.max(1, Math.ceil(total / PAGE));
  if (pages === 1) return "";
  let html = `<div class="pager">`;
  for (let i = 1; i <= pages; i++) html += `<a class="${i === page ? "on" : ""}" href="${base}${base.includes("?") ? "&" : "?"}sayfa=${i}">${i}</a>`;
  return html + "</div>";
}
function page(req, title, body) {
  const u = me(req);
  const flash = req.session.flash;
  delete req.session.flash;
  const s = store.stats();
  return `<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)} · GizemliBoard</title><link rel="stylesheet" href="/css/forum.css"></head><body><div class="wrap">
    <header class="top"><a class="mark" href="/"><img src="/img/logo.jpg" alt="GizemliBoard"></a><div class="tools">${u ? `${esc(u.name)} · <a href="/yeni">Yeni konu</a> · <a href="/uye/${u.id}">Profil</a> · <form style="display:inline" method="post" action="/cikis"><button>Çıkış</button></form>` : `<a href="/giris">Giriş</a> · <a href="/kayit">Kayıt ol</a>`}</div></header>
    <nav class="nav"><a href="/">Anasayfa</a><a href="/konular">Son konular</a><a href="/uyeler">Üyeler</a><a href="/arama">Arama</a>${u && u.role === "admin" ? `<a href="/yonetim">Yönetim</a>` : ""}</nav>
    ${flash ? `<div class="flash ${flash.ok ? "" : "err"}">${esc(flash.text)}</div>` : ""}${body}
    <footer class="foot">Konu ${s.topics} · Mesaj ${s.posts} · Üye ${s.users}${s.newest ? ` · En yeni: ${esc(s.newest.name)}` : ""}</footer>
  </div></body></html>`;
}
function need(req, res) { if (!me(req)) { req.session.flash = { text: "Önce giriş yap." }; res.redirect("/giris"); return false; } return true; }

app.get("/", (req, res) => {
  const blocks = store.categories().map((c) => {
    const rows = store.forums(c.id).map((f) => {
      const last = store.lastPost(f.id);
      const subs = store.subforums(f.id).map((s) => `<a href="/f/${s.id}">${esc(s.title)}</a>`).join(" · ");
      return `<tr><td><a class="board" href="/f/${f.id}">${esc(f.title)}</a><div class="desc">${esc(f.description)}</div>${subs ? `<div class="subs">Alt forum: ${subs}</div>` : ""}</td><td class="num">${store.countTopics(f.id)}</td><td class="num">${store.countPosts(f.id)}</td><td class="last">${last ? `<a href="/t/${last.topic_id}">${esc(last.title)}</a><div>${esc(last.name)} · ${when(last.created_at)}</div>` : "henüz yok"}</td></tr>`;
    }).join("");
    return `<section class="cat"><h2>${esc(c.title)}</h2><table><tr><th>Forum</th><th class="num">Konu</th><th class="num">Mesaj</th><th class="last">Son mesaj</th></tr>${rows || `<tr><td colspan="4">Forum yok.</td></tr>`}</table></section>`;
  }).join("");
  res.send(page(req, "Anasayfa", blocks || `<div class="flash">Kategori yok.</div>`));
});

app.get("/f/:id", (req, res) => {
  const f = store.forum(req.params.id);
  if (!f) return res.status(404).send(page(req, "Yok", `<div class="flash err">Forum yok.</div>`));
  const cat = store.category(f.category_id);
  const pageN = pageNo(req);
  const list = store.topics(f.id, pageN, PAGE);
  const rows = list.rows.map((t) => `<tr><td><a class="board" href="/t/${t.id}">${t.pinned ? "[sabit] " : ""}${t.locked ? "[kilit] " : ""}${esc(t.title)}</a><div class="desc">${esc(t.name)}</div></td><td class="num">${t.replies}</td><td class="num">${t.views}</td><td class="last">${t.last ? `${esc(t.last.name)}<div>${when(t.last.created_at)}</div>` : ""}</td></tr>`).join("");
  const subs = store.subforums(f.id);
  const sub = subs.length ? `<section class="cat"><h2>Alt forumlar</h2><table>${subs.map((s) => `<tr><td><a class="board" href="/f/${s.id}">${esc(s.title)}</a><div class="desc">${esc(s.description)}</div></td></tr>`).join("")}</table></section>` : "";
  res.send(page(req, f.title, `<div class="crumb"><a href="/">Anasayfa</a> → ${esc(cat?.title || "")} → ${esc(f.title)}</div>${sub}<section class="cat"><h2>${esc(f.title)}</h2><table><tr><th>Konu</th><th class="num">Yanıt</th><th class="num">Bakış</th><th class="last">Son mesaj</th></tr>${rows || `<tr><td colspan="4">Konu yok.</td></tr>`}</table></section>${pager("/f/" + f.id, pageN, list.total)}<div class="crumb"><a class="btn" href="/yeni?f=${f.id}">Yeni konu</a></div>`));
});

app.get("/t/:id", (req, res) => {
  const t = store.topic(req.params.id);
  if (!t) return res.status(404).send(page(req, "Yok", `<div class="flash err">Konu yok.</div>`));
  store.bumpViews(t.id);
  const f = store.forum(t.forum_id);
  const pageN = pageNo(req);
  const list = store.posts(t.id, pageN, PAGE);
  const u = me(req);
  const posts = list.rows.map((p) => `<article class="post"><div class="who"><b><a href="/uye/${p.user_id}">${esc(p.name)}</a></b><div class="rank">${esc(rank(p))}</div><div>@${esc(p.nick)}</div><div>Mesaj: ${p.post_count}</div><div>Kayıt: ${when(p.joined).slice(0, 10)}</div></div><div class="body"><div class="when">#${p.n} · ${when(p.created_at)} · <a href="/t/${t.id}/yanit?alinti=${p.id}">Alıntı</a>${u && (u.id === p.user_id || u.role === "admin") ? ` · <a href="/duzenle/${p.id}">Düzenle</a>` : ""}</div>${bb(p.body)}</div></article>`).join("");
  const reply = t.locked && !(u && u.role === "admin") ? `<div class="flash err">Bu konu kilitli.</div>` : u ? `<form class="box" method="post" action="/t/${t.id}/yanit"><label>Yanıt</label><textarea name="body" required></textarea><button class="btn">Gönder</button></form>` : `<div class="flash">Yanıt için <a href="/giris">giriş yap</a>.</div>`;
  const admin = u && u.role === "admin" ? `<form method="post" action="/t/${t.id}/yonet"><button class="btn ghost" name="act" value="pin">${t.pinned ? "Sabiti kaldır" : "Sabitle"}</button><button class="btn ghost" name="act" value="lock">${t.locked ? "Kilidi aç" : "Kilitle"}</button><button class="btn ghost" name="act" value="del">Sil</button></form>` : "";
  res.send(page(req, t.title, `<div class="crumb"><a href="/">Anasayfa</a> → <a href="/f/${f?.id || ""}">${esc(f?.title || "")}</a> → ${esc(t.title)}</div><section class="cat"><h2>${esc(t.title)}</h2>${posts}</section>${pager("/t/" + t.id, pageN, list.total)}${admin}${reply}`));
});

app.get("/t/:id/yanit", (req, res) => {
  if (!need(req, res)) return;
  const post = store.post(req.query.alinti);
  const quote = post ? `[quote]${post.body}[/quote]\n` : "";
  res.send(page(req, "Yanıt", `<form class="box" method="post" action="/t/${req.params.id}/yanit"><h2>Yanıt</h2><textarea name="body" required>${esc(quote)}</textarea><button class="btn">Gönder</button></form>`));
});
app.post("/t/:id/yanit", (req, res) => {
  if (!need(req, res)) return;
  const t = store.topic(req.params.id);
  const u = me(req);
  if (!t) return res.redirect("/");
  if (t.locked && u.role !== "admin") return res.redirect("/t/" + t.id);
  const body = String(req.body.body || "").trim();
  if (body.length < 2) { req.session.flash = { text: "Yanıt çok kısa." }; return res.redirect("/t/" + t.id); }
  const now = Date.now();
  store.addPost({ topic_id: t.id, user_id: u.id, body, created_at: now });
  store.setTopic(t.id, { updated_at: now });
  res.redirect("/t/" + t.id);
});
app.post("/t/:id/yonet", (req, res) => {
  const u = me(req);
  const t = store.topic(req.params.id);
  if (!u || u.role !== "admin" || !t) return res.redirect("/");
  if (req.body.act === "pin") store.setTopic(t.id, { pinned: t.pinned ? 0 : 1 });
  if (req.body.act === "lock") store.setTopic(t.id, { locked: t.locked ? 0 : 1 });
  if (req.body.act === "del") { store.deleteTopic(t.id); return res.redirect("/f/" + t.forum_id); }
  res.redirect("/t/" + t.id);
});
app.get("/duzenle/:id", (req, res) => {
  const p = store.post(req.params.id);
  const u = me(req);
  if (!p || !u || (u.id !== p.user_id && u.role !== "admin")) return res.redirect("/");
  res.send(page(req, "Düzenle", `<form class="box" method="post" action="/duzenle/${p.id}"><h2>İletiyi düzenle</h2><textarea name="body" required>${esc(p.body)}</textarea><button class="btn">Kaydet</button></form>`));
});
app.post("/duzenle/:id", (req, res) => {
  const p = store.post(req.params.id);
  const u = me(req);
  if (!p || !u || (u.id !== p.user_id && u.role !== "admin")) return res.redirect("/");
  store.setPost(p.id, String(req.body.body || "").trim());
  res.redirect("/t/" + p.topic_id);
});
app.get("/yeni", (req, res) => {
  if (!need(req, res)) return;
  const forums = store.allForums();
  const selected = Number(req.query.f || forums[0]?.id || 0);
  res.send(page(req, "Yeni konu", `<form class="box" method="post" action="/yeni"><h2>Yeni konu</h2><label>Forum</label><select name="forum">${forums.map((f) => `<option value="${f.id}" ${f.id === selected ? "selected" : ""}>${esc(f.title)}</option>`).join("")}</select><label>Başlık</label><input name="title" required maxlength="120"><label>İleti</label><textarea name="body" required></textarea><div class="desc">[b]kalın[/b] [i]eğik[/i] [quote]alıntı[/quote]</div><button class="btn">Konuyu aç</button></form>`));
});
app.post("/yeni", (req, res) => {
  if (!need(req, res)) return;
  const title = String(req.body.title || "").trim();
  const body = String(req.body.body || "").trim();
  const forum = store.forum(req.body.forum);
  if (!forum || title.length < 3 || body.length < 2) { req.session.flash = { text: "Başlık ve ileti gerekli." }; return res.redirect("/yeni"); }
  const now = Date.now();
  const id = store.addTopic({ forum_id: forum.id, user_id: req.session.userId, title, created_at: now, updated_at: now });
  store.addPost({ topic_id: id, user_id: req.session.userId, body, created_at: now });
  res.redirect("/t/" + id);
});
app.get("/konular", (req, res) => {
  const all = store.latest();
  res.send(page(req, "Son konular", `<section class="cat"><h2>Son konular</h2><table>${all.map((t) => `<tr><td><a class="board" href="/t/${t.id}">${esc(t.title)}</a></td><td class="last">${when(t.updated_at)}</td></tr>`).join("") || `<tr><td>Konu yok.</td></tr>`}</table></section>`));
});
app.get("/giris", (req, res) => res.send(page(req, "Giriş", `<form class="box" method="post" action="/giris"><h2>Giriş</h2><label>Nick</label><input name="nick" required><label>Şifre</label><input name="password" type="password" required><button class="btn">Giriş yap</button></form>`)));
app.post("/giris", (req, res) => {
  const user = store.userByNick(String(req.body.nick || "").trim());
  if (!user || !bcrypt.compareSync(String(req.body.password || ""), user.password_hash)) { req.session.flash = { text: "Nick veya şifre uyuşmuyor." }; return res.redirect("/giris"); }
  req.session.userId = user.id;
  res.redirect("/");
});
app.get("/kayit", (req, res) => res.send(page(req, "Kayıt", `<form class="box" method="post" action="/kayit"><h2>Kayıt ol</h2><label>Görünen ad</label><input name="name" required maxlength="40"><label>Nick</label><input name="nick" required maxlength="24"><label>Şifre</label><input name="password" type="password" required minlength="6"><button class="btn">Üye ol</button></form>`)));
app.post("/kayit", (req, res) => {
  const nick = String(req.body.nick || "").trim();
  const name = String(req.body.name || "").trim();
  const password = String(req.body.password || "");
  if (!/^[a-zA-Z0-9_.]{3,24}$/.test(nick) || name.length < 2 || password.length < 6) { req.session.flash = { text: "Nick 3-24 karakter. Şifre en az 6." }; return res.redirect("/kayit"); }
  if (store.userByNick(nick)) { req.session.flash = { text: "Bu nick alınmış." }; return res.redirect("/kayit"); }
  req.session.userId = store.addUser({ nick, password_hash: bcrypt.hashSync(password, 10), name, created_at: Date.now() });
  res.redirect("/");
});
app.post("/cikis", (req, res) => req.session.destroy(() => res.redirect("/")));
app.get("/uyeler", (req, res) => res.send(page(req, "Üyeler", `<section class="cat"><h2>Üyeler</h2><table><tr><th>Ad</th><th>Nick</th><th>Rütbe</th><th class="num">Mesaj</th><th class="last">Kayıt</th></tr>${store.users().map((u) => `<tr><td><a href="/uye/${u.id}">${esc(u.name)}</a></td><td>@${esc(u.nick)}</td><td>${esc(rank(u))}</td><td class="num">${u.posts}</td><td class="last">${when(u.created_at)}</td></tr>`).join("")}</table></section>`)));
app.get("/uye/:id", (req, res) => {
  const u = store.userById(req.params.id);
  if (!u) return res.status(404).send(page(req, "Yok", `<div class="flash err">Üye yok.</div>`));
  const self = me(req);
  const pass = self && self.id === u.id ? `<form class="box" method="post" action="/sifre"><h2>Şifre değiştir</h2><input name="password" type="password" required minlength="6"><button class="btn">Kaydet</button></form>` : "";
  res.send(page(req, u.name, `<section class="cat"><h2>${esc(u.name)}</h2><div class="desc" style="padding:8px">@${esc(u.nick)} · ${esc(rank(u))} · Mesaj ${u.posts} · Kayıt ${when(u.created_at)}</div><table>${store.userTopics(u.id).map((t) => `<tr><td><a href="/t/${t.id}">${esc(t.title)}</a></td></tr>`).join("") || `<tr><td>Konu yok.</td></tr>`}</table></section>${pass}`));
});
app.post("/sifre", (req, res) => { const u = me(req); if (!u) return res.redirect("/giris"); store.setPassword(u.id, bcrypt.hashSync(String(req.body.password || ""), 10)); res.redirect("/uye/" + u.id); });
app.get("/arama", (req, res) => {
  const q = String(req.query.q || "").trim();
  const hits = q.length < 2 ? [] : store.search(q);
  res.send(page(req, "Arama", `<form class="box" method="get" action="/arama"><h2>Arama</h2><input name="q" value="${esc(q)}"><button class="btn">Ara</button></form><section class="cat"><h2>Sonuç</h2><table>${hits.map((t) => `<tr><td><a href="/t/${t.id}">${esc(t.title)}</a></td></tr>`).join("") || `<tr><td>Eşleşme yok.</td></tr>`}</table></section>`));
});
app.get("/yonetim", (req, res) => {
  const u = me(req);
  if (!u || u.role !== "admin") return res.redirect("/");
  res.send(page(req, "Yönetim", `<form class="box" method="post" action="/yonetim/kategori"><h2>Kategori ekle</h2><input name="title" required placeholder="Kategori adı"><input name="description" placeholder="Açıklama"><button class="btn">Ekle</button></form><form class="box" method="post" action="/yonetim/forum"><h2>Forum ekle</h2><label>Kategori</label><select name="category">${store.categories().map((c) => `<option value="${c.id}">${esc(c.title)}</option>`).join("")}</select><label>Üst forum, boşsa ana forum</label><select name="parent"><option value="0">Yok</option>${store.allForums().map((f) => `<option value="${f.id}">${esc(f.title)}</option>`).join("")}</select><input name="title" required placeholder="Forum adı"><input name="description" placeholder="Açıklama"><button class="btn">Ekle</button></form>`));
});
app.post("/yonetim/kategori", (req, res) => { const u = me(req); if (!u || u.role !== "admin") return res.redirect("/"); store.addCategory(String(req.body.title || "").trim(), String(req.body.description || "").trim()); res.redirect("/"); });
app.post("/yonetim/forum", (req, res) => { const u = me(req); if (!u || u.role !== "admin") return res.redirect("/"); store.addForum({ category_id: Number(req.body.category), parent_id: Number(req.body.parent) || 0, title: String(req.body.title || "").trim(), description: String(req.body.description || "").trim() }); res.redirect("/"); });
app.use((req, res) => res.status(404).send(page(req, "Yok", `<div class="flash err">Sayfa yok.</div>`)));
app.listen(PORT, () => console.log("GizemliBoard http://localhost:" + PORT));
