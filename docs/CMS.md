# STD5 Admin Panel API Documentation

## 📋 Genel Bakış

STD5.net yönetim paneli, web sitesi içeriklerini yönetmek için geliştirilmiş kapsamlı bir sistemdir. JWT tabanlı kimlik doğrulama kullanır ve tüm CRUD işlemlerini destekler.

## 🔐 Kimlik Doğrulama

### Giriş Yapma
**Endpoint:** `POST /api/auth/login`

**İstek:**
```json
{
  "username": "std5_admin",
  "password": "STd5@2025"
}
```

**Başarılı Yanıt (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "success": true
}
```

**Hatalı Yanıt (401):**
```json
{
  "message": "Kullanıcı adı veya şifre hatalı"
}
```

**Kullanım:**
- Token localStorage'da `admin-token` anahtarı ile saklanır
- Tüm admin API isteklerinde `Authorization: Bearer {token}` header'ı kullanılır
- Token 24 saat geçerlidir

---

## 📁 Projeler (Works)

### Tüm Projeleri Getir
**Endpoint:** `GET /api/admin/works`

**Yanıt:**
```json
[
  {
    "id": "uuid",
    "title": "Proje Adı",
    "description": "Proje açıklaması",
    "prod_year": 2024,
    "genre": "Aksiyon",
    "platform": "Netflix",
    "trailer_embed_url": "https://youtube.com/embed/...",
    "gallery": ["image1.jpg", "image2.jpg"],
    "image": "main-image.jpg",
    "order": 1
  }
]
```

### Yeni Proje Ekle
**Endpoint:** `POST /api/admin/works`

**İstek:**
```json
{
  "title": "Yeni Proje",
  "description": "Proje açıklaması",
  "prod_year": 2024,
  "genre": "Drama",
  "platform": "Disney+",
  "trailer_embed_url": "https://youtube.com/embed/...",
  "gallery": ["image1.jpg"],
  "image": "main-image.jpg"
}
```

### Proje Güncelle
**Endpoint:** `PUT /api/admin/works/{id}`

### Proje Sil
**Endpoint:** `DELETE /api/admin/works/{id}`

---

## 👥 Ekip Üyeleri (Crew)

### Tüm Ekip Üyelerini Getir
**Endpoint:** `GET /api/admin/crew`

**Yanıt:**
```json
[
  {
    "id": "uuid",
    "name": "Ad Soyad",
    "title": {
      "tr": "Başlık (TR)",
      "en": "Title (EN)",
      "es": "Título (ES)",
      "fr": "Titre (FR)",
      "ru": "Название (RU)",
      "ar": "العنوان (AR)"
    },
    "department": {
      "tr": "Departman (TR)",
      "en": "Department (EN)",
      "es": "Departamento (ES)",
      "fr": "Département (FR)",
      "ru": "Отдел (RU)",
      "ar": "القسم (AR)"
    },
    "image": "profile.jpg",
    "linkedin": "https://linkedin.com/in/...",
    "cv": {
      "tr": "cv-tr.pdf",
      "en": "cv-en.pdf"
    },
    "order": 1
  }
]
```

### Yeni Ekip Üyesi Ekle
**Endpoint:** `POST /api/admin/crew`

### Ekip Üyesi Güncelle
**Endpoint:** `PUT /api/admin/crew/{id}`

### Ekip Üyesi Sil
**Endpoint:** `DELETE /api/admin/crew/{id}`

---

## 🏢 Kurucular (Founders)

### Tüm Kurucuları Getir
**Endpoint:** `GET /api/admin/founders`

**Yanıt:**
```json
[
  {
    "id": "uuid",
    "name": "Ad Soyad",
    "title": {
      "tr": "Başlık (TR)",
      "en": "Title (EN)"
    },
    "about": {
      "tr": "Hakkında (TR)",
      "en": "About (EN)"
    },
    "image": "founder.jpg",
    "linkedin": "https://linkedin.com/in/...",
    "imdb": "https://imdb.com/name/...",
    "cv": {
      "tr": "cv-tr.pdf",
      "en": "cv-en.pdf"
    }
  }
]
```

### Yeni Kurucu Ekle
**Endpoint:** `POST /api/admin/founders`

### Kurucu Güncelle
**Endpoint:** `PUT /api/admin/founders/{id}`

### Kurucu Sil
**Endpoint:** `DELETE /api/admin/founders/{id}`

---

## 🐱 Ofis Kedileri (Cats)

### Tüm Kedileri Getir
**Endpoint:** `GET /api/admin/cats`

**Yanıt:**
```json
{
  "cats": [
    {
      "id": "uuid",
      "name": "Kedi Adı",
      "role": {
        "tr": "Ünvan (TR)",
        "en": "Role (EN)",
        "es": "Rol (ES)",
        "fr": "Rôle (FR)",
        "ru": "Роль (RU)",
        "ar": "الدور (AR)"
      },
      "about": {
        "tr": "Hakkında (TR)",
        "en": "About (EN)",
        "es": "Acerca de (ES)",
        "fr": "À propos (FR)",
        "ru": "О (RU)",
        "ar": "حول (AR)"
      },
      "image": "cat.jpg",
      "order": 1
    }
  ]
}
```

### Yeni Kedi Ekle
**Endpoint:** `POST /api/admin/cats`

### Kedi Güncelle
**Endpoint:** `PUT /api/admin/cats`

### Kedi Sil
**Endpoint:** `DELETE /api/admin/cats`

**İstek:**
```json
{
  "id": "cat-uuid"
}
```

---

## ⭐ Öne Çıkan Projeler (Featured Projects)

### Öne Çıkan Projeleri Getir
**Endpoint:** `GET /api/admin/featured-projects`

**Yanıt:**
```json
{
  "featuredProjectIds": [
    "project-uuid-1",
    "project-uuid-2",
    "project-uuid-3"
  ]
}
```

### Öne Çıkan Projeleri Güncelle
**Endpoint:** `PUT /api/admin/featured-projects`

**İstek:**
```json
{
  "featuredProjectIds": ["uuid1", "uuid2", "uuid3"]
}
```

**Kısıtlamalar:**
- Maksimum 6 proje seçilebilir
- Duplicate ID'ler kabul edilmez
- Boş array gönderilebilir

---

## 📧 İletişim Formları (Contacts)

### Tüm İletişim Formlarını Getir
**Endpoint:** `GET /api/contact`

**Yanıt:**
```json
[
  {
    "id": "uuid",
    "name": "Ad Soyad",
    "email": "email@example.com",
    "subject": "Konu",
    "message": "Mesaj içeriği",
    "timestamp": "2024-01-01T12:00:00.000Z",
    "status": "new" // "new", "read", "replied"
  }
]
```

### Yeni İletişim Formu Gönder
**Endpoint:** `POST /api/contact`

**İstek:**
```json
{
  "name": "Ad Soyad",
  "email": "email@example.com",
  "subject": "Konu",
  "message": "Mesaj içeriği"
}
```

### İletişim Durumu Güncelle
**Endpoint:** `PATCH /api/contact/{id}`

**İstek:**
```json
{
  "status": "read" // "new", "read", "replied"
}
```

### İletişim Formu Sil
**Endpoint:** `DELETE /api/contact/{id}`

---

## 📤 Dosya Yükleme

### Genel Dosya Yükleme
**Endpoint:** `POST /api/admin/upload`

**Form Data:**
- `file`: Yüklenecek dosya
- `type`: Dosya türü ("work", "team", "team-cv", "founder")

**Başarılı Yanıt:**
```json
{
  "url": "/api/uploads/1234567890-filename.jpg"
}
```

### Kedi Görseli Yükleme
**Endpoint:** `POST /api/admin/cats/upload`

**Form Data:**
- `file`: Kedi görseli

**Başarılı Yanıt:**
```json
{
  "path": "/api/uploads/1234567890-cat.jpg"
}
```

---

## 🔄 Sıralama İşlemleri

### Öğe Sırasını Değiştir
**Endpoint:** `POST /api/{type}/reorder`

**Tip:** `works`, `crew`, `cats`

**İstek:**
```json
{
  "id": "item-uuid",
  "direction": "up" // "up" veya "down"
}
```

---

## 📊 Hata Kodları

| Kod | Açıklama |
|-----|----------|
| 200 | Başarılı |
| 201 | Oluşturuldu |
| 400 | Geçersiz İstek |
| 401 | Yetkisiz Erişim |
| 404 | Bulunamadı |
| 500 | Sunucu Hatası |

---

## 🔧 Teknik Detaylar

### Veri Depolama
- Tüm veriler `data/` klasöründe JSON dosyalarında saklanır
- Görseller `uploads/` klasöründe saklanır
- Dosya yolları otomatik olarak çözümlenir

### Güvenlik
- JWT token tabanlı kimlik doğrulama
- Tüm admin endpoint'leri token gerektirir
- Token 24 saat geçerlidir

### Çok Dilli Destek
- Ekip üyeleri, kurucular ve kediler için çok dilli alanlar
- Desteklenen diller: TR, EN, ES, FR, RU, AR
- Varsayılan dil Türkçe

### Dosya Yükleme
- Otomatik timestamp ile benzersiz dosya adları
- PDF CV desteği (sadece team-cv türü için)
- Görsel formatları: JPG, PNG, GIF, WebP

---

## 🚀 Kullanım Örnekleri

### Proje Ekleme
```javascript
const response = await fetch('/api/admin/works', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Yeni Proje',
    description: 'Proje açıklaması',
    prod_year: 2024,
    genre: 'Aksiyon',
    platform: 'Netflix',
    image: 'project.jpg'
  })
});
```

### Dosya Yükleme
```javascript
const formData = new FormData();
formData.append('file', file);
formData.append('type', 'work');

const response = await fetch('/api/admin/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

---

## 📝 Notlar

- Tüm tarihler ISO 8601 formatında
- UUID'ler otomatik olarak oluşturulur
- Sıralama için `order` alanı kullanılır
- Eksik görseller için placeholder gösterilir
- Çok dilli alanlar string veya object olabilir
- Maksimum 6 öne çıkan proje seçilebilir
- İletişim formları otomatik olarak "new" durumunda başlar

---

*Bu dokümantasyon STD5.net yönetim paneli API'lerini kapsamaktadır. Geliştirici: Cengel Studio*
