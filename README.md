# Git Talks - A Reddit Clone

A modern Reddit-style application built with React, Redux, and TypeScript. This project is part of the Udacity React Nanodegree program.

## 🌟 Features

### Core Functionality
- **Posts Management**: Create, read, update, and delete posts
- **Comments System**: Comment on posts and engage in discussions
- **Voting System**: Upvote and downvote posts and comments
- **Categories**: Browse content organized by categories
- **Search**: Real-time search across posts and categories

### Advanced Features
- **Dashboard**: Comprehensive analytics and activity overview
- **Notifications**: Real-time notification system with animated badges
- **Messages**: Unified inbox for all comments across posts
- **Settings**: Language switching (English/Dutch) and theme toggle (Light/Dark mode)
- **Animations**: Smooth GSAP animations throughout the application

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Redux Toolkit
- **Styling**: Tailwind CSS, shadcn/ui components
- **Animations**: GSAP (GreenSock Animation Platform)
- **Build Tool**: Vite
- **Internationalization**: i18n support (English & Dutch)
- **Backend**: Node.js Express server (provided API)

## 📁 Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components (shadcn)
│   │   ├── dashboard-page/ # Dashboard components
│   │   ├── posts-page/     # Posts management
│   │   ├── animations/     # GSAP animation utilities
│   │   └── ...             # Other feature components
│   ├── redux/              # Redux store and slices
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── server/                 # Backend API server
├── locales/                # i18n translation files
└── public/                 # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:peeweetje/Udacity-React-Nanodegree-Project-2.git
   cd Udacity-React-Nanodegree-Project-2
   ```

2. **Install frontend dependencies**
   ```bash
   pnpm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   pnpm install
   cd ..
   ```

### Running the Application

1. **Start the backend server** (in one terminal)
   ```bash
   cd server
   node server.js
   ```

2. **Start the frontend** (in another terminal)
   ```bash
   pnpm start
   ```

3. **Open your browser**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8080`

## 🎨 Key Features Breakdown

### Dashboard (`/home`)
- **Sidebar Navigation**: Fixed teal sidebar with navigation items
- **Stat Cards**: Display Active Topics, New Comments, Trending Categories, Page Views
- **Recent Activity Table**: Shows latest posts with filtering capabilities
- **Search Functionality**: Real-time post filtering
- **Notification System**: Animated bell with badge count

### Posts Page
- Full CRUD operations for posts
- Category-based organization
- Voting system for posts and comments
- Edit and delete functionality

### Notifications (`/notifications`)
- Lists 10 most recent posts
- Shows new comments and new posts
- Direct links to post details
- Empty state handling

### Messages (`/messages`)
- Unified inbox for all comments
- Shows comment author, post title, and content preview
- Sorted by newest first
- Links to corresponding posts

### Settings (`/settings`)
- **Language Switcher**: Toggle between English and Dutch
- **Theme Toggle**: Switch between Light and Dark modes
- **Animation Toggle**: Enable/disable interface animations
- Preferences persist in localStorage

## 🎯 Recent Updates (2026)

### Performance & Architecture
- ✅ Migrated from Create React App to Vite for faster builds
- ✅ Implemented TypeScript for better type safety
- ✅ Refactored to use shadcn/ui and Tailwind CSS

### User Experience
- ✅ Added comprehensive i18n support (English/Dutch)
- ✅ Implemented dark mode with smooth transitions
- ✅ Enhanced animations with GSAP for better UX
- ✅ Created reusable components for consistency

### New Components
- ✅ `HomePageButton` - Reusable button with variants
- ✅ `HomePageCard` - Animated feature cards
- ✅ `DashboardStatCard` - Analytics display cards
- ✅ `DashboardRecentActivity` - Activity table
- ✅ `NotificationBell` - Animated notification system

## 📝 Important Notes

- **No Authentication**: The application doesn't implement user authentication. Each user has access to all posts and comments through the provided API.
- **API Server**: The backend server must be running for the application to function properly.
- **Data Persistence**: Data is stored in memory on the server (restarts will clear data).

## 🤝 Contributing

This is an educational project for the Udacity React Nanodegree. Feel free to explore the codebase and learn from it.

## 📄 License

This project is part of the Udacity React Nanodegree program and is intended for educational purposes.

## 🙏 Acknowledgments

- Udacity for the React Nanodegree program
- shadcn/ui for the excellent component library
- GSAP for amazing animation capabilities
- The React and TypeScript communities