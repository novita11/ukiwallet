# 🏦 UKI-Wallet - Digital Wallet Prototype

<div align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-gold?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/Status-Prototype-blue?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/Platform-Web%20%26%20Mobile-green?style=for-the-badge" alt="Platform">
</div>

## 📱 Tentang Proyek

UKI-Wallet adalah prototype aplikasi dompet digital modern yang dirancang khusus untuk mahasiswa dan komunitas Universitas Kristen Indonesia (UKI). Aplikasi ini menggabungkan desain yang elegan dengan fungsionalitas lengkap untuk memenuhi kebutuhan transaksi digital sehari-hari.

### ✨ Fitur Utama

#### 🚀 Quick Actions (Gojek-Style)
- **Top Up** - Isi saldo dengan mudah
- **Transfer** - Kirim uang ke sesama pengguna
- **QR Pay** - Pembayaran dengan scan QR code
- **Shopping** - Belanja online terintegrasi
- **Pulsa** - Beli pulsa dan paket data
- **PLN** - Bayar tagihan listrik
- **Internet** - Bayar tagihan internet
- **More** - Modal dengan 24+ fitur tambahan

#### 📊 Dashboard & Analytics
- **Real-time Balance** - Saldo terkini dengan animasi
- **UKI Points** - Sistem poin reward khusus
- **Tier System** - Level pengguna (Basic, Silver, Gold, Platinum)
- **Transaction History** - Riwayat transaksi lengkap
- **Smart Analytics** - Analisis pengeluaran dan pemasukan

#### 🎨 User Experience
- **Responsive Design** - Optimal di semua perangkat
- **Dark/Light Mode** - Tema yang dapat disesuaikan
- **Smooth Animations** - Transisi yang halus dan modern
- **Interactive Elements** - Hover effects dan feedback visual
- **Accessibility** - Desain yang mudah diakses

## 🏗️ Struktur Proyek

```
ukiwallet/
├── 📁 assets/
│   ├── 🎨 css/
│   │   ├── animations.css      # Animasi dan transisi
│   │   ├── colors.css          # Palet warna dan tema
│   │   ├── components.css      # Komponen UI utama
│   │   ├── mobile-nav.css      # Navigasi mobile
│   │   └── typography.css      # Font dan tipografi
│   └── ⚡ js/
│       ├── dashboard-manager.js # Manajemen dashboard
│       ├── mobile-app.js       # Logika aplikasi mobile
│       ├── qr-manager.js       # Fitur QR code
│       └── theme-manager.js    # Manajemen tema
├── 📱 mobile/
│   └── index.html             # Versi mobile
├── 💻 web/
│   └── index.html             # Versi web
└── 🏠 index.html              # Landing page
```

## 🚀 Cara Menjalankan

### Prerequisites
- Python 3.x (untuk local server)
- Browser modern (Chrome, Firefox, Safari, Edge)

### Langkah Instalasi

1. **Clone Repository**
   ```bash
   git clone https://github.com/novita11/ukiwallet.git
   cd ukiwallet
   ```

2. **Jalankan Local Server**
   ```bash
   python -m http.server 8000
   ```

3. **Buka di Browser**
   - **Mobile Version**: http://localhost:8000/mobile/index.html
   - **Web Version**: http://localhost:8000/web/index.html
   - **Landing Page**: http://localhost:8000/index.html

## 🎯 Fitur Detail

### 💳 Quick Actions Modal
Modal "Lainnya" berisi 24+ fitur yang dikategorikan:

#### 💰 Layanan Keuangan
- Tagihan, Investasi, Asuransi, Kredit

#### 🛒 E-Commerce  
- Marketplace, Fashion, Elektronik, Makanan

#### 🚗 Transportasi
- Ojek Online, Taksi, Bus, Kereta

#### 🎮 Hiburan
- Streaming, Gaming, Musik, Event

#### 🏥 Kesehatan & Edukasi
- Kesehatan, Kursus Online, Buku, Olahraga

#### 🔧 Utilitas
- Wifi, Parkir, Donasi, Voucher

### 📈 Analytics Dashboard
- **Filter Transaksi**: Semua, Masuk, Keluar
- **Pencarian**: Real-time search transaksi
- **Filter Bulan**: Pilih periode tertentu
- **Smart Grouping**: Pengelompokan otomatis
- **Summary Cards**: Ringkasan visual

### 🎨 Design System
- **Color Palette**: Gold primary dengan dark/light variants
- **Typography**: Inter font family dengan hierarchy jelas
- **Components**: Reusable UI components
- **Animations**: Smooth transitions dan micro-interactions
- **Responsive**: Mobile-first approach

## 🛠️ Teknologi

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: CSS Custom Properties, Flexbox, Grid
- **Icons**: Unicode Emoji & Custom SVG
- **Animations**: CSS Transitions & Keyframes
- **Responsive**: Media Queries
- **Theme**: CSS Variables untuk dark/light mode

## 📱 Kompatibilitas

### Browser Support
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### Device Support
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (320px - 767px)

## 🔮 Roadmap

### Phase 1 (Current)
- [x] Basic UI/UX Design
- [x] Quick Actions Implementation
- [x] Modal System
- [x] Theme System
- [x] Responsive Design

### Phase 2 (Planned)
- [ ] Backend Integration
- [ ] Real Payment Gateway
- [ ] User Authentication
- [ ] Database Integration
- [ ] Push Notifications

### Phase 3 (Future)
- [ ] Mobile App (React Native)
- [ ] Advanced Analytics
- [ ] AI-powered Features
- [ ] Blockchain Integration
- [ ] Multi-language Support

## 👥 Tim Pengembang

- **UI/UX Designer**: Desain interface dan user experience
- **Frontend Developer**: Implementasi antarmuka pengguna
- **Backend Developer**: Logika server dan database
- **QA Tester**: Testing dan quality assurance

## 📄 Lisensi

Proyek ini dibuat untuk keperluan edukasi dan prototype. Semua hak cipta dilindungi.

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:

1. Fork repository ini
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📞 Kontak

Untuk pertanyaan atau saran, silakan hubungi:
- **Email**: dev@ukiwallet.com
- **GitHub**: [UKI-Wallet Repository](https://github.com/novita11/ukiwallet)

---

<div align="center">
  <p>Dibuat dengan ❤️ untuk komunitas UKI</p>
  <p><strong>UKI-Wallet © 2024</strong></p>
</div>