# AgroLedger

A comprehensive, enterprise-grade ERP system built for Indian Agricultural Commission Agents (Adhatiya) operating within regulated Anaj Mandis. This system digitizes the entire agricultural supply chain workflow from farmer crop arrival to final buyer settlement and tax reporting.

## 🚀 Key Features

The ERP is broken down into **8 Core Modules**, all backed by a strict Double-Entry Accounting Ledger.

1. **Master Management:** Manage entities such as Farmers, Buyers, Commodities, Godowns, Labour Rates, and Tax Configurations.
2. **Arrivals (Gate Entry):** Record the physical entry of farmer produce into the mandi yard, tracking bag counts and weights.
3. **Auctions & Deals:** Record daily *boli* (auctions) linking buyers, farmers, commodities, and agreed rates. Supports partial lot sales and self-purchases.
4. **Farmer Settlements (J-Forms):** Auto-generate statutory J-Forms calculating Gross Value minus Mandi Tax, Paledari, Hamali, Tulai, and Commission to derive the Farmer Net Payable.
5. **Buyer Invoices (Bills):** Generate comprehensive GST/Mandi Tax compliant invoices combining multiple deals for a single buyer.
6. **Payments & Receipts:** A unified Cash/Bank voucher system for paying farmers and receiving funds from buyers.
7. **Accounting Ledger:** A fully automated double-entry ledger. Every J-Form, Invoice, and Payment automatically posts balancing debits/credits in real-time. Includes a Live Trial Balance.
8. **System Settings:** Admin dashboard to dynamically control Firm Name, GSTIN, and default Labour Charges without code changes.

## 🛠️ Technology Stack

This project is structured as a **MERN Monorepo**:

* **Frontend:** React 19, TypeScript, Vite, Material UI (MUI), TanStack React Query, React Hook Form, Recharts.
* **Backend:** Node.js, Express, TypeScript, Mongoose.
* **Database:** MongoDB (uses `Decimal128` to ensure absolute financial precision).
* **Shared Workspace:** Contains shared Zod schemas and TypeScript interfaces for true end-to-end type safety between client and server.

## 📁 Repository Structure

```text
Mandi/
├── client/          # React frontend application
├── server/          # Express backend application
├── shared/          # Shared Zod schemas & types
├── PRD.md           # Product Requirements Document
├── ARCHITECTURE.md  # System Architecture 
├── DATABASE.md      # Schema definitions
└── PHASES.md        # Development phases (1-12)
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB (running locally on port 27017 or via Atlas)

### 1. Install Dependencies
Run from the root directory to install dependencies for all workspaces:
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/mandi-erp
JWT_SECRET=your_super_secret_key_change_in_production
```

### 3. Start Development Servers
The root `package.json` contains a concurrent dev script that boots both the backend and frontend simultaneously:
```bash
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

### 4. Default Login
On the first boot, the system automatically seeds a default admin account and baseline settings.
- **Email:** admin@mandierp.com
- **Password:** admin123

## 📊 Architecture & Extensibility
Please refer to the `ARCHITECTURE.md` file for details on the Service-Controller-Model pattern used, and how the `LedgerService` handles automated double-entry postings via Mongoose Hooks/Service Injection.
