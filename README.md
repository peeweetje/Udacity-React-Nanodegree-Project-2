## update 2026

- Extracted home page GSAP animations into a separate `animations.ts` file.
- Home page feature cards now use the reusable `Card` UI component (`@/components/ui/card`).
- Added animated gradient orb background (purple, teal, fuchsia) with floating GSAP animations.
- Home page cards have staggered entrance animations and lift/shadow effects on hover.
- PlusCircle icon on "Create a Post" button spins 180° with scale on hover.
- ArrowRight icon on "View All Posts" button bounces back and forth continuously.
- "Git Talks" title drops in with a spring overshoot effect on page load.
- Home page text fully translated to both Dutch and English.

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
