# 🎯 Round Up! — Gamified Rounding Worksheet

Round Up! is an interactive educational worksheet web application designed to make learning mathematics more engaging and enjoyable for students.

Instead of using traditional static worksheets, this project introduces gamification features such as leaderboards, timers, XP systems, badges, animations, and motivational feedback.

---

## 🌐 Live Demo

🔗 https://rounding-worksheet-app.vercel.app/

---

## ✨ Features

- Gamified worksheet experience
- Responsive design for desktop and mobile
- User name and avatar selection
- Interactive multiple-choice worksheet
- Real-time leaderboard system
- Timer-based ranking system
- XP and badge reward system
- Confetti celebration effects
- Cloud database integration using Supabase
- Reset / clear answers functionality
- Dynamic score calculation
- Motivational feedback messages

---

## 🛠 Technologies Used

| Technology | Purpose |
|---|---|
| React + Vite | Frontend development |
| Supabase | Backend database |
| Vercel | Deployment & hosting |
| CSS3 | Styling & animations |
| Canvas Confetti | Celebration effects |

---

## 📚 Worksheet Source

Worksheet content inspired from:

https://www.mathinenglish.com/

Copyright belongs to the original owner.

---

## 🚀 Installation

Clone the repository:

```bash
git clone https://github.com/akinaaisyah/rounding-worksheet-app.git
```

Go into project folder:

```bash
cd rounding-worksheet-app
```

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🧩 Database Setup

Run this SQL in Supabase:

```sql
create table worksheet_results (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  profile text not null,
  score int not null,
  total int not null,
  percentage int not null,
  time_seconds int,
  xp int,
  badge text,
  created_at timestamp default now()
);
```

---

## 📸 Screenshots

(Add your screenshots here)

---

## 👩‍💻 Developed By

Akina Aishah Yeap  
Software Engineering Student — UTM MJIIT

---

## 📌 Project Objective

The goal of this project is to transform traditional educational worksheets into a more interactive and engaging learning experience through modern web technologies and gamification concepts.

