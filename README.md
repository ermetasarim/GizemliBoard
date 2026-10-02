# GizemliBoard

Kayıt, giriş, konu ve yanıtların sunucudaki SQLite dosyasında durduğu forum.

## Çalıştırma

```bash
npm install
npm start
```

Tarayıcı: http://localhost:3000

İlk açılışta yönetici oluşur:

- nick: `admin`
- şifre: `admin123`

Girişten sonra şifreyi değiştir. Kategoriler boşsa dört bölüm kendiliğinden açılır. Üye kaydı, konu ve yanıt veritabanına yazılır; sunucu kapanınca silinmez.

Ortam değişkenleri:

- `PORT` varsayılan `3000`
- `SESSION_SECRET` oturum imzası
