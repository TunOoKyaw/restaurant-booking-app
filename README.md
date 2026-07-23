# Restaurant Booking & Menu Management System

This is a production-ready **Restaurant Website** built using React (npm) for the frontend and Supabase (PostgreSQL) for the backend and database architecture. Designed explicitly for portfolio presentation, the application provides a smooth, production-grade implementation of full-stack web development principles.

The live application is fully deployed and accessible via **Vercel**.

🌐 **Live Demo Link:** [https://restaurant-booking-app-mu.vercel.app/](https://restaurant-booking-app-mu.vercel.app/)

---

## 🚀 Key Features

### User-Facing Features
- **Authentication**: Secure user registration, login, and session persistence powered by Supabase Auth.
- **Digital Menu Explorer**: Dynamic, responsive menu interface cataloged by culinary categories.
- **Table Reservation**: Dynamic table booking system allowing users to select specific dates, times, and guest counts.

### Admin Dashboard (Management View)
- **Menu Management**: Full CRUD operations (Create, Read, Update, Delete) for restaurant dishes directly from the UI.
- **Booking Management**: Real-time management and status monitoring of all customer reservations.

---

## 🔑 Demo Credentials

For quick evaluation and grading without registering a new account, please use the following testing credentials:

*   **Admin Account (Full Dashboard Access):**
    *   **Email:** `admin@gmail.com`
    *   **Password:** `admin123`
*   **Standard User Account:**
    *   **Email:** `coco@gmail.com`
    *   **Password:** `coco123`

---

## 🛠️ Tech Stack

- **Frontend:** React.js, CSS
- **Package Manager:** NPM (Node Package Manager)
- **Backend & Database:** Supabase (PostgreSQL)
- **Deployment Platform:** Vercel

---

## 💻 Local Development & Installation

Follow these sequential steps to clone, configure, and run the project locally on your machine.

### 1. Repository Initialization
Clone the repository from GitHub and navigate into the root directory:
```bash
git clone [https://github.com/TunOoKyaw/restaurant-booking-app.git](https://github.com/TunOoKyaw/restaurant-booking-app.git)
cd restaurant-booking-app

2. Dependency Setup
Install all required Node modules and libraries specified in package.json:

Bash
npm install
3. Environment Variables Configuration
Create a .env.local file in the root directory of your project and populate it with your specific Supabase credentials:

Code snippet
# If using Vite (Default):
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key

# If using Create React App, rename variables to:
# REACT_APP_SUPABASE_URL=your_supabase_project_url
# REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_public_key
4. Running the Project
Launch the local development server:

Bash
npm run dev
# Or 'npm start' if using Create React App
