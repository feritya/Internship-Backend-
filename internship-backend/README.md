# 📚 Internship Management Backend

Bu proje, üniversite staj başvuru ve yönetim sürecini dijitalleştirmek için geliştirilmiş bir **Node.js / Next.js API backend** uygulamasıdır. Veritabanı olarak **NeonDB + Prisma** kullanılmıştır.

---

## 🚀 Kullanılan Teknolojiler

- Next.js API Routes (Backend)
- Prisma ORM
- Neon PostgreSQL (NeonDB)
- JWT Authentication
- Nodemailer (SMTP üzerinden e-posta gönderimi)

---

## 👥 Kullanıcı Rolleri

- **Öğrenci (STUDENT)**: Kayıt olur, staj başvurusu yapar, belgelerini yükler.
- **Sorumlu (COORDINATOR)**: Başvuruları onaylar/red eder, öğrencileri inceler.

---

## 🔐 Authentication Özellikleri

- ✅ Kullanıcı Kaydı (Register)
- ✅ Giriş Yapma (Login)
- ✅ JWT tabanlı token doğrulama
- ✅ Şifre Değiştirme (Login sonrası)
- ✅ Şifremi Unuttum (E-posta ile otomatik şifre gönderimi)

---

## 📂 Endpoints (Tamamlananlar)

| Endpoint                      | Method | Açıklama                         |
|------------------------------|--------|----------------------------------|
| /api/auth/register                            | POST   | Yeni kullanıcı kaydı            |
| /api/auth/login                                | POST   | Giriş yapma                     |
| /api/auth/change-password           | PATCH  | Şifre değiştirme (JWT ile)      |
| /api/auth/forgot-password             | POST    | şifremi unuttum      |
| /api/profile                                      | GET    | Profil bilgileri + stajlar      |

---


```env
DATABASE_URL="postgresql://neondb_owner:npg_vuZD6m5VHoFb@ep-still-violet-a2fz3tys-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

JWT_SECRET=supersecretkey
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=yasarferit13@gmail.com
SMTP_PASS=ltbvviqcqgqroicy

⏭️ Sonraki Adımlar
🔜 Şifremi Unuttum (Yeni şifreyi e-posta ile gönderme)

🔜 Staj Başvurusu (Zorunlu / Gönüllü belgelerle)

🔜 Sorumlu Paneli (Onay / Red)

🔜 E-posta Bildirimleri (Başvuru durumu vs.)

🔜 Admin özellikleri (gerekirse)

👨‍💻 Geliştirme

bash

npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev


Hazırlayan: Ferit Yaşar yapay zekadan destek alınarak  dökümantasyon hazırlanmıştır.
