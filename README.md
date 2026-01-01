# 🎯 FocusFlow

<div align="center">

![FocusFlow Logo](https://img.shields.io/badge/FocusFlow-Habit%20Tracker-FFB4A2?style=for-the-badge)

**A modern, beautiful habit tracking application built with Next.js 15**

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.0-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat-square)](https://clerk.com/)

[Features](#-features) • [Demo](#-live-demo) • [Installation](#-installation) • [Tech Stack](#-tech-stack)

</div>

---

## ✨ Features

### 📊 Habit Tracking
- **Monthly Grid View** - Visual habit tracking with color-coded completion
- **Multiple Goal Types** - Binary (Yes/No), Duration (minutes), Quantity (count)
- **Quick Toggle** - One-click habit completion for any day
- **Weekly Progress** - See completion percentages for each week
- **Archive & Delete** - Manage habits with archive/restore functionality
- **Custom Categories** - Health, Fitness, Mindfulness, Learning, Productivity, Finance, Social, Creativity

### 🤖 AI-Powered Features
- **AI Habit Generator** - Describe what you want to achieve and AI creates the perfect habit
- **Smart Suggestions** - Intelligent habit recommendations based on your goals
- **Local Fallback** - Works even without API key using smart pattern matching

### ⏱️ Focus Timer (Pomodoro)
- **Pomodoro Technique** - 25-minute focus sessions with breaks
- **Multiple Modes** - Focus (25 min), Short Break (5 min), Long Break (15 min)
- **Session Tracking** - Track total focus time and completed sessions
- **Sound Notifications** - Audio alerts when timer completes
- **Habit Integration** - Link timer sessions to specific habits

### 📈 Analytics & Insights
- **Completion Donut Chart** - Monthly completion overview
- **Weekly Bar Charts** - Performance trends across weeks
- **30-Day Trend Line** - Track progress with 7-day moving average
- **Category Radar Chart** - Performance breakdown by habit category
- **Progress Rings** - Visual circular progress indicators
- **Streak Tracking** - Current and longest streaks for each habit
- **Day Analysis** - See best and worst performing days
- **Top Performers** - Habits ranked by completion rate
- **Heatmap View** - GitHub-style activity visualization

### 🏆 Gamification & Badges
50+ achievement badges across multiple categories:

**Streak Badges**
- 🔥 Week Warrior (7 days)
- ⚡ Fortnight Fighter (14 days)
- 🏆 Monthly Master (30 days)
- 💎 Habit Hero (60 days)
- 👑 Century Champion (100 days)
- 🌟 Year Legend (365 days)

**Completion Badges**
- ✨ Perfect Week
- 🌙 Perfect Month
- 🎊 Weekend Warrior
- 💫 Perfect Quarter

**Milestone Badges**
- 🚀 First Step (1st habit)
- 🎯 Habit Builder (5 habits)
- 🏗️ Habit Architect (10 habits)
- 💯 Centurion (100 completions)
- 🎖️ Dedication (500 completions)
- 🏅 Habit Master (1000 completions)

**Special Badges**
- 🌱 Early Bird (joined early)
- 💪 Health Enthusiast
- 🏃 Fitness Fanatic
- 🧘 Mindfulness Master
- 📚 Learning Lover
- ⚡ Productivity Pro
- 🌅 Early Riser
- 🦉 Night Owl

### 📅 Calendar View
- **Year Overview** - 12-month calendar with daily progress circles
- **Color-coded Progress** - Visual indicators for completion levels
- **Yearly Statistics** - Total completions, entries, and averages
- **Month Navigation** - Easy navigation between months

### 📝 Habit Templates
Pre-built habits you can add with one click:

**Health**
- 💧 Drink Water (8 glasses)
- 💊 Take Vitamins
- 😴 Sleep by 11 PM
- 🥗 No Junk Food

**Fitness**
- 🏃 Morning Run
- 💪 Strength Training
- 🧘 Yoga/Stretching
- 🚶 10,000 Steps

**Mindfulness**
- 🧘 Meditation
- 📓 Journaling
- 🙏 Gratitude Practice
- 📵 Digital Detox

**Learning**
- 📚 Read 30 Minutes
- 🎓 Online Course
- 💻 Coding Practice
- 🗣️ Language Learning

**Productivity**
- ✅ Plan Tomorrow
- 📧 Inbox Zero
- 🎯 Deep Work Session
- 📱 No Social Media

### 🏅 Challenges
Pre-built challenge programs to kickstart your journey:

- **30-Day Fitness Challenge** - Build a consistent exercise routine
- **Mindfulness Journey** - Develop mental clarity and peace
- **Productivity Bootcamp** - Optimize your daily workflow
- **21-Day Habit Builder** - Form new habits with science-backed methods
- **Morning Routine Challenge** - Create an energizing start to your day
- **Digital Wellness Reset** - Balance your relationship with technology

### 📤 Data Export
- **CSV Export** - Download habit data in spreadsheet format
- **PDF Reports** - Generate beautiful insights reports
- **Date Range Selection** - Export specific months or custom ranges

### 🎨 Customization
- **Dark/Light Mode** - Full theme support with system preference detection
- **8 Custom Colors** - Personalize each habit with beautiful colors
- **Categories** - Organize habits by type
- **Timezone Support** - Accurate tracking across timezones

### 📱 Mobile Responsive
- **Fully Responsive** - Works perfectly on all devices
- **Touch Optimized** - Smooth interactions on mobile
- **PWA Ready** - Install as a native-like app

### 💬 Motivational Features
- **Daily Quotes** - Inspiring quotes on your dashboard
- **Streak Messages** - Personalized motivation based on your streaks
- **Progress Celebrations** - Visual feedback on achievements

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling |
| **Prisma 7** | Database ORM |
| **Neon PostgreSQL** | Serverless database |
| **Clerk** | Authentication & user management |
| **Chart.js** | Interactive charts and graphs |
| **Lucide Icons** | Beautiful icon library |
| **Google Gemini** | AI habit generation |

---

## 🚀 Installation

### Prerequisites
- Node.js 18+
- npm or pnpm
- PostgreSQL database (or Neon account)
- Clerk account for authentication

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/focusflow.git
cd focusflow
```

### 2. Install dependencies
```bash
npm install
# or
pnpm install
```

### 3. Set up environment variables
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://..."

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# AI (Optional - for AI habit generation)
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Set up the database
```bash
npx prisma generate
npx prisma db push
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

---

## 📁 Project Structure

```
focusflow/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding
├── public/
│   ├── manifest.json      # PWA manifest
│   └── sw.js              # Service worker
├── src/
│   ├── app/
│   │   ├── (app)/         # Protected app routes
│   │   │   ├── dashboard/ # Main dashboard
│   │   │   ├── habits/    # Habit management
│   │   │   ├── calendar/  # Calendar view
│   │   │   ├── insights/  # Analytics page
│   │   │   ├── settings/  # User settings
│   │   │   └── export/    # Data export
│   │   ├── api/           # API routes
│   │   │   ├── entries/   # Habit entries CRUD
│   │   │   ├── habits/    # Habits CRUD + AI
│   │   │   ├── badges/    # Badge system
│   │   │   └── insights/  # Analytics data
│   │   ├── sign-in/       # Auth pages
│   │   └── sign-up/
│   ├── components/        # React components
│   │   ├── HabitGrid.tsx  # Main habit grid
│   │   ├── FocusTimer.tsx # Pomodoro timer
│   │   ├── DonutChart.tsx # Charts
│   │   ├── Heatmap.tsx    # Activity heatmap
│   │   └── ...
│   └── lib/               # Utilities
│       ├── badges.ts      # Badge definitions
│       ├── templates.ts   # Habit templates
│       ├── challenges.ts  # Challenge templates
│       ├── quotes.ts      # Motivational quotes
│       └── analytics.ts   # Analytics helpers
├── package.json
└── README.md
```

---

## 🔧 Configuration

### Database Indexes
For optimal performance, the following indexes are configured:
- `habits(userId, active)` - Fast active habit queries
- `habits(userId, createdAt)` - Efficient sorting
- `habit_entries(userId, entryDate)` - Quick date range queries
- `badges(userId)` - Fast badge lookups

### Performance Optimizations
- Dynamic imports for chart components
- API response caching
- Modular Lucide icon imports
- Image optimization with AVIF/WebP

---

## 📱 PWA Support

FocusFlow can be installed as a Progressive Web App:

1. Open the app in Chrome/Edge
2. Click the install icon in the address bar
3. Enjoy native-like experience!

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Clerk](https://clerk.com/) - Authentication
- [Neon](https://neon.tech/) - Serverless Postgres
- [Chart.js](https://www.chartjs.org/) - JavaScript charts
- [Lucide](https://lucide.dev/) - Beautiful icons

---

<div align="center">

**Built with ❤️ for better habits**

[⬆ Back to Top](#-focusflow)

</div>
