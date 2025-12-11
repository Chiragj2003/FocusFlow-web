# 🎯 FocusFlow

<div align="center">

![FocusFlow Logo](https://img.shields.io/badge/FocusFlow-Habit%20Tracker-FFB4A2?style=for-the-badge)

**A modern, beautiful habit tracking application built with Next.js 15**

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [Screenshots](#-screenshots)

</div>

---

## ✨ Features

### 📊 Habit Tracking
- **Monthly Grid View** - Visual habit tracking with color-coded completion
- **Multiple Goal Types** - Binary (Yes/No), Duration (minutes), Quantity (count)
- **Quick Toggle** - One-click habit completion for any day
- **Weekly Progress** - See completion percentages for each week

### 📈 Analytics & Insights
- **Donut Charts** - Monthly completion overview
- **Weekly Bar Charts** - Performance trends across weeks
- **Streak Tracking** - Current and longest streaks for each habit
- **Top Performers** - See your best habits ranked by completion rate
- **Habit Summaries** - Detailed statistics for each habit

### 📅 Calendar View
- **Year Overview** - 12-month calendar with daily progress circles
- **Color-coded Progress** - Visual indicators for completion levels
- **Yearly Statistics** - Total completions, entries, and averages

### 📤 Data Export
- **CSV Export** - Download your habit data in spreadsheet format
- **PDF Reports** - Generate beautiful PDF insights reports
- **Date Range Selection** - Export specific months or custom ranges

### 🎨 Customization
- **Dark/Light Mode** - Full theme support with system preference detection
- **Custom Colors** - 8 preset colors for habits
- **Categories** - Organize habits by Health, Fitness, Mindfulness, etc.
- **Timezone Support** - Accurate tracking across timezones

### 🔐 Account Management
- **Secure Authentication** - Powered by Clerk
- **Account Deactivation** - Pause tracking without losing data
- **Safe Deletion** - Type confirmation required to delete account
- **Profile Management** - Easy profile updates via Clerk

---

## 🚀 Demo

Experience FocusFlow live: [Coming Soon]

---

## 🛠 Installation

### Prerequisites

- Node.js 18.17 or later
- PostgreSQL database (or Neon serverless)
- Clerk account for authentication

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Chiragj2003/FocusFlow-web.git
   cd FocusFlow-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL="your-postgresql-connection-string"
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxxxx
   CLERK_SECRET_KEY=sk_xxxxx
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🏗 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 15](https://nextjs.org/) with App Router |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) with [Neon](https://neon.tech/) |
| **ORM** | [Prisma](https://www.prisma.io/) |
| **Authentication** | [Clerk](https://clerk.com/) |
| **Charts** | [Chart.js](https://www.chartjs.org/) + [react-chartjs-2](https://react-chartjs-2.js.org/) |
| **PDF Generation** | [jsPDF](https://github.com/parallax/jsPDF) + [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 📁 Project Structure

```
focusflow/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── public/
│   └── manifest.json      # PWA manifest
├── src/
│   ├── app/
│   │   ├── (app)/         # Protected app routes
│   │   │   ├── dashboard/ # Main dashboard
│   │   │   ├── habits/    # Habit tracking grid
│   │   │   ├── insights/  # Analytics & charts
│   │   │   ├── calendar/  # Year calendar view
│   │   │   ├── export/    # Data export
│   │   │   └── settings/  # User settings
│   │   ├── api/           # API routes
│   │   │   ├── habits/    # Habit CRUD
│   │   │   ├── entries/   # Entry management
│   │   │   ├── insights/  # Analytics endpoints
│   │   │   ├── exports/   # CSV/PDF export
│   │   │   └── account/   # Account management
│   │   ├── sign-in/       # Auth pages
│   │   └── sign-up/
│   ├── components/        # Reusable components
│   │   ├── HabitGrid.tsx
│   │   ├── DonutChart.tsx
│   │   ├── WeeklyBars.tsx
│   │   ├── Sidebar.tsx
│   │   └── ...
│   └── lib/               # Utilities
│       ├── analytics.ts   # Insights calculations
│       ├── db.ts          # Prisma client
│       ├── theme.tsx      # Theme provider
│       └── utils.ts       # Helper functions
└── package.json
```

---

## 📸 Screenshots

### Dashboard
The main dashboard shows your daily summary, streaks, and recent activity.

### Habits Grid
Track habits with an intuitive monthly grid - click to toggle completion.

### Insights
Visualize your progress with charts, completion rates, and streak information.

### Calendar
View the entire year at a glance with progress circles for each day.

### Dark Mode
Full dark mode support for comfortable tracking at night.

---

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/habits` | List all habits |
| POST | `/api/habits` | Create a new habit |
| PUT | `/api/habits/[id]` | Update a habit |
| DELETE | `/api/habits/[id]` | Delete a habit |
| GET | `/api/entries` | Get entries for date range |
| POST | `/api/entries` | Create/update an entry |
| GET | `/api/insights/summary` | Get analytics summary |
| GET | `/api/insights/streaks` | Get streak information |
| GET | `/api/exports/csv` | Download CSV export |
| GET | `/api/exports/insights` | Get data for PDF export |

---

## 🎨 Customization

### Adding New Colors

Edit `src/components/AddHabitModal.tsx`:

```typescript
const PRESET_COLORS = [
  '#FFB4A2', // Peach (Primary)
  '#CDE7E4', // Teal (Accent)
  '#E2D6FF', // Lavender
  // Add more colors here
]
```

### Adding Categories

Edit `src/components/AddHabitModal.tsx`:

```typescript
const CATEGORIES = [
  'Health',
  'Fitness',
  'Mindfulness',
  // Add more categories here
]
```

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

## 👤 Author

**Chirag**

- GitHub: [@Chiragj2003](https://github.com/Chiragj2003)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Clerk](https://clerk.com/) for authentication
- [Neon](https://neon.tech/) for serverless PostgreSQL
- [Vercel](https://vercel.com/) for hosting
- [Lucide](https://lucide.dev/) for beautiful icons

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ by Chirag

</div>

## API Endpoints

### Habits
- `GET /api/habits` - List all habits
- `POST /api/habits` - Create a habit
- `PUT /api/habits/[id]` - Update a habit
- `DELETE /api/habits/[id]` - Delete a habit

### Entries
- `GET /api/entries` - Get entries (with date filters)
- `POST /api/entries` - Create/update an entry

### Analytics
- `GET /api/insights/summary` - Get analytics summary
- `GET /api/insights/streaks` - Get streak information
- `GET /api/exports/csv` - Export data as CSV

## Design Tokens

| Token | Value |
|-------|-------|
| Primary | `#FFB4A2` (Peach) |
| Accent | `#CDE7E4` (Teal) |
| Background | `#FAFAFA` |
| Text | `#111827` |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy!

## License

MIT License - feel free to use this for your own projects!
