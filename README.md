# 🏓 EDGE Berlin Ping Pong Tournament

A real-time table tennis tournament management system for EDGE Berlin dormitory. Built with React and Supabase for live score updates.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Realtime-green?logo=supabase)
![Vite](https://img.shields.io/badge/Vite-7-purple?logo=vite)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Features

- **Real-time Score Updates** - Live match scores sync instantly across all connected clients via WebSocket
- **Player Registration** - Easy sign-up for tournament participants
- **Admin Panel** - Create matches, update scores, manage players
- **Supabase Auth** - Secure email/password authentication for admins
- **Leaderboard** - Track wins/losses and rankings
- **Mobile Optimized** - Fully responsive design for all devices
- **Secure** - Environment-based configuration, RLS policies, no hardcoded secrets

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/emreysrs/PingPong-Tournament-Website.git
   cd PingPong-Tournament-Website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Set up Supabase database**
   
   Run this SQL in your Supabase SQL Editor:
   ```sql
   -- Players table
   CREATE TABLE players (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     nickname TEXT,
     wins INTEGER DEFAULT 0,
     losses INTEGER DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Matches table
   CREATE TABLE matches (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     player1_id UUID REFERENCES players(id),
     player2_id UUID REFERENCES players(id),
     player1_score INTEGER DEFAULT 0,
     player2_score INTEGER DEFAULT 0,
     status TEXT DEFAULT 'upcoming',
     winner_id UUID REFERENCES players(id),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable real-time
   ALTER PUBLICATION supabase_realtime ADD TABLE matches;
   ALTER PUBLICATION supabase_realtime ADD TABLE players;

   -- Row Level Security
   ALTER TABLE players ENABLE ROW LEVEL SECURITY;
   ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Allow all" ON players FOR ALL USING (true);
   CREATE POLICY "Allow all" ON matches FOR ALL USING (true);
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

---

## 🌐 Deployment (Vercel)

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/emreysrs/PingPong-Tournament-Website)

### Manual Deployment

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

---

## 🔐 Admin Access

Admin authentication uses Supabase Auth. To set up an admin user:

1. **Create admin user** in Supabase Dashboard → Authentication → Users
2. **Run SQL** to add the user to admins table:
   ```sql
   -- Create admins table
   CREATE TABLE admins (
     id UUID PRIMARY KEY REFERENCES auth.users(id),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Allow read" ON admins FOR SELECT USING (true);
   
   -- Add your admin (replace with actual user UUID)
   INSERT INTO admins (id) VALUES ('your-user-uuid-here');
   ```
3. Login with admin email/password on the website

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | Frontend framework |
| **Vite 7** | Build tool |
| **Supabase** | Backend & real-time database |
| **CSS3** | Styling (no frameworks) |

---

## 📁 Project Structure

```
pingpongwebsite/
├── public/
│   └── logo.png          # EDGE Berlin logo
├── src/
│   ├── App.jsx           # Main application component
│   ├── supabase.js       # Supabase client configuration
│   ├── index.css         # Global styles
│   └── main.jsx          # React entry point
├── .env.example          # Environment variables template
├── vercel.json           # Vercel deployment config
└── README.md
```

---

## 📱 Screenshots

### Home Page
Live matches, leaderboard, and event information.

### Admin Panel
Create matches, update scores in real-time.

### Player Registration
Simple sign-up flow for participants.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Credits

Built for **EDGE Berlin** by Edge Student Hub GmbH 🏠

Made with ❤️ and 🏓
