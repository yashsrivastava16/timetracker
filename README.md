# TimeTracker

A premium, distraction-free productivity and time-management application built with Next.js. TimeTracker helps you orchestrate your day with handcrafted focus blocks, a minimalist deep-work timer, daily tasks, and smart cross-device push notifications.

![Hero Banner](/public/redme.png)

## ✨ Features

- **Deep Focus Blocks**: Set intentional blocks of time for deep work. The elegant timer UI keeps you focused with zero distractions.
- **Smart Push Notifications**: Built-in Service Worker and Web Push integration. Get beautifully timed nudges 15 minutes before your schedule, or exactly when your Daily Tasks are due.
- **Multi-Device Support**: Enable notifications on your laptop, phone, or tablet. TimeTracker intelligently syncs and pushes to all your registered devices simultaneously.
- **Daily Tasks**: Manage ad-hoc tasks with precise AM/PM reminder scheduling. 
- **Analytics & Progression**: Track your 10-minute micro-learnings. Visualize your focus consistency over time with an intuitive GitHub-style contribution calendar.
- **Premium Aesthetics**: A stunning dark-mode-first design featuring glassmorphism (`backdrop-blur`), smooth micro-animations, and curated typography.
- **Automated Cron Jobs**: Powered by Vercel Cron to reliably trigger background jobs and notifications every minute.

## 🛠️ Tech Stack

- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), React, Tailwind CSS, Lucide Icons
- **Backend**: Next.js API Routes, Node.js
- **Database**: [MongoDB](https://www.mongodb.com/) & Mongoose
- **Authentication**: [Clerk](https://clerk.dev/)
- **Push Notifications**: `web-push` library & native Browser Service Workers
- **Deployment & Cron**: [Vercel](https://vercel.com/)

## 🚀 Getting Started (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/TimeTracker.git
cd TimeTracker
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory and add the following keys:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster...
MONGODB_DB=your_db_name

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Web Push Notifications (VAPID Keys)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
```

> **Note**: To generate your own VAPID keys for push notifications, you can run: 
> `npx web-push generate-vapid-keys`

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Cron Jobs in Production
The repository includes a `vercel.json` file:
```json
{
  "crons": [
    {
      "path": "/api/cron/push",
      "schedule": "* * * * *"
    }
  ]
}
```
Vercel will automatically read this file and ping your background push notification worker every 60 seconds. You do not need to set up any external cron services if you are on a Vercel plan that supports 1-minute intervals. 

## 📝 License
This project is open-source and available under the MIT License.
