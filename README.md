# 🚛 GatiFleet — India's Transportation OS

[![CI Build Status](https://github.com/thakurcodeshere/GatiFleet/actions/workflows/ci.yml/badge.svg)](https://github.com/thakurcodeshere/GatiFleet/actions)
[![GitHub license](https://img.shields.io/github/license/thakurcodeshere/GatiFleet)](https://github.com/thakurcodeshere/GatiFleet/blob/main/LICENSE)
[![React Version](https://img.shields.io/badge/react-v19.x-blue.svg)](https://react.dev)
[![Vite Version](https://img.shields.io/badge/vite-v8.x-purple.svg)](https://vite.dev)

**GatiFleet** is a high-performance, next-generation enterprise Operating System for transportation and logistics in India. Built for modern fleet operators, GatiFleet brings real-time telemetry, automated dispatching, driver payroll, analytics, supply chain knowledge graphs, and AI copiloting into a unified, fluid workspace.

---

## 🌟 Key Features

* **📍 Live Tracking & Telemetry**: High-fidelity geofenced maps powered by Leaflet.js with live vehicle coordinate simulations.
* **🧠 AI Copilot**: Intelligent, real-time routing assistant and anomaly detection console for operators.
* **💼 ERP & CRM Workspace**: End-to-end invoicing, route costing, fuel logs, and shipper relationship dashboards.
* **👥 Human Capital Management (HCM)**: Driver log sheets, payroll rosters, compliance tracking, and shift management.
* **📊 Deep Analytics**: Multi-dimensional operations dashboards tracking fuel efficiency, vehicle utilization, and trip margins via Chart.js.
* **🕸️ Supply Chain Knowledge Graph**: Visual nodes illustrating hub relations, route segments, and distribution nodes.
* **🤖 Dispatch Agents**: Autonomous scheduling and job-routing engine dashboard.

---

## 🏗️ System Architecture (11-Tier Enterprise Monolith)

GatiFleet was originally a frontend-only prototype but has now been upgraded to a robust **11-Tier Zero-Cost Full-Stack Architecture**:

1. **Frontend Tier (React + Vite)**: Fluid, animated UI with stateful dashboards.
2. **Gateway Tier (Express API)**: Centralized entry point (`server/index.js`).
3. **Database Tier (SQLite + Prisma)**: Local, zero-cost relational database.
4. **Caching Tier (Node-Cache)**: In-memory KV store for fast entity lookups.
5. **Real-time Tier (Socket.io)**: Live bidirectional WebSocket telemetry.
6. **Authentication Tier (JWT + bcrypt)**: Secure token-based access control.
7. **Storage Tier (Multer)**: Local disk storage for document uploads.
8. **Job Queue Tier (FastQ)**: Background worker thread queue for async tasks.
9. **Intelligence Tier (Neural Engine)**: The core AI and business logic engine.
10. **Monitoring Tier (Winston + Morgan)**: Comprehensive rotating file logs.
11. **Process Management Tier (PM2)**: Daemonized, self-healing cluster management.

---

## 🛠️ Tech Stack

### Frontend
- **Core Framework**: React 19 + Vite
- **Mapping & Geospatial**: Leaflet & React-Leaflet
- **Charts & Visualizations**: Chart.js & React-Chartjs-2
- **Aesthetics & Animations**: Framer Motion + Custom CSS system

### Backend
- **Server**: Node.js + Express.js
- **Database ORM**: Prisma Client
- **Database**: SQLite (Zero-cost, local storage)
- **Real-time**: Socket.io
- **Process Manager**: PM2 Ecosystem
- **Security**: express-rate-limit, cors, helmet

---

## 📂 Project Structure

The project has a modular, feature-based file layout:

```text
GatiFleet/
├── .github/                 # GitHub Action workflows & templates
│   ├── workflows/           # CI/CD configurations
│   │   └── ci.yml           # Automated lint & build action
│   └── ISSUE_TEMPLATE/      # Custom GitHub bug & feature templates
│       ├── bug_report.md
│       └── feature_request.md
├── public/                  # Static assets & icons
├── src/
│   ├── components/
│   │   ├── layout/          # Sidebar, Topbar, and base layout
│   │   └── shared/          # Reusable UI parts (e.g., CopilotPanel)
│   ├── context/             # Global Context providers (e.g., ThemeContext)
│   ├── data/                # RealityEngine simulator & mock datasets
│   ├── pages/               # Functional pages (Dashboard, Fleet, HCM, etc.)
│   ├── App.jsx              # Main router & page manager
│   ├── index.css            # Global CSS variables & layout design
│   └── main.jsx             # React DOM renderer
├── package.json             # Build configurations & npm dependencies
├── vite.config.js           # Vite bundler configurations
└── eslint.config.js         # Linter configurations
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js (version 20+ recommended) and npm installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/thakurcodeshere/GatiFleet.git
   cd GatiFleet
   ```
2. Install npm packages:
   ```bash
   npm install
   ```

### Running Locally (Full Stack)

To run the complete 11-Tier architecture locally:

**1. Start the Backend API (PM2 Daemon)**
```bash
cd server
npm install
npx pm2 start ecosystem.config.js
```
The backend will run securely on `http://localhost:3000`.

**2. Start the Frontend Dev Server**
Open a new terminal window:
```bash
cd GatiFleet
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

Compile and bundle the React frontend for production distribution:
```bash
npm run build
```
Deploy the `dist/` directory to your static host (e.g., Vercel or Netlify) and keep the Node.js backend running on a VPS.

### Code Verification

Run ESLint to check for code violations:
```bash
npm run lint
```

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on opening issues and submitting pull requests.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information (if applicable).
