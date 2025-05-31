# Guidelines
1. This repository contains several tasks related to your main objective: building a website.
Each task will be clearly marked in the code as: `TASK: task description`.

2. Place all of your website code in the `/app` directory.

3. Do not move, modify, or delete any code within the `/api` and `/utils` directories.

4. You are required to use the exported modules from `/api` and `/utils` to complete their respective tasks.

---
# Submission
You may put any documentation or notes related to your submission here.

## 🛠️ Tech Stack
- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4.1
- **Routing**: React Router v7
- **State Management**: TanStack Query (React Query)
- **Build Tool**: Vite
- **Content Processing**: Markdown-it untuk MDX rendering
- **Deployment**: Vercel

## 🌟 Fitur Utama
- **Feed Diary Perjalanan**: Tampilan beranda dengan infinite scroll untuk melihat semua cerita perjalanan
- **Detail Artikel**: Halaman detail yang menampilkan konten lengkap dengan format MDX
- **Rendering MDX**: Mendukung embedded components (YouTube, Instagram, TikTok, Twitter)
- **SEO Optimized**: Meta tags lengkap, Open Graph, Twitter Cards, dan Structured Data
- **Dark/Light Mode**: Theme toggle dengan penyimpanan preferensi
- **Responsive Design**: Optimal di semua ukuran layar
- **Image Optimization**: Optimasi gambar otomatis dengan lazy loading
- **Error Handling**: Error boundaries dan fallback UI yang elegant
- **Performance Optimized**: React Query untuk caching, code splitting, dan prefetching



## 📁 Struktur Project

```
src/
├── api/           # API clients dan CMS integration
├── components/    # Komponen UI reusable
├── contexts/      # React contexts (Theme)
├── hooks/         # Custom hooks
├── pages/         # Halaman utama (Home, Detail)
├── router/        # Routing configuration
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev

# Build untuk production
npm run build

# Preview production build
npm run preview
```
