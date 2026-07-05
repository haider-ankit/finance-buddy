# IDBI Innovate 2026: MSME Financial Health Card (FinanceBuddy)

## 📌 The Problem
New-to-Credit (NTC) and New-to-Bank (NTB) MSMEs are frequently rejected for crucial credit lines due to a lack of traditional documentation (audited balance sheets, multi-year ITRs). Despite having a rich digital footprint across India's Digital Public Infrastructure (DPI), there is no unified framework to assess this alternate data.

## 💡 The Solution
FinanceBuddy is an AI/ML-driven multidimensional credit evaluation engine. It bypasses traditional paperwork by aggregating consent-driven alternate data (UPI velocity, GST filing consistency, and EPFO stability) to generate a near real-time **Financial Health Score**.

## 🏗️ Architecture & Interface-Driven Design
To ensure rapid iteration and zero-downtime frontend testing prior to receiving official IDBI sandbox access, this architecture utilizes an **Interface-Driven Design** with a decoupled Mock Data Adapter.

1. **The Data Contract:** The frontend (`/dashboard`) and backend (`/engine`) communicate via a strictly typed JSON schema.
2. **The Mock Adapter:** The current prototype leverages `Faker` to generate synthetic DPI data that perfectly matches this schema.
3. **Sandbox Readiness:** When transitioning to IDBI’s sandbox APIs in Phase 2, we will seamlessly swap the mock adapter for a direct database/API connection (e.g., PostgreSQL/SQLite) without altering the core scoring engine or presentation UI.

## 🛠️ Technology Stack
* **Analytics Engine:** Python, FastAPI, Pandas, Pydantic
* **Presentation Layer:** Next.js, React, TypeScript, Tailwind CSS
* **Target Infrastructure:** Containerized deployment ready for AWS and ACC integration.

## 🚀 Quick Start (Local Development)

### Running the Scoring Engine (Backend)
```bash
cd engine
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

idbi-msme-health-card/
├── README.md
├── .gitignore
├── engine/                      # Python Data Processing & Scoring Layer
│   ├── requirements.txt         # FastAPI, Pydantic, Faker, Pandas
│   ├── main.py                  # FastAPI server and endpoints
│   ├── schemas.py               # The absolute source of truth: Pydantic Data Contracts
│   ├── scorer.py                # Deterministic logic for multidimensional scoring
│   └── mock_data_adapter.py     # Uses Faker to generate synthetic API payloads
└── dashboard/                   # Next.js / TypeScript Presentation Layer
    ├── package.json
    ├── tailwind.config.ts
    ├── src/
    │   ├── app/                 # Next.js App Router (pages and layouts)
    │   ├── components/          # Reusable UI: RadarChart, RiskFlagsTable, ScoreCard
    │   ├── types/               # TypeScript interfaces mapping exactly to schemas.py
    │   └── services/            # Fetch utilities pointing to the local Python API
    └── public/                  # Fallback static mock JSON for instant Vercel deployment