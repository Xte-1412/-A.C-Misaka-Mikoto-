# ⚡ -A.C-Misaka-Mikoto- ⚡
> ### *“My Lovely Bot – The Ultimate Railgun for Your Discord Productivity & Music Experience.”*

<p align="center">
  <img src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" alt="Maintained">
  <img src="https://img.shields.io/badge/TypeScript-Ready-blue.svg" alt="TypeScript">
  <img src="https://img.shields.io/badge/Lavalink-v4.1.2-orange.svg" alt="Lavalink">
  <img src="https://img.shields.io/badge/Shoukaku-v4-red.svg" alt="Shoukaku">
</p>

---

## 🎵 Overview
**Misaka Mikoto** bukan sekadar bot musik biasa. Dibangun dengan arsitektur **TypeScript** yang modular, bot ini menggunakan **Lavalink v4** sebagai jantung audionya. Dirancang untuk stabilitas tinggi, respon cepat, dan kemampuan bypass algoritma YouTube terbaru.

---

## 🚀 Fitur Utama
* **⚡ High-Voltage Streaming:** Kualitas audio jernih tanpa buffering.
* **📜 Smart Queue:** Sistem antrian cerdas dengan fitur interupsi lagu.
* **🛠️ Modular Engine:** Command handler yang rapi, memudahkan skalabilitas fitur.
* **🛡️ Anti-Block System:** Menggunakan plugin YouTube terbaru (v1.17.0+) untuk menjamin kelancaran playback.
* **🤖 Slash Command Powered:** UI modern menggunakan interaksi resmi Discord.

---

## 📂 Project Anatomy
```text
discord-productivity-bot/
├── 🛸 lavalink/             # Audio Engine (Lavalink.jar & Plugins)
├── 📂 src/
│   ├── ⚔️ commands/         # Core Slash Commands (Music, etc.)
│   ├── 🧬 interfaces/       # Type Definitions
│   ├── 🧠 services/         # Business Logic (QueueManager)
│   ├── 🏗️ struct/           # Bot Client Structure
│   └── 🚀 index.ts          # Application Entry Point
├── 🔐 .env                  # Secrets & Tokens
└── ⚙️ tsconfig.json         # TS Configuration

```

---

## 🛠️ Installation & Setup

### 1. Jantung Audio (Lavalink)

1. Pastikan **Java 17/21** sudah terpasang.
2. Edit `lavalink/application.yml` dan pastikan plugin terbaru aktif:
```yaml
- dependency: "dev.lavalink.youtube:youtube-plugin:1.17.0"

```


3. Jalankan mesin:
```bash
java -jar Lavalink.jar

```



### 2. Otak Bot (Node.js)

1. Install dependencies:
```bash
npm install

```


2. Setup Environment:
```env
DISCORD_TOKEN=your_top_secret_token

```


3. Jalankan bot:
```bash
npm run dev

```



---

## 📝 Command List

| Trigger | Action | Impact |
| --- | --- | --- |
| `/play` | **Instant Play** | Memutar lagu & mereset antrian |
| `/next` | **Add Queue** | Menambahkan lagu ke daftar tunggu |
| `/skip` | **Skip Track** | Melewati lagu yang sedang aktif |
| `/stop` | **Terminate** | Menghentikan musik & keluar dari Voice |

---

## 🔧 Technical Log (Solved Issues)

* ✅ **Error 400 Bad Request:** Resolved via manual payload wrapping for Lavalink v4.
* ✅ **Silent Audio:** Fixed by implementing `libsodium-wrappers` and `opusscript`.
* ✅ **YouTube Signature Error:** Fixed by upgrading to YouTube-Source v1.17.0.

---

<p align="center">
<i>Developed with ❤️ for productivity and music lovers.</i>
</p>

```

-----
