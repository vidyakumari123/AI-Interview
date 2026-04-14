# Prept 🎯

**Prept** is a comprehensive, full-stack mock interview platform designed to help engineers prepare for technical interviews. It seamlessly connects candidates with expert interviewers to conduct realistic, role-specific mock interviews featuring built-in HD video calls, persistent chat, AI-powered interview questions, and automated post-interview feedback.

## ✨ Key Features
- **Credit-Based Booking System:** A streamlined scheduling flow where users can browse expert interviewers by categories (Frontend, Backend, System Design, DevOps, etc.) and seamlessly book available time slots.
- **HD Video Calling & Screen Sharing:** Integrated reliable, low-latency video and audio communication right in the browser, complete with call controls and layouts.
- **Persistent Interview Chat:** Persistent chat channels created per booking for candidates and interviewers to communicate, share links, and leave notes.
- **AI-Powered Questions Panel:** Real-time generation of interview questions tailored dynamically to the candidate's target role natively within the interview dashboard.
- **Automated Call Recordings & Webhooks:** Automatic recording capabilities powered by Stream. Transcripts and recordings are automatically synchronized to the local database via webhooks.
- **Post-Session Feedback:** Built-in AI feedback reports rating technical depth, communication, and problem-solving skills automatically served upon call completion.

---

## 🛠️ Tech Stack & Tools Used

Prept is built with a modern, high-performance web development stack leveraging the best tools available in the ecosystem:

### **Core Framework**
- **[Next.js 16](https://nextjs.org/)** (App Router): React framework for server-side rendering, API handling, and optimized routing.
- **[React 19](https://react.dev/)**: Building the dynamic, interactive client interfaces.

### **Authentication & Security**
- **[Clerk](https://clerk.com/)**: Comprehensive user authentication and identity management, utilizing Clerk user metadata to enforce roles (Interviewer/Interviewee) and tier plans (Starter/Pro).
- **[Arcjet](https://arcjet.com/)**: Security infrastructure providing robust API rate limiting to protect scheduling and booking endpoints from abuse.

### **Database & State Management**
- **[Prisma ORM](https://www.prisma.io/)**: Type-safe database mapping and management.
- **[PostgreSQL](https://www.postgresql.org/)**: Primary relational database handling extensive relationships (Users, Bookings, Credit Transactions, etc.).
- **[Supabase](https://supabase.com/):** For connection pooling and scalable Postgres hosting.

### **Video & Real-Time Communications**
- **[Stream Video React SDK](https://getstream.io/video/)**: Powers the high-fidelity video calling pipeline, custom video layouts, and recording handling capabilities.
- **[Stream Chat React](https://getstream.io/chat/)**: Powers the persistent, real-time messaging pipeline built directly alongside the video environment.

### **UI / UX Design & Styling**
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Utility-first CSS framework for deeply custom, responsive styling.
- **[Shadcn UI](https://ui.shadcn.com/)** & **[Radix UI](https://www.radix-ui.com/)**: Highly accessible, unstyled UI components combined for beautiful modals, avatar badges, and accessible forms.
- **[Motion](https://motion.dev/)**: Dynamic micro-animations and aesthetic transitions for an elevated premium feel.
- **[Lucide React](https://lucide.dev/)**: Clean, consistent SVG icon set.
- **[Sonner](https://sonner.emilkowal.ski/)**: Polished and interactive toast notifications.

---

## 🚀 Getting Started Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Environment Variables:**
   Ensure your `.env` and `.env.local` files contain the correct keys for Clerk, Supabase, Stream API, and Arcjet.
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Expose Local Environment (Crucial for Stream Webhooks!):**
   Stream uses webhooks (like `call.recording_ready`) to securely update your database. Because webhooks cannot access `localhost`, you must run a tunnel:
   ```bash
   npx localtunnel --port 3000
   ```
   *Take the generated URL and update your Webhook URL inside your Stream Video Dashboard.*

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Your app will be automatically running at `http://localhost:3000`.

---

## 🗄️ Database Management
Prept makes heavy use of relational mapping. To easily examine, clean up, or alter records mock bookings safely:
```bash
npx prisma studio
```
This opens an interactive table viewer locally at `http://localhost:5555`.

---
*Built with ❤️ to help engineers level up their careers.*
