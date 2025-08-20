# 🎓 IMU Internship Management Backend

Bu proje, İstanbul Medeniyet Üniversitesi öğrencilerinin staj başvuru ve onay süreçlerini dijitalleştirmek amacıyla geliştirilmiş bir **Next.js API backend** uygulamasıdır. Veritabanı olarak **NeonDB** kullanılmış, veri erişimi için **Prisma ORM**, kimlik doğrulama için **JWT**, e-posta işlemleri için **Nodemailer** tercih edilmiştir.

---

## 🚀 Teknolojiler

- ✅ Next.js API Routes (Backend)
- ✅ Prisma ORM (Veri Modelleme & DB Erişimi)
- ✅ Neon PostgreSQL (NeonDB)
- ✅ JWT tabanlı Authentication
- ✅ Nodemailer ile SMTP üzerinden e-posta gönderimi

---

## 👤 Kullanıcı Rolleri

- 🎓 **STUDENT** – Kayıt olur, giriş yapar, profilini yönetir, staj başvurusunda bulunur, belgeleri yükler/günceller.
- 🧑‍🏫 **COORDINATOR** – Başvuruları inceler, belgeleri onaylar veya reddeder, öğrenci ve staj istatistiklerini görüntüler.

---

## 🔐 Authentication Özellikleri

- ✅ Kayıt Ol (Register)
- ✅ Giriş Yap (Login)
- ✅ JWT Token ile kimlik doğrulama
- ✅ Şifre Değiştirme
- ✅ Şifremi Unuttum (E-posta ile yeni şifre gönderimi)
- ✅ Güvenli token kontrolü (Authorization Header üzerinden)

---

## 📚 Öğrenci Özellikleri

- ✅ Profilini görüntüleme ve güncelleme
- ✅ Zorunlu / Gönüllü staj başvurusu yapma
- ✅ Başvuru belgelerini yükleme ve gerektiğinde güncelleme
- ✅ Geçmiş staj başvurularını görüntüleme

---

## 🧑‍🏫 Koordinatör (Admin) Özellikleri

- ✅ Tüm başvuruları listeleme
- ✅ Belge onayı / red işlemleri (ve öğrenciye e-posta bildirimi)
- ✅ Başvuru ve öğrenci detaylarını görüntüleme
- ✅ Dashboard: toplam başvuru sayısı, onaylı/red/beklemede olanlar vs.

---

## 📂 API Endpoint Listesi

| Endpoint                                  | Method | Açıklama                                      |
|-------------------------------------------|--------|-----------------------------------------------|
| /api/auth/register                        | POST   | Yeni kullanıcı kaydı                          |
| /api/auth/login                           | POST   | Giriş yapma                                   |
| /api/auth/forgot-password                 | POST   | Şifremi unuttum - yeni şifre gönderimi        |
| /api/auth/change-password                 | PATCH  | Şifre değiştirme (JWT ile)                    |
| /api/profile                              | GET    | Kullanıcı profil bilgileri + stajlar          |
| /api/profile                              | PATCH  | Profil bilgilerini güncelleme                 |
| /api/internship/voluntary                 | POST   | Gönüllü staj başvurusu yap                    |
| /api/internship/compulsory                | POST   | Zorunlu staj başvurusu yap                    |
| /api/internship/[id]                      | GET    | Tekil staj başvurusunu detaylı görüntüle      |
| /api/internship/[id]/update-document      | PATCH  | Belgeyi güncelle (sadece seçilen belgeler)    |


| /api/admin/internships                    | GET    | Tüm başvuruları listele (COORDINATOR)         |
| /api/admin/internships/[id]/approve       | PATCH  | Stajı onayla ve öğrenciye e-posta gönder      |
| /api/admin/internships/[id]/reject        | PATCH  | Stajı reddet ve öğrenciye e-posta gönder      |
| /api/admin/dashboard                      | GET    | Admin dashboard istatistikleri                |
| /api/admin/internships/[id]/detail        | GET    | Başvuru ve öğrenci detaylarını getir          |

---

## 🛠️ Kurulum

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

---

## 📄 Ortam Değişkenleri (.env)

```env
DATABASE_URL="postgresql://..."
JWT_SECRET=supersecretkey
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=youremail@example.com
SMTP_PASS=yourpassword
```

---

## 👨‍💻 Geliştirici: Ferit Yaşar AI dan yardım alınarak hazırlanmıştır.
