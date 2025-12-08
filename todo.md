## 🗺️ High-Level Architecture (Modular & Scalable)

---

### 1. Frontend Layer

| Kategori | Platform/Teknologi | Fungsi Utama |
| :--- | :--- | :--- |
| **Platform** | Web App (**Next.js / React**), Mobile App (**React Native**) | Peta interaktif (**Maplibre**), Dashboard publik, Dashboard admin, Form input data warga, potensi, kejadian |

---

### 2. Backend Layer

| Teknologi | Fungsi Utama |
| :--- | :--- |
| **Node.js** | API Gateway, Modul manajemen data kecamatan/kelurahan, Modul perizinan, Modul laporan masyarakat, Modul notifikasi (**WA Gateway, Email, Push Notification**), Modul IoT listener (**MQTT / HTTP Webhook**) |

---

### 3. Database Layer

| Teknologi | Fungsi |
| :--- | :--- |
| **PostgreSQL + PostGIS** | Untuk data geospasial |
| **Redis** | Caching & event queue |
| **MinIO / AWS S3** | Penyimpanan file upload warga (foto kejadian, dokumen) |

---

### 4. IoT Integration Layer

| Komponen | Teknologi/Perangkat |
| :--- | :--- |
| **IoT Gateway (MQTT Broker)** | **Mosquitto / EMQX** |
| **Perangkat IoT yang terhubung (MVP)** | Sensor ketinggian air (ultrasonic / pressure-based), Sensor curah hujan, GPS untuk alat bergerak (opsional) |

**Integrasi Data:**

$$\text{IoT kirim data} \to \text{MQTT} \to \text{IoT Listener} \to \text{Database} \to \text{Trigger} \to \text{Notifikasi}$$

---

### 5. Security Layer

* **JWT authentication**
* **API rate limiting**
* **IoT key-based authentication**
* **Audit log & tracking perubahan data**
* **HTTPS/TLS security**

---

### 6. Admin Dashboard Layer

* Peta kondisi wilayah
* Status IoT (**OK/Offline**)
* Laporan warga **real-time**
* Data sosial ekonomi, UMKM, fasilitas publik
* Monitoring kejadian (banjir, kriminal, aduan warga)

---

### 7. Public User Layer

* Informasi wilayah
* Update kejadian
* **Early warning banjir**
* Data fasilitas publik (**GIS-based**)
* UMKM Map + pencarian
* Form aduan warga

---

## 💻 Fitur Berbasis Peta (Core MVP) & Modul

---

### A. Fitur Berbasis Peta (Core MVP)

#### 1. Peta Kelurahan/Kecamatan
* Overlay batas wilayah
* Lokasi fasilitas publik
* Layer UMKM
* Layer infrastruktur

#### 2. Peta Early Warning System
* Titik sensor ketinggian air & status warna (**hijau/kuning/merah**)
* Riwayat grafik ketinggian air
* Notifikasi **real-time**

### B. Modul Data Wilayah

* Profil kecamatan
* Daftar RW/RT
* Demografi penduduk
* Peta kepadatan
* Basis data UMKM
* Fasilitas publik (sekolah, posyantek, masjid, puskesmas, dll)

### C. Modul Laporan Masyarakat

* Aduan warga (foto + titik lokasi)
* Status tindak lanjut
* Tracking laporan di peta

### D. Modul IoT

* Dashboard sensor
* Status online/offline
* Threshold alert
* Pengaturan perangkat
* Push notification (**WA/email/app**)

### E. Modul Manajemen Admin

* **CRUD** Data wilayah
* **CRUD** UMKM
* **CRUD** fasilitas umum
* Analitik dasar

---