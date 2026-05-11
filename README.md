## update 2026

- Extracted home page GSAP animations into a separate `animations.ts` file.
- Home page feature cards now use the reusable `Card` UI component (`@/components/ui/card`).
- Added animated gradient orb background (purple, teal, fuchsia) with floating GSAP animations.
- Home page cards have staggered entrance animations and lift/shadow effects on hover.
- PlusCircle icon on "Create a Post" button spins 180° with scale on hover.
- ArrowRight icon on "View All Posts" button bounces back and forth continuously.
- "Git Talks" title drops in with a spring overshoot effect on page load.
- Home page text fully translated to both Dutch and English.
- Created reusable `HomePageButton` component with icon, label, variant (default/outline/secondary), optional animated arrow, and optional icon ref for GSAP animations.
- Created reusable `HomePageCard` component with icon (teal-500 color), title, description, and callback ref for animation registration.
- Added "Go to Dashboard" button on the landing page linking to `/home`.

### New Dashboard Page (`/home`)
- Built a full dashboard layout with a fixed teal sidebar and content area.
- **DashboardSidebar** component with navigation items (Home, Categories, Notifications, Settings, Messages) — each with Lucide icons and active state highlighting.
- **DashboardSearch** component — reusable search input with search icon, filters posts by title/category in real-time.
- **DashboardStatCard** component — reusable stat card showing label, value, icon in teal-50 background, and trend indicator (up/down arrow).
- Four stat cards on the dashboard: Active Topics, New Comments, Trending Categories, Page Views — all pulling data from Redux store.
- **DashboardRecentActivity** component — table showing the 5 most recent/filtered posts with columns: Topic, Category, Date, Status (Active/Resolved) with status badges and hover row highlighting.
- Top bar with search input on the left and notification bell + user badge on the right.
- **Notification bell** with animated red badge count and ping animation; badge hides on hover (marks as read).
- Posts refetch when navigating back to the dashboard so new posts appear immediately.

### Notifications Page (`/notifications`)
- Lists the 10 most recent posts sorted by newest first.
- Posts with comments show as "X new comments" (blue message icon), new posts show as "New post created" (green plus icon).
- Each notification links to the corresponding post detail page.
- Empty state with centered bell icon when no notifications exist.

### Messages Page (`/messages`)
- Unified inbox showing all comments across all posts, sorted by newest first.
- Each message shows the comment author, the post title they commented on, the comment body (2-line clamp), date, and category.
- Each message links to the post detail page.
- Empty state when no comments exist.

### Settings Page (`/settings`)
- **Language Switcher** — toggle between English and Dutch, using `i18n.changeLanguage()`.
- **Theme Toggle** — switch between Light and Dark mode.
- Theme preference persists in `localStorage`.
- Dark mode support added across all dashboard pages using Tailwind's `dark:` variant (`@custom-variant dark`).

### Recent Activity Table (Dashboard)
- Displays real post data from the Redux store (title, category, date, status based on vote score).
- Filters in real-time when typing in the search bar.

## update 2024

- Update project using Vite instead of react-create-app.
- Refactor styling using `shadcn/ui` and `Tailwind`
- Adding typescript to the project.
- Implemented `internationalization` to the project => languages are `dutch` and `english`.

## Readable: A Reddit clone

This is the second project for the Udacity React Nanodegree programm.
This application is a Reddit clone, made using React and Redux. The users will be able to search for categories, to post content,comment on their posts and other users' posts, and vote on posts and comments. Users will also be able to edit and delete posts and comments.

Important! The assignment did not specify any use of authentication. From the API provided, each user has access to its own set of posts and comments, and can modify or delete any entry.

## Getting Started

> - git clone git@github.com:peeweetje/Udacity-React-Nanodegree-Project-2.git

> - `pnpm install`
> - `pnpm start`

> - `cd server`
> - `pnpm install`
> - To start the server:
> - `node server.js`
