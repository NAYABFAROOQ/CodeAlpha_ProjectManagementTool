# ⚡ PlanPulse — Collaborative Project Management & Kanban Workspace
### CodeAlpha Full Stack Web Development Internship — Task 3

[![CodeAlpha Task 3](https://img.shields.io/badge/CodeAlpha-Task%203%20Completed-8b5cf6?style=for-the-badge)](https://www.codealpha.tech)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![WebSockets](https://img.shields.io/badge/Real--Time-Socket.io-010101?style=for-the-badge&logo=socketdotio)](https://socket.io/)

---

## 📌 Project Overview
**PlanPulse** is a collaborative, high-performance project management platform inspired by **Linear**, **Asana**, and **Trello**. Built as part of the **CodeAlpha Full Stack Web Development Internship (Task 3)**, it delivers a fluid Kanban workflow, interactive checklists, subtasks with live progress metrics, multi-user discussion feeds, and real-time WebSocket synchronization.

Developed by **Nayab Farooq** ([@NAYABFAROOQ](https://github.com/NAYABFAROOQ)).

---

## 🚀 Key Features

### 1. 📋 Interactive Kanban Workflow
- **Fluid HTML5 Drag-and-Drop:** Move task cards across customizable columns (*Backlog, In Progress, In Review, Completed*).
- **Celebration Feedback:** Particle confetti burst upon moving tasks into the *Completed* column.
- **Visual Status Badges:** Priority indicator pills (*Urgent 🔴, High 🟠, Medium 🔵, Low ⚪*) with glowing accents.

### 2. 📝 Deep Task Management & Modals
- **Interactive Checklists & Subtasks:** Add subtasks with automatic completion percentage calculation.
- **Multi-User Discussion Threads:** Post timestamped comments with author avatars and role badges.
- **Tag Management:** Add custom tags for visual categorization.
- **Due Date Watcher:** Automated color-coded overdue warnings.

### 3. 👥 Multi-Persona Collaboration & Team Roles
- **Fast User Switcher:** Seamlessly toggle between team members (*Nayab Farooq (Lead Architect)*, *Sarah Chen (Designer)*, *Marcus Vance (Full Stack)*, *Aisha Patel (QA)*).
- **Avatar Stacks:** Displays assigned teammates directly on card covers and list rows.

### 4. 📊 Multiple View Modes
- **Kanban Board View:** Column-based card workflow with quick-add actions.
- **Table / List View:** Spreadsheet-style view for power users with sorting and inline status controls.
- **Analytics & Workload Dashboard:** Real-time completion velocity, overdue alert tracker, and team workload distribution.

### 5. ⚡ Real-Time WebSockets & Activity Logs
- Live chronological feed recording all team movements, task completions, and comments.
- Socket.io backend to broadcast updates across browser sessions.

---

## 🛠️ Technology Stack
- **Frontend:** React 19, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Backend:** Node.js, Express.js, Socket.io (WebSocket event gateway)
- **Deployment:** Netlify Ready with client-side SPA routing (netlify.toml)

---

## ⚙️ Quick Start & Local Setup

### 1. Run Frontend
```bash
cd client
npm install
npm run dev
```
Visit **http://localhost:5173** to explore PlanPulse!

### 2. Run Real-Time Backend (Optional)
```bash
cd ../server
npm install
npm run dev
```
The backend starts on **http://localhost:5001**.

---

## 🏆 CodeAlpha Internship Submission
- **Intern Name:** Nayab Farooq
- **Domain:** Full Stack Web Development
- **Task:** Task 3 — Project Management Tool (PlanPulse)
- **Organization:** CodeAlpha
- **GitHub Repository:** [NAYABFAROOQ/CodeAlpha_ProjectManagementTool](https://github.com/NAYABFAROOQ/CodeAlpha_ProjectManagementTool)

