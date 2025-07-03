# Life OS 🚀

A comprehensive personal operating system for managing your life, habits, goals, and productivity. Transform your daily routine into an intelligent, time-aware personal dashboard.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-life.shivagupta.top-blue?style=for-the-badge)](https://life.shivagupta.top)
[![GitHub](https://img.shields.io/github/license/shiva1290/life-os?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

## 🌟 Features

### 🎯 Core Productivity Features
- **🗓️ Smart Timeline Management** - AI-powered daily timeline with intelligent recommendations
- **✅ Task Management** - Advanced todo system with categories, priorities, and archiving
- **🎯 Habit Tracking** - Visual habit streaks with GitHub-style contribution grids
- **⏰ Focus Timer** - Pomodoro-style sessions with detailed tracking
- **💪 Fitness Integration** - Gym check-ins and workout timeline
- **🎯 Career Timeline** - Professional milestone tracking

### 💻 Developer Features
- **🧠 DSA Tracker** - Data Structures & Algorithms problem tracking with streaks
- **📊 Progress Analytics** - Comprehensive weekly and monthly progress insights
- **🎯 Goal Setting** - Functional habit goals with smart insights

### 🔧 System Features
- **👤 Guest Mode** - Fully functional demo with sample data
- **🔐 Secure Authentication** - Supabase-powered user management
- **📱 Responsive Design** - Mobile-first approach with touch-friendly interfaces
- **🌐 Offline Support** - Local storage fallback for uninterrupted usage
- **🔄 Real-time Sync** - Cross-device synchronization
- **⏰ Timezone Accuracy** - Proper local timezone handling for global users

## 🛠️ Tech Stack

### Frontend
- **⚛️ React 18.3.1** - Modern React with hooks and suspense
- **📘 TypeScript 5.5.3** - Type-safe development
- **⚡ Vite** - Lightning-fast build tool and dev server
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🧩 shadcn/ui** - High-quality component library
- **🎯 Lucide Icons** - Beautiful, customizable icons

### Backend & Services
- **🗄️ Supabase** - PostgreSQL database with real-time features
- **🔐 Supabase Auth** - User authentication and authorization
- **🌐 Vercel** - Edge deployment platform

### State Management & Utilities
- **🔄 React Query** - Server state management
- **🧭 React Router** - Client-side routing
- **📅 date-fns** - Modern date utility library
- **🎨 Recharts** - Composable charting library
- **🔔 Sonner** - Toast notifications

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- **npm** or **yarn** or **bun**

### Installation

```bash
# Clone the repository
git clone https://github.com/shiva1290/life-os.git
cd life-os

# Install dependencies
npm install
# or
yarn install
# or
bun install

# Start development server
npm run dev
# or
yarn dev
# or
bun dev
```

Visit `http://localhost:5173` to see the app running locally.

### Environment Setup

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🏗️ Project Structure

```
life-os/
├── public/                 # Static assets
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── HabitTracker.tsx
│   │   ├── DailyTodos.tsx
│   │   ├── DSATracker.tsx
│   │   ├── FocusTimer.tsx
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.tsx
│   │   ├── useGuestMode.tsx
│   │   └── useSupabaseSync.tsx
│   ├── pages/             # Route components
│   │   ├── Landing.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Habits.tsx
│   │   └── Timelines.tsx
│   ├── lib/               # Utility functions
│   │   ├── utils.ts
│   │   ├── timeUtils.ts
│   │   └── dataService.ts
│   ├── integrations/      # External service integrations
│   │   └── supabase/
│   └── utils/             # Helper utilities
├── supabase/              # Database migrations
└── docs/                  # Documentation
```

## 📱 Usage Guide

### Getting Started
1. **🔗 Visit the Live Demo**: [life.shivagupta.top](https://life.shivagupta.top)
2. **👤 Try Guest Mode**: Click "Try Guest Mode" to explore all features with sample data
3. **📝 Create Account**: Sign up to save your progress and sync across devices

### Key Features Walkthrough

#### 🏠 Dashboard
- **Now Card**: Get intelligent, time-aware recommendations
- **Daily Overview**: See today's habits, todos, and timeline
- **Quick Actions**: Access frequently used features

#### ✅ Habit Tracking
- **Daily Check-ins**: Mark habits as complete with a single tap
- **Streak Visualization**: GitHub-style contribution grid
- **Progress Analytics**: Weekly and monthly insights

#### 📋 Task Management
- **Smart Categories**: Organize todos by type and priority
- **Archive System**: Keep completed tasks for reference
- **Quick Add**: Rapidly capture tasks with keyboard shortcuts

#### ⏰ Focus Sessions
- **Pomodoro Timer**: 25-minute focused work sessions
- **Session Tracking**: Monitor productivity patterns
- **Break Reminders**: Automatic break notifications

### 💻 For Developers

#### DSA Tracker
- **Problem Logging**: Track coding problems solved daily
- **Streak Counters**: Maintain coding consistency
- **Weekly Goals**: Set and achieve programming targets

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

The build outputs to `dist/` directory and can be deployed to any static hosting service.

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **🍴 Fork the repository**
2. **🌿 Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **💾 Commit changes**: `git commit -m 'Add amazing feature'`
4. **📤 Push to branch**: `git push origin feature/amazing-feature`
5. **🔄 Open a Pull Request**

### Development Guidelines
- **📝 Write TypeScript** for type safety
- **🧪 Add tests** for new features
- **📚 Update documentation** for API changes
- **🎨 Follow existing code style**

## 🗄️ Database Schema

The app uses Supabase with the following main tables:
- **`habits`** - User habit definitions and tracking
- **`todos`** - Task management and completion
- **`focus_sessions`** - Pomodoro timer sessions
- **`dsa_problems`** - Coding problem tracking
- **`daily_blocks`** - Timeline schedule blocks

## 📊 Analytics & Insights

- **📈 Habit Streaks**: Track consistency across all habits
- **⏱️ Time Analysis**: See where you spend your time
- **🎯 Goal Progress**: Monitor weekly and monthly objectives
- **📱 Usage Patterns**: Understand your productivity rhythms

## 🐛 Known Issues & Roadmap

### Current Limitations
- **📱 Mobile app**: Native mobile app in development
- **🔄 Offline sync**: Enhanced offline capability planned
- **📊 Advanced analytics**: More detailed insights coming soon

### Upcoming Features
- **🤖 AI Recommendations**: Smart habit and task suggestions
- **👥 Team Features**: Collaborative productivity tools
- **📱 Mobile App**: Native iOS/Android applications
- **🔌 Integrations**: Calendar, fitness tracker, and more


## 🙏 Acknowledgments

- **🎨 shadcn/ui** for the beautiful component library
- **⚡ Supabase** for the excellent backend-as-a-service
- **🎯 Vercel** for seamless deployment platform
- **🌟 Open Source Community** for inspiration and contributions

## 📞 Support & Contact

- **🌐 Live Demo**: [life.shivagupta.top](https://life.shivagupta.top)
- **🐛 Bug Reports**: [GitHub Issues](https://github.com/shiva1290/life-os/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/shiva1290/life-os/discussions)
- **📧 Email**: shivaguptaj26@gmail.com

---

<div align="center">

**Built with ❤️ by [Shiva Gupta](https://github.com/shiva1290)**

⭐ **Star this repo if it helped you organize your life!** ⭐

</div>
