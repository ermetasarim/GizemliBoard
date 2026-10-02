const KEY = "gizemliboard-v3";
const dt = (y, m, d, h, min) => new Date(y, m - 1, d, h, min).getTime();

const sub = (slug, name, topics, posts) => ({ slug, name, desc: "", archiveTopics: topics || 0, archivePosts: posts || 0 });
const board = (slug, name, desc, topics, posts, subs) => ({ slug, name, desc, archiveTopics: topics, archivePosts: posts, subs: subs || [] });

const seed = () => ({
  me: null,
  users: [
    { id: 1, username: "admin", password: "GbAdmin2007", name: "Yönetim", rank: "Admin", admin: true },
    { id: 2, username: "demo", password: "123456", name: "Kardesturk", rank: "Üye", admin: false },
    { id: 3, username: "weled", password: "123456", name: "ฬΣLéⓓ™", rank: "Üye", admin: false },
    { id: 4, username: "real", password: "123456", name: "Real", rank: "Üye", admin: false },
    { id: 5, username: "olumcul", password: "123456", name: "Ölümcül_Yarış", rank: "Üye", admin: false },
    { id: 6, username: "kajmeroloji", password: "123456", name: "Kajmeroloji", rank: "Üye", admin: false },
    { id: 7, username: "rapchi", password: "123456", name: "RapchiSheqeR", rank: "Üye", admin: false },
    { id: 8, username: "ashilles", password: "123456", name: "Ashilles", rank: "Üye", admin: false },
    { id: 9, username: "burakhayta", password: "123456", name: "burakhayta", rank: "Üye", admin: false },
    { id: 10, username: "ademsencer", password: "123456", name: "ademsencer", rank: "Üye", admin: false },
    { id: 11, username: "ataturk", password: "123456", name: "Atatürk*", rank: "Üye", admin: false },
    { id: 12, username: "yaban", password: "123456", name: "YABAN", rank: "Üye", admin: false },
    { id: 13, username: "macleod", password: "123456", name: "MacleoD", rank: "Üye", admin: false },
    { id: 14, username: "kzd2", password: "123456", name: "kzd2\"", rank: "Üye", admin: false }
  ],
  cats: [
    { title: "GizemliBoard Hakkında", boards: [
      board("duyuru", "GizemliBoard Duyurular&Kurallar", "Forum hakkında tum duyuru ve kurallar", 10, 19),
      board("yarisma", "GizemliBoard Yarışmalar", "GizemliBoard Yarışmaları ile ilgili son sürat bilgi", 9, 38),
      board("oneri", "Öneri, Şikayet, Soru ve Sorunlarınız", "Her türlü önerinizi veya şikayetinizi yönetime buradan iletebilirsiniz", 1, 2),
      board("kutlama", "Kutlama ve Duyurularınız", "Kullanıcılar arası duyurular, doğum günü kutlamaları, diger özel gün ve gecelerle ilgili duyuru ve kutlamalarıda bu başlık altında yapabilirsiniz.", 3, 18),
      board("tanitin", "Kendinizi Tanıtın", "Pişşt sen yenisin galiba:)", 12, 66)
    ]},
    { title: "Genel", boards: [
      board("vatan", "Vatan TC", "", 23, 37, [
        sub("ataturk-kosesi", "Mustafa Kemal ATATÜRK", 18, 21),
        sub("osmanli", "Osmalı Tarihi", 3, 13),
        sub("cennet", "Cennet Ülkemizden Resimler", 2, 3),
        sub("yoreler", "Yöreler Ve Kültürümüz", 0, 0)
      ]),
      board("ulkeler", "Ülkeler Tarihi", "Tüm Ülkelerin Tarihleri ve Resimleri", 1, 1),
      board("kultur", "Genel Kültür", "", 19, 19, [
        sub("kultur-sanat", "Kültür & Sanat", 19, 19),
        sub("sinema-tiyatro", "Sinema & Tiyatro", 0, 0),
        sub("biyografi", "Biyografiler", 0, 0),
        sub("mitoloji", "Mitolojiler", 0, 0),
        sub("edebiyat", "Edebiyat & Felsefe", 0, 0)
      ]),
      board("haber", "Güncel Haberler", "Güncel Konu ve Haberleri Paylaşabileceğiniz Alan!", 10, 12),
      board("hertelden", "Her Telden", "", 861, 893, [
        sub("ruya", "Rüya Tabirleri", 85, 85),
        sub("teknoloji", "Teknoloji & Bilim", 0, 0),
        sub("efsane", "Efsaneler & Garip Olaylar", 11, 20),
        sub("saglik", "Sağlık", 0, 0),
        sub("motor", "Motorlu Araçlar & Modifiye", 3, 5),
        sub("kursu", "Serbest Kürsü", 762, 783)
      ])
    ]},
    { title: "Eglence - Sohbet", boards: [
      board("anket", "GizemliBoard Anket", "GizemliBoard Anketleri Açabileceğiniz Alan", 3, 15),
      board("muhabbet", "[GB]Muhabbet Cafe", "Hem geyik Hem muhabbet:)", 1, 5),
      board("merak", "Merak Ettikleriniz", "Meraklısına ;)", 2, 2),
      board("bilmece", "Bilmece Ve Bulmacalar", "Bilmece Ve Bulmacalar Birbirinize Sorabileceğiniz Alan", 2, 2),
      board("fan", "Fan Clup", "Hayranı Olduğunuz Kişilerin Fan Clup Açabilirsiniz", 2, 6),
      board("fikra", "Fıkralar Ve Komik Yazılar", "GizemliBoard Ailesi Olarak Biraz Gülmeye Ne Dersiniz :)", 59, 61),
      board("itiraf", "Kişisel İtiraflar", "Her Türlü İtiraflarınızı Buradan Paylaşabilirsiniz(Kırıcı Olmadan)", 1, 1),
      board("hobi", "Hobiler & Fobiler", "Hobi ve Fobilerimizi Paylaşalım", 3, 5)
    ]},
    { title: "Gizemli Board", boards: [
      board("dergi", "Dergi", "Aylık(?) Kültür(?) Yaşam(?) Magazin(?) Dergisi", 1, 1),
      board("roportaj", "Röportaj", "Üyelerle Röportajlar ;)", 1, 1),
      board("radyo", "Radyo", "", 1, 1),
      board("magazin", "Magazin", "Forumda neler oluyor, son dakika haberleri", 0, 0),
      board("sorgu", "Sorgu Odası", "Sorgulamaya ve sorgulanmaya hazırmısınız ?", 1, 1),
      board("sehir", "Sehir", "Buyrun sizinde bir yapıtınız olsun :)", 1, 4),
      board("gunluk", "Günlük", "Sanal Günlügünüz", 0, 0),
      board("sozluk", "Sözlük", "Güncel kelimeler ve yorumlarınız", 0, 0),
      board("takvim", "Takvim", "Tarihte Bugün", 0, 0)
    ]},
    { title: "Resim - Sarkı Sözleri", boards: [
      board("resim", "Resim Ve Wallpapers Galeri", "Resim Ve Wallpapersleri Burada Bulabilirsiniz", 25, 30, [
        sub("korku", "Korku-Gerilim +18", 0, 0),
        sub("masaustu", "Masaüstü - Wallpapers", 0, 0),
        sub("dini-resim", "Dini Resim", 0, 0),
        sub("komik-resim", "Komik Resimler", 15, 15),
        sub("ulke-resim", "Ülkelerden Resimler", 1, 1),
        sub("manzara", "Manzara-Doğa Resimleri", 7, 12),
        sub("konu-disi", "Konu Dışı Resimler", 2, 2)
      ]),
      board("muzik", "Müzik - Şarkı Sözleri ( Lyrics )", "Son çıkan albümler , çıkacak olan albümler , Müzik Sohbet , Yerli Yabancı Şarkı Sözleri", 54, 69, [
        sub("tr-sarki", "Türkçe Şarkı Sözleri", 47, 58),
        sub("yb-sarki", "Yabancı Şarkı Sözleri", 7, 11),
        sub("muzik-sohbet", "Müzik Sohbet", 0, 0),
        sub("album", "Albüm Tanıtımları", 0, 0)
      ])
    ]},
    { title: "Tv Dizileri - Sinema - Video", boards: [
      board("diziler", "TV Dizileri", "TV Dizileri Burada Bulabilirsiniz", 10, 11, [
        sub("arka-sira", "Arka Sıradakiler", 1, 1),
        sub("arka-sokak", "Arka Sokaklar", 0, 0),
        sub("akasya", "Akasya Durağı", 6, 6),
        sub("ask-i-memnu", "Aşk-ı Memnu", 0, 0),
        sub("ask-hayal", "Aşk Bir Hayal", 0, 0),
        sub("adanali", "Adanalı", 0, 0),
        sub("melek-annem", "Benim Annem Bir Melek", 0, 0),
        sub("bulut", "Bir Bulut Olsam", 0, 0),
        sub("cghb", "Çok Güzel Hareketler Bunlar", 0, 0),
        sub("genis-aile", "Geniş Aile", 2, 2),
        sub("hanim", "Hanımın Çiftliği", 0, 0),
        sub("melekler", "Melekler Korusun", 0, 0),
        sub("haneler", "Haneler", 0, 0),
        sub("sakarya", "Sakarya Fırat", 0, 0),
        sub("diger-dizi", "Diğer Türk Dizileri", 1, 2)
      ]),
      board("pusu", "Kurtlar Vadisi Pusu", "", 0, 0, [
        sub("pusu-resim", "Kurtlar Vadisi Pusu Resimleri", 0, 0),
        sub("pusu-fragman", "Kurtlar Vadisi Pusu Fragmanlar", 0, 0),
        sub("pusu-muzik", "Kurtlar Vadisi Pusu Müzikler", 0, 0),
        sub("pusu-bolum", "Kurtlar Vadisi Pusu Bölüm Download", 0, 0)
      ]),
      board("ezel", "EZEL", "", 6, 7, [
        sub("ezel-resim", "EZEL Resimleri", 6, 7),
        sub("ezel-fragman", "EZEL Fragmanlar", 0, 0),
        sub("ezel-muzik", "EZEL Müzikler", 0, 0),
        sub("ezel-bolum", "EZEL Bölüm Download", 0, 0)
      ]),
      board("yerli-film", "Yerli Film Download", "Türk Yapımı Filmleri Buradan İndirebilirsiniz", 0, 0),
      board("yabanci-film", "Yabancı Film Download", "Yabancı Filmleri Buradan İndirebilirsiniz", 0, 0),
      board("online-sinema", "Online Sinema İzle", "Online Olarak Filmleri İzleyebilirsiniz", 0, 0)
    ]},
    { title: "Program - Msn - Oyun", boards: [
      board("program", "Program Paylasım", "Bilgisayar Yazılımları,Oyunları,Msn", 38, 48, [
        sub("program-dl", "Program Download", 32, 42),
        sub("anlatim", "Resimli Program Anlatımlar", 1, 1),
        sub("isletim", "İşletim Sistemleri", 5, 5),
        sub("donanim", "Donanım", 0, 0),
        sub("driver", "Driver", 0, 0),
        sub("istek", "Program İstek", 0, 0),
        sub("destek", "Teknik Destek & İpuçları", 0, 0)
      ]),
      board("msn", "MSN Messenger - Windows Live Messenger", "MSN Messenger - Windows Live Messenger teknikleri yamaları Sorunları Çözümleri", 4, 5, [
        sub("msn-destek", "Messenger Destek Ve Bilgiler", 0, 0),
        sub("msn-diger", "Diğer MSN Programları", 0, 0),
        sub("msn-versiyon", "Messenger Versiyonları", 1, 1),
        sub("msn-arayuz", "Arayüz Ve İfadeler", 0, 0),
        sub("msn-nick", "Msn Messenger Nickleri", 3, 4)
      ]),
      board("oyun", "Oyun", "Pc Ve Sanal Oyunlar Hileleri Teknikleri", 10, 10, [
        sub("oyun-dl", "Oyun Download", 6, 6),
        sub("oyun-hile", "Oyun Hileleri", 4, 4),
        sub("oyun-yama", "Oyun Yamaları", 0, 0),
        sub("flash", "Flash Oyunlar", 0, 0),
        sub("inceleme", "İncelemeleri ve Çıkacaklar", 0, 0)
      ]),
      board("online-oyun", "Online Oyun", "", 10, 12, [
        sub("knight", "Knight Online", 1, 1),
        sub("metin2", "Metin2", 6, 6),
        sub("karahan", "Karahan Online", 1, 1),
        sub("diger-oyun", "Diğer Online Oyunlar", 2, 4)
      ]),
      board("photoshop", "Photoshop Cs2 - Cs3 - Cs4", "Photoshop Download,Anlatımlar,Plug-in,Fontlar,Brush Ve Styles", 1, 1, [
        sub("ps-dl", "Photoshop Cs2 Cs3 Cs4 Download", 1, 1),
        sub("ps-anlatim", "Resimli Ve Videolu Anlatımlar", 0, 0),
        sub("font", "Fontlar", 0, 0),
        sub("plugin", "Plug-in,Brush,Styles", 0, 0),
        sub("psd", "Psd / Png / ico İconlar", 0, 0),
        sub("grafik", "Grafik/Resim/PSD/PNG /Vector", 0, 0)
      ])
    ]},
    { title: "Cep Telefonu", boards: [
      board("melodi", "Cep Melodiler", "", 1, 1),
      board("cep-oyun", "Cep Oyun Download", "", 3, 6),
      board("cep-resim", "Cep Resim ve Videolar", "", 0, 0),
      board("cep-program", "Cep Programlar", "", 0, 0),
      board("cep-teknik", "Teknik Bilgiler", "", 0, 0)
    ]},
    { title: "Webmaster - Vbulletin", boards: [
      board("vb-destek", "Vbulletin Destek", "", 0, 0),
      board("wm-genel", "Webmaster Genel Konular Sorunlar", "Genel Sorunlar ve Çözümleri", 0, 0),
      board("link", "Link Değişimi", "Link Değişim Alanı", 0, 0, [
        sub("backlink", "Backlink Değişimi", 0, 0),
        sub("banner", "Banner Değişimi", 0, 0),
        sub("link-istek", "Link değişimi İstek ve Sorunlarınız", 0, 0)
      ]),
      board("wm-program", "Webmaster Programlar", "", 0, 0, [
        sub("wm-prog", "Webmaster Programları", 0, 0),
        sub("wm-yardim", "Program yardım", 0, 0)
      ]),
      board("web2", "Web 2.0", "Web 2.0 standartları, felsefesi...", 0, 0),
      board("server", "Site & Server Administration", "Linux/unix windows serverlar, sorunları çözümleri vb", 1, 1, [
        sub("guvenlik", "Site Güvenliği & Saldırılar", 0, 0),
        sub("cpanel", "Cpanel & Plesk", 0, 0),
        sub("optimizasyon", "Server Optimizasyon", 1, 1),
        sub("linux", "Linux", 0, 0),
        sub("windows", "Windows", 0, 0)
      ])
    ]},
    { title: "Spor Dünyası", boards: [
      board("spor", "Spor", "Futbol,Voleybol,Basketbol ve Diğerleri", 4, 4, [
        sub("milli", "Milli Takım", 0, 0),
        sub("gs", "GalataSaray", 0, 0),
        sub("fb", "FenerBahçe", 4, 4),
        sub("ts", "TrabzonSpor", 0, 0),
        sub("bjk", "BeşikTaş", 0, 0),
        sub("anadolu", "Anadolu Takımları", 0, 0),
        sub("avrupa", "Avrupa'dan Futbol", 0, 0),
        sub("basket", "Basketbol", 0, 0),
        sub("voleybol", "Voleybol", 0, 0),
        sub("diger-brans", "Diğer Branşlar", 0, 0)
      ])
    ]},
    { title: "GizemliBoard Çöplüğü", boards: [
      board("cop", "Çöp Kutusu", "Bütün Sorunlu Konular Burada Toplanır...", 1, 40)
    ]}
  ],
  topics: [],
  posts: []
});

const lastPosts = [
  ["duyuru", 3, "Rapid Premium Satıslarımız...", dt(2010, 2, 8, 11, 15)],
  ["yarisma", 4, "Rep promosyonu Üye ol kap...", dt(2010, 2, 7, 23, 3)],
  ["oneri", 5, "Öneri,Şikayet Soru &...", dt(2010, 2, 1, 23, 57)],
  ["kutlama", 6, "100.Mesaj oldum", dt(2010, 2, 6, 17, 38)],
  ["tanitin", 7, "cümleten merhaba :)", dt(2010, 2, 6, 11, 57)],
  ["osmanli", 8, "OSMANLI TARiHİ KRONOLOJİSİ", dt(2010, 2, 5, 13, 50)],
  ["ulkeler", 3, "Afganİstan", dt(2010, 1, 27, 18, 32)],
  ["kultur-sanat", 3, "Baki Kuru", dt(2010, 1, 27, 18, 47)],
  ["haber", 4, "Demet Akalın evlendi", dt(2010, 2, 2, 22, 21)],
  ["kursu", 3, "bir satanistin hikayesi", dt(2010, 2, 3, 12, 55)],
  ["anket", 5, "Sizce en yakışıklı futbolcu...", dt(2010, 1, 30, 13, 24)],
  ["muhabbet", 3, "Muhabbet Bölümü", dt(2010, 1, 29, 14, 9)],
  ["merak", 9, "Cola'nın yararları", dt(2010, 1, 26, 20, 11)],
  ["bilmece", 5, "Temel ile ilgili fıkralar", dt(2010, 1, 30, 22, 56)],
  ["fan", 5, "Geniş Aile Ufuk Ozkan Hakkında", dt(2010, 2, 2, 21, 33)],
  ["fikra", 10, "Fizikçi,Kimyacı ve Ekonomist...", dt(2010, 2, 3, 0, 58)],
  ["itiraf", 3, "Evet itiraf ediyorum.", dt(2010, 1, 28, 9, 56)],
  ["hobi", 7, "Hobilerim & Fobilerim", dt(2010, 2, 6, 12, 5)],
  ["dergi", 5, "Dergi", dt(2010, 2, 2, 0, 2)],
  ["roportaj", 11, "Röportaj Önerileri", dt(2010, 1, 26, 17, 34)],
  ["radyo", 5, "Radyo", dt(2010, 2, 2, 0, 4)],
  ["sorgu", 5, "Sorgu ve sorgulama bölümü", dt(2010, 2, 2, 0, 11)],
  ["sehir", 12, "[GB]Hastahane", dt(2010, 1, 25, 16, 20)],
  ["manzara", 5, "Manzara", dt(2010, 2, 2, 21, 34)],
  ["muzik", 7, "Evanescence-Lithium", dt(2010, 2, 2, 15, 38)],
  ["akasya", 13, "akasya duragı", dt(2010, 2, 3, 0, 18)],
  ["ezel-resim", 13, "ezel 5", dt(2010, 2, 2, 23, 29)],
  ["program", 4, "ULtraXp PLus Version 2oo9 DVD...", dt(2010, 2, 7, 23, 20)],
  ["msn", 5, "msn ye yazılacak bikaç nick", dt(2010, 1, 30, 11, 58)],
  ["oyun", 5, "GTA 4 hile", dt(2010, 1, 30, 12, 4)],
  ["online-oyun", 3, "Metin2 2009.05.26", dt(2010, 1, 30, 14, 23)],
  ["photoshop", 3, "Adobe PhotoShop CS2 9", dt(2010, 1, 28, 10, 12)],
  ["melodi", 3, "Nil KaraibrahimqiL_C0LA TURKA", dt(2010, 1, 28, 10, 15)],
  ["cep-oyun", 3, "Fifa Street 2 Cep telefonu...", dt(2010, 2, 5, 19, 22)],
  ["server", 5, "Server OPTİMİZASYON", dt(2010, 1, 30, 12, 8)],
  ["fb", 3, "Santos'un önü açıldı", dt(2010, 1, 30, 15, 0)],
  ["cop", 3, "Kelime Bulma Yarışması", dt(2010, 2, 3, 16, 32)]
];

function fresh() {
  const db = seed();
  lastPosts.forEach((row, i) => {
    const id = i + 1;
    db.topics.push({ id, board: row[0], userId: row[1], title: row[2], pinned: false, locked: false, views: 0, last: row[3], created: row[3] });
    db.posts.push({ id, topicId: id, userId: row[1], body: "8 Şubat 2010 arşivindeki son ileti başlığı. Gövde o günkü kayıttan alınmadı.", created: row[3] });
  });
  return db;
}

let db = JSON.parse(localStorage.getItem(KEY) || "null") || fresh();
const save = () => localStorage.setItem(KEY, JSON.stringify(db));
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&" + "amp;", "<": "&" + "lt;", ">": "&" + "gt;", '"': "&" + "quot;" }[c]));
const num = (n) => Number(n || 0).toLocaleString("tr-TR");
const vbDate = (t) => {
  const d = new Date(t);
  const pad = (n) => String(n).padStart(2, "0");
  let h = d.getHours();
  const am = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${d.getFullYear()} ${pad(h)}:${pad(d.getMinutes())} ${am}`;
};
const user = (id) => db.users.find((u) => u.id === id) || { name: "?", username: "?" };
const me = () => (db.me ? user(db.me) : null);
const flat = () => db.cats.flatMap((c) => c.boards.flatMap((b) => [Object.assign({ cat: c.title }, b), ...(b.subs || []).map((s) => Object.assign({ cat: c.title, parent: b.name, parentSlug: b.slug }, s))]));
const boardOf = (slug) => flat().find((b) => b.slug === slug) || null;
const replies = (id) => Math.max(0, db.posts.filter((p) => p.topicId === id).length - 1);
const topicsOf = (slug) => db.topics.filter((t) => t.board === slug);
const nextId = (list) => list.reduce((m, x) => Math.max(m, x.id), 0) + 1;
const bump = (slug, posts) => {
  for (const c of db.cats) {
    const hit = c.boards.find((b) => b.slug === slug) || c.boards.flatMap((b) => b.subs || []).find((s) => s.slug === slug);
    if (hit) { hit.archiveTopics += 1; hit.archivePosts += posts; return; }
  }
};

const BASE = (() => {
  const path = location.pathname.replace(/\/index\.html$/, "").replace(/\/404\.html$/, "");
  const mark = path.toLowerCase().indexOf("/gizemliboard");
  if (mark >= 0) return path.slice(0, mark + "/gizemliboard".length).replace(/\/$/, "");
  return path.replace(/\/$/, "");
})();
function fileSlug(s) {
  const map = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", Ç: "c", Ğ: "g", İ: "i", I: "i", Ö: "o", Ş: "s", Ü: "u" };
  return String(s || "").replace(/[çğıöşüÇĞİÖŞÜIİ]/g, (c) => map[c] || c).toLowerCase().replace(/&/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70) || "sayfa";
}
const href = (path) => {
  const raw = String(path || "index.html");
  const q = raw.indexOf("?");
  let body = (q >= 0 ? raw.slice(0, q) : raw).replace(/^\/+/, "");
  const query = q >= 0 ? raw.slice(q) : "";
  if (!body) body = "index.html";
  if (!body.endsWith(".html")) body += ".html";
  return BASE + "/" + body + query;
};
const go = (path) => { history.pushState({}, "", href(path)); route(); };
function segments() {
  let path = location.pathname;
  if (BASE && path.toLowerCase().startsWith(BASE.toLowerCase())) path = path.slice(BASE.length);
  return path.split("/").filter(Boolean).map((part) => part.replace(/\.html$/, "")).filter((part) => part && part !== "index" && part !== "404");
}
function metaOf(slug) {
  for (let ci = 0; ci < db.cats.length; ci++) {
    const c = db.cats[ci];
    const cs = fileSlug(c.title);
    for (let bi = 0; bi < c.boards.length; bi++) {
      const b = c.boards[bi];
      const bs = fileSlug(b.name);
      if (b.slug === slug) return { cn: ci + 1, bn: bi + 1, sn: 0, path: `${cs}/${bs}.html`, label: `${ci + 1}.${bi + 1}`, name: b.name, cat: c.title, catFile: `${cs}.html` };
      for (let si = 0; si < (b.subs || []).length; si++) {
        const s = b.subs[si];
        if (s.slug === slug) return { cn: ci + 1, bn: bi + 1, sn: si + 1, path: `${cs}/${bs}/${fileSlug(s.name)}.html`, label: `${ci + 1}.${bi + 1}.${si + 1}`, name: s.name, cat: c.title, catFile: `${cs}.html`, parent: b.name, parentPath: `${cs}/${bs}.html` };
      }
    }
  }
  return { cn: 1, bn: 1, sn: 0, path: "genel/genel.html", label: "", name: "", cat: "", catFile: "genel.html" };
}
function threadPath(topic) {
  const dir = metaOf(topic.board).path.replace(/\.html$/, "");
  return dir + "/" + fileSlug(topic.title) + ".html";
}
function currentThread() {
  const parts = segments();
  const name = parts[parts.length - 1];
  return db.topics.find((t) => fileSlug(t.title) === name) || null;
}

function chrome() {
  const u = me();
  document.getElementById("tools").innerHTML = u
    ? `${esc(u.name)} · <a href="${href("yeni")}">Yeni konu</a> · <button id="out" type="button">Çıkış</button>`
    : `<a href="${href("giris.html")}">Giriş</a> · <a href="${href("katil.html")}">Kayıt ol</a>`;
  document.getElementById("out")?.addEventListener("click", () => { db.me = null; save(); go("index.html"); });
  document.getElementById("nav").innerHTML = `<a href="${href("index.html")}">Anasayfa</a>` + db.cats.map((c) => `<a href="${href(fileSlug(c.title))}">${esc(c.title)}</a>`).join("");
  document.getElementById("subbar").innerHTML = `<span>Şu an: ${u ? esc(u.name) : "3 ziyaretçi"}</span><span><a href="${href("uyeler.html")}">Üyeler</a> · <a href="${href("arama.html")}">Arama</a></span>`;
}

function latest(slugs) {
  return db.topics.filter((t) => slugs.includes(t.board)).sort((a, z) => z.last - a.last)[0];
}
function lastCell(topic) {
  if (!topic) return "henüz yok";
  return `<a href="${href(threadPath(topic))}">${esc(topic.title)}</a><div>Son yazan ${esc(user(topic.userId).name)}</div><div>${vbDate(topic.last)}</div>`;
}
function subGrid(subs) {
  if (!subs || !subs.length) return "";
  const cells = subs.map((s) => {
    const m = metaOf(s.slug);
    return `<td><a href="${href(m.path)}"><span class="dot"></span>${esc(s.name)}${s.archiveTopics ? ` <span class="count">(${num(s.archiveTopics)}/${num(s.archivePosts)})</span>` : ""}</a></td>`;
  });
  const rows = [];
  for (let i = 0; i < cells.length; i += 2) rows.push(`<tr>${cells[i]}${cells[i + 1] || "<td></td>"}</tr>`);
  return `<table class="subcols"><tbody>${rows.join("")}</tbody></table>`;
}
function forumRow(b, cn, bn) {
  const last = latest([b.slug, ...(b.subs || []).map((s) => s.slug)]);
  return `<tr><td><span class="folder${b.archiveTopics ? "" : " off"}"></span><a class="board-name" href="${href(metaOf(b.slug).path)}">${esc(b.name)}</a>${b.desc ? `<div class="desc">${esc(b.desc)}</div>` : ""}${subGrid(b.subs)}</td>
    <td class="last">${lastCell(last)}</td>
    <td class="num">${num(b.archiveTopics)}</td>
    <td class="num">${num(b.archivePosts)}</td></tr>`;
}
function forumTable(boards, cn) {
  return `<table class="forum"><thead><tr><th>Forum</th><th class="last">Son mesaj</th><th class="num">Konular</th><th class="num">Mesajlar</th></tr></thead><tbody>
    ${boards.map((b, bi) => forumRow(b, cn, bi + 1)).join("")}
  </tbody></table>`;
}
function home(only) {
  const cats = only == null ? db.cats.map((c, i) => [c, i]) : [[db.cats[only], only]].filter((x) => x[0]);
  const rows = cats.map(([c, i]) => `<section class="cat" id="k${i + 1}"><h2><a href="${href(fileSlug(c.title))}">${esc(c.title)}</a></h2>${forumTable(c.boards, i + 1)}</section>`).join("");
  const welcome = only == null ? `<div class="welcome"><b>Net Aleminin En Gizemli Forum Sitesi Sitesine Hoşgeldiniz.</b><br>Adresler kategori.html, kategori/konu.html, kategori/konu/alt-konu.html ve kategori/konu/alt-konu/forum.html biçiminde.</div>
    <div class="stats"><span>Konular: 1.195 · Mesajlar: 1.455 · Üye: 56</span><span>En yeni üyemiz: kzd2" · En popüler bölüm: Serbest Kürsü</span></div>` : `<div class="crumb"><a href="${href("index.html")}">Anasayfa</a> → ${esc(cats[0][0].title)}</div>`;
  return welcome + rows;
}
function boardView(slug) {
  const b = boardOf(slug);
  if (!b) return `<div class="welcome">Bölüm yok.</div>`;
  const m = metaOf(slug);
  const list = topicsOf(slug).sort((a, z) => z.pinned - a.pinned || z.last - a.last);
  const parent = m.parentPath ? `<a href="${href(m.parentPath)}">${esc(m.parent)}</a> → ` : "";
  const subs = (b.subs || []).length ? `<section class="cat"><h2>Alt konular</h2><div class="subboard">${subGrid(b.subs)}</div></section>` : "";
  const topics = `<section class="cat"><h2>Forumda bulunan konular: ${esc(b.name)}</h2>${b.desc ? `<div class="note">${esc(b.desc)}</div>` : ""}<table class="threads"><thead><tr><th>Konu / konuyu başlatan</th><th class="last">Son mesaj</th><th class="num">Cevap</th><th class="num">Görüntüleme</th></tr></thead><tbody>
    ${list.length ? list.map((t) => `<tr><td><a class="board-name" href="${href(threadPath(t))}">${t.pinned ? "[sabit] " : ""}<span class="no">${m.label}.${t.id}</span>${esc(t.title)}</a><div class="desc">${esc(user(t.userId).name)}</div></td><td class="last">${esc(user(t.userId).name)}<div>${vbDate(t.last)}</div></td><td class="num">${replies(t.id)}</td><td class="num">${t.views}</td></tr>`).join("") : `<tr><td colspan="4">henüz yok</td></tr>`}
  </tbody></table></section>`;
  return `<div class="crumb"><a href="${href("index.html")}">Anasayfa</a> → <a href="${href(m.catFile)}">${m.cn}. ${esc(b.cat)}</a> → ${parent}${esc(b.name)}</div>${subs}${topics}<div class="crumb"><a class="btn" href="${href(m.path + "yeni")}">Yeni konu</a> · arşiv: ${num(b.archiveTopics)} konu, ${num(b.archivePosts)} mesaj</div>`;
}

function thread(id) {
  const t = db.topics.find((x) => x.id === Number(id));
  if (!t) return `<div class="welcome">Konu yok.</div>`;
  t.views += 1; save();
  const b = boardOf(t.board);
  const m = metaOf(t.board);
  const u = me();
  const admin = u && u.admin ? `<div class="admin"><button class="btn ghost" data-act="pin" type="button">${t.pinned ? "Sabiti kaldır" : "Sabitle"}</button><button class="btn ghost" data-act="lock" type="button">${t.locked ? "Kilidi aç" : "Kilitle"}</button><button class="btn ghost" data-act="del" type="button">Sil</button></div>` : "";
  const form = t.locked ? `<div class="err">Bu konu kilitli.</div>` : u ? `<form id="reply"><label>Yanıt</label><textarea name="body" required></textarea><button class="btn" type="submit">Gönder</button></form>` : `<div class="err">Yanıt için <a href="${href("giris.html")}">giriş yap</a>.</div>`;
  return `<div class="crumb"><a href="${href("index.html")}">Anasayfa</a> → <a href="${href(m.path)}">${esc(b?.name || "")}</a> → ${esc(t.title)}</div>
    <div class="thread">${db.posts.filter((p) => p.topicId === t.id).map((p) => {
      const a = user(p.userId);
      return `<article class="post"><div class="who"><b>${esc(a.name)}</b><span class="rank">${esc(a.rank || "Üye")}</span><div>@${esc(a.username)}</div></div><div class="body"><div class="when">${vbDate(p.created)}</div>${esc(p.body).replace(/\n/g, "<br>")}</div></article>`;
    }).join("")}</div>
    <div class="composer">${admin}${form}</div>`;
}

function compose(pre) {
  if (!me()) return `<div class="welcome">Önce <a href="${href("giris.html")}">giriş yap</a>.</div>`;
  const opts = flat().map((b) => `<option value="${b.slug}" ${b.slug === pre ? "selected" : ""}>${metaOf(b.slug).label} ${esc(b.name)}</option>`).join("");
  return `<form class="composer" id="compose"><h2>Yeni konu</h2><label>Bölüm</label><select name="board">${opts}</select><label>Başlık</label><input name="title" required /><label>İleti</label><textarea name="body" required></textarea><button class="btn" type="submit">Konuyu aç</button></form>`;
}

function auth(mode) {
  const reg = mode === "katil";
  return `<form class="auth" id="auth"><h2>${reg ? "Kayıt ol" : "Giriş"}</h2><div class="err" id="err" hidden></div>
    ${reg ? `<label>Görünen ad</label><input name="name" required />` : ""}
    <label>Nick</label><input name="username" required />
    <label>Şifre</label><input name="password" type="password" required />
    <button class="btn" type="submit">${reg ? "Üye ol" : "Giriş yap"}</button>
    <p>Yönetici: admin / GbAdmin2007 · Üye: demo / 123456</p></form>`;
}

function search(q) {
  const n = q.trim().toLowerCase();
  const hits = n.length < 2 ? [] : db.topics.filter((t) => t.title.toLowerCase().includes(n) || db.posts.some((p) => p.topicId === t.id && p.body.toLowerCase().includes(n)));
  return `<form class="composer" id="find"><label>Arama</label><input name="q" value="${esc(q)}" /><button class="btn" type="submit">Ara</button></form>
    <section class="cat"><h2>Sonuç</h2><table class="threads">${hits.map((t) => `<tr><td><a href="${href(threadPath(t))}"><span class="no">${metaOf(t.board).label}.${t.id}</span>${esc(t.title)}</a></td></tr>`).join("") || `<tr><td>Eşleşen konu yok.</td></tr>`}</table></section>`;
}

function members() {
  return `<section class="cat"><h2>Üye listesi</h2><table class="threads"><tr><th>No</th><th>Ad</th><th>Kullanıcı</th><th>Rütbe</th></tr>${db.users.map((u) => `<tr><td class="num">${u.id}</td><td><a href="${href("uye/" + u.id + ".html")}">${esc(u.name)}</a></td><td>${esc(u.username)}</td><td>${esc(u.rank || "Üye")}</td></tr>`).join("")}</table></section>`;
}
function member(id) {
  const u = user(Number(id));
  if (!u.id) return `<div class="welcome">Üye yok.</div>`;
  const topics = db.topics.filter((t) => t.userId === u.id);
  return `<div class="crumb"><a href="${href("uyeler.html")}">Üyeler</a> → ${esc(u.name)}</div><section class="cat"><h2><span class="no">${u.id}</span>${esc(u.name)}</h2><div class="note">@${esc(u.username)} · ${esc(u.rank || "Üye")}</div><table class="threads">${topics.map((t) => `<tr><td><a href="${href(threadPath(t))}">${esc(t.title)}</a></td></tr>`).join("") || `<tr><td>Konu yok.</td></tr>`}</table></section>`;
}

function bind() {
  document.getElementById("reply")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = currentThread()?.id;
    const body = String(new FormData(e.target).get("body") || "").trim();
    if (body.length < 2) return;
    const t = db.topics.find((x) => x.id === id);
    db.posts.push({ id: nextId(db.posts), topicId: id, userId: db.me, body, created: Date.now() });
    if (t) { t.last = Date.now(); bump(t.board, 1); }
    save(); route();
  });
  document.getElementById("compose")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const title = String(f.get("title") || "").trim();
    const body = String(f.get("body") || "").trim();
    if (title.length < 3) return;
    const id = nextId(db.topics);
    const slug = f.get("board");
    db.topics.push({ id, board: slug, userId: db.me, title, pinned: false, locked: false, views: 0, last: Date.now(), created: Date.now() });
    db.posts.push({ id: nextId(db.posts), topicId: id, userId: db.me, body, created: Date.now() });
    bump(slug, 1);
    save(); go(threadPath(db.topics.find((x) => x.id === id)));
  });
  document.getElementById("auth")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const username = String(f.get("username") || "").trim();
    const password = String(f.get("password") || "");
    const err = document.getElementById("err");
    if (segments()[0] === "katil") {
      if (db.users.some((u) => u.username.toLowerCase() === username.toLowerCase())) { err.hidden = false; err.textContent = "Bu ad alınmış."; return; }
      const id = nextId(db.users);
      db.users.push({ id, username, password, name: String(f.get("name") || username), rank: "Üye", admin: false });
      db.me = id; save(); go("index.html"); return;
    }
    const found = db.users.find((u) => u.username === username && u.password === password);
    if (!found) { err.hidden = false; err.textContent = "Nick veya şifre uyuşmuyor."; return; }
    db.me = found.id; save(); go("index.html");
  });
  document.getElementById("find")?.addEventListener("submit", (e) => {
    e.preventDefault();
    go("arama.html?q=" + encodeURIComponent(new FormData(e.target).get("q") || ""));
  });
  document.querySelectorAll("[data-act]").forEach((btn) => btn.addEventListener("click", () => {
    const id = currentThread()?.id;
    const t = db.topics.find((x) => x.id === id);
    if (!t || !me()?.admin) return;
    const act = btn.getAttribute("data-act");
    if (act === "pin") t.pinned = !t.pinned;
    if (act === "lock") t.locked = !t.locked;
    if (act === "del") { db.topics = db.topics.filter((x) => x.id !== id); db.posts = db.posts.filter((p) => p.topicId !== id); save(); go("index.html"); return; }
    save(); route();
  }));
}

function locate(parts) {
  const catIndex = db.cats.findIndex((c) => fileSlug(c.title) === parts[0]);
  const cat = db.cats[catIndex];
  if (!cat) return null;
  if (parts.length === 1) return { kind: "cat", index: catIndex };
  const board = cat.boards.find((b) => fileSlug(b.name) === parts[1]);
  if (!board) return null;
  if (parts.length === 2) return { kind: "board", slug: board.slug };
  const sub = (board.subs || []).find((s) => fileSlug(s.name) === parts[2]);
  if (sub && parts.length === 3) return { kind: "board", slug: sub.slug };
  if (sub && parts[3] === "yeni") return { kind: "yeni", slug: sub.slug };
  if (parts[2] === "yeni") return { kind: "yeni", slug: board.slug };
  const topic = db.topics.find((t) => fileSlug(t.title) === parts[parts.length - 1] && (t.board === (sub ? sub.slug : board.slug) || t.board === board.slug));
  return topic ? { kind: "thread", id: topic.id } : null;
}

function route() {
  const parts = segments();
  const q = new URLSearchParams(location.search);
  let html = home();
  const hit = parts[0] ? locate(parts) : null;
  if (hit?.kind === "cat") html = home(hit.index);
  else if (hit?.kind === "board") html = boardView(hit.slug);
  else if (hit?.kind === "thread") html = thread(hit.id);
  else if (hit?.kind === "yeni") html = compose(hit.slug);
  else if (parts[0] === "giris") html = auth("giris");
  else if (parts[0] === "katil") html = auth("katil");
  else if (parts[0] === "uyeler") html = members();
  else if (parts[0] === "uye") html = member(parts[1]);
  else if (parts[0] === "arama") html = search(q.get("q") || decodeURIComponent(parts[1] || ""));
  else if (parts[0] === "yeni") html = compose(q.get("b") || "duyuru");
  document.getElementById("app").innerHTML = html;
  chrome();
  bind();
}
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[href]");
  if (!a || a.target || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || !url.pathname.toLowerCase().startsWith(BASE.toLowerCase())) return;
  e.preventDefault();
  history.pushState({}, "", url.pathname + url.search);
  route();
});
window.addEventListener("popstate", route);
if (location.hash.startsWith("#/")) history.replaceState({}, "", href("index.html"));
route();
