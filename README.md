# ♻️ Urban Waste Management Platform (UWMP)

UWMP is a high-fidelity, fullstack municipal waste administration and collection optimization prototype built using the **MERN Stack (MongoDB, Express, React + Vite, Node.js)** and **Tailwind CSS**. It incorporates role-dependent consoles for Citizens, Drivers, and Municipal Admins.

---

## 🚀 Key Features

### 1. 👤 Citizen Experience
- **Animated Home Dashboard**: Personalized greeting card displaying dynamic reward point balances.
- **Reporting Wizard**: 4-step interactive form containing:
  - Incident category selection.
  - Image upload with an animated scanning laser and AI detection confidence rating simulator.
  - Automatic GPS geolocator (pulsing pin drop animation).
  - Success screen displaying custom-animated vector checkmarks.
- **Incidents Logs**: Searchable lists featuring timeline tracking status drawer detailing (Reported → Verified → Assigned → In Progress → Resolved).
- **Voucher Store & Gamification**: Points progression meter to badges (Bronze/Silver/Gold/Eco-Hero) with pure CSS confetti unlocking triggers, leaderboards, and discount code redemptions.

### 🚚 2. Driver Experience
- **Consoles & Shift Controls**: On Duty/Off Duty responsive toggles.
- **Route Optimizer Summary**: Summarizesstops, travel distance, and durations.
- **Interactive Fullscreen Live Navigator**: Simulates driver coordinates transitioning on waypoint clearances.
- **Backend Nearest-Neighbor Optimization**: Backend Haversine coordinates calculations automatically sequences routes.
- **Vehicle Telematics**: Circular fuel progress gauges, weekly trips charts (Recharts), and diagnostics logs.

### 🏛️ 3. Admin Experience
- **System KPIs**: Counts total complaints, resolved cases, and SLA response times with Recharts sparklines.
- **Fleet Mapping Tracker**: Combined tracking map showing all live vehicles and incidents.
- **Incidents Registry**: Paginated, sortable table supporting bulk actions (Mark Verified, Assign Vehicle, Escalate Priority).
- **Analytics Center**: Date-filterable area bar charts, SLA line graphs, category breakdowns, and vehicle clearing leaderboards. Includes CSV file exports.

### ⚙️ 4. System Preferences
- **App-wide Dark Theme**: Smooth theme toggling that changes CSS variables across all modules.
- **Accessibility & Transitions**: Full focus-visible focus boundaries and `prefers-reduced-motion` animation overrides.
- **Code-Splitting**: React Lazy and Suspense route bundling for minimal chunk download delays.

---

## 📂 Codebase Folder Structure

```
Urban-Waste-Management-Platform/
├── client/                     # Frontend SPA (React + Vite)
│   ├── src/
│   │   ├── components/         # Protected routes, skeletons, navigation, landing widgets
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── pages/              # Citizen, Driver, Admin, Settings, Profile pages
│   │   ├── App.tsx             # Main router, route transitions, and top progress loaders
│   │   ├── index.css           # Styling base, custom easing, dark selectors, focus rings
│   │   └── main.tsx            # DOM initialization
│   ├── tailwind.config.js      # Tailwind configurations (Class darkMode)
│   └── package.json
├── server/                     # Backend API Service (Express.js)
│   ├── src/
│   │   ├── config/             # DB connectors
│   │   ├── middleware/         # Auth filters & role checkers
│   │   ├── models/             # Mongoose Schemas (User, Complaint, Notification, Vehicle, Route)
│   │   ├── routes/             # Express endpoints (AI, Auth, Analytics, Fleet, Route, Complaints)
│   │   ├── scripts/            # Database seed scripts
│   │   └── index.js            # Express server initialization
│   └── package.json
└── README.md
```

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v16+)
- **MongoDB** running locally on default port `27017`

### 1. Backend Server Setup
Navigate into the server directory, install dependencies, configure variables, and run the seeding script:
```bash
cd server
npm install
cp .env.example .env
npm run seed
npm run dev
```
The server will boot on `http://localhost:5001`.

### 2. Frontend Client Setup
Navigate into the client directory, install dependencies, and start the development server:
```bash
cd ../client
npm install
npm run dev
```
The application will boot on `http://localhost:5173`. Open your browser and navigate to `http://localhost:5173`.

---

## 🔑 Seeding Demo Login Credentials

The seeding script generates standard test accounts:
* **Municipal Admin**:
  * Email: `admin@uwmp.com`
  * Password: `password123`
* **Eco Driver**:
  * Email: `driver@uwmp.com`
  * Password: `password123`
* **Citizen**:
  * Email: `citizen@uwmp.com`
  * Password: `password123`

---
**UWMP - Cleaner Cities, Smarter Logistics**
