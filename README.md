# EcoWatch – Online Pollution Reporting & Environmental Monitoring System

EcoWatch is a modern, responsive, full-stack environmental protection platform designed for citizens, municipal inspectors, and central environmental authorities to report, investigate, track, and remediate environmental pollution incidents in real time.

---

## 1. Project Overview

EcoWatch replaces fragmented, slow-moving paper and phone complaints with a centralized, auditable, geospatial incident tracking system.
Citizens can report pollution with photographs, descriptions, severity, and interactive GPS coordinates. Environmental officers can perform field investigations, log spectrometry data, and record enforcement actions. Central administrators oversee district telemetry, assign officers, and analyze pollution hotspots.

---

## 2. Key Features

- **Multi-Role Access Control**:
  - **Citizen**: Submit complaints, upload photo evidence, pinpoint GPS locations, track resolution timelines in real-time, view nearby pollution alerts.
  - **Environmental Officer**: Field inspection queue, log on-site verification photos, issue remediation directives, record containment actions.
  - **Authority Administrator**: Adjudicate reports, verify or reject complaints, assign division officers, analyze regional trends, manage system users.
- **5-Step Verification Reporting Wizard**:
  - Step 1: Pollution Category Selection (Air, Water, Waste, Industrial Chemical, Noise, Other)
  - Step 2: Incident Details with **AI Description Assistant**
  - Step 3: Interactive Geospatial Leaflet Map Coordinate Picker & GPS Locator
  - Step 4: Multi-Image Evidence Upload & **Gemini AI Vision Analysis**
  - Step 5: Duplicate Detection Check & Final Submission with unique `ECO-2026-XXXXXX` complaint ID generation.
- **AI Capabilities**:
  - **AI Pollution Image Analysis**: Powered by Gemini 3.8 Flash, analyzes visual contamination, classifies category, assesses severity, and provides diagnostic explanations.
  - **AI Report Assistant**: Refines raw citizen descriptions into professional incident summaries, suggests formal titles, and flags missing details.
  - **AI Duplicate Detection**: Evaluates geographical proximity and semantic similarity to alert users of existing nearby reports.
  - **AI Regional Risk Summary**: Dynamically synthesizes real-time incident trends into actionable executive intelligence for environmental administrators.
- **Geospatial Hotspot Map**:
  - OpenStreetMap tiles with custom-styled pollution category markers.
  - Dynamic severity radius pulses and hotspot density heat rings.
  - Instant location filtering by pollution type, severity, and status.
- **Environmental Analytics Dashboard**:
  - Intake velocity timelines, resolution rate percentages, average remediation days, category distribution charts, and repeat hotspot rankings.

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Leaflet Maps
- **Backend**: Node.js, Express.js REST API, JSON Web Tokens (JWT), Bcrypt password hashing
- **Database**: PostgreSQL / Neon DB (`pg` connection pool with SSL) + resilient in-memory synchronization
- **AI Engine**: `@google/genai` TypeScript SDK (Gemini 3.8 Flash)

---

## 4. System Architecture

```
[ Citizen / Officer / Admin Browser (React 19 + Leaflet) ]
                        │
                        ▼ (REST API / Bearer JWT)
           [ Express.js Backend (server.ts) ]
             ├── Auth Middleware (RBAC)
             ├── Pollution Reports Controller
             ├── Environmental Analytics Engine
             ├── Google GenAI Service (Gemini 3.8 Flash)
                        │
                        ▼ (PostgreSQL Client Pool / SSL)
       [ Neon PostgreSQL Database (`neondb`) ]
```

---

## 5. Database Schema

The database utilizes relational PostgreSQL tables:

```sql
-- Users & Access Control
CREATE TABLE users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(32) NOT NULL, -- 'citizen' | 'officer' | 'admin'
  phone VARCHAR(64),
  department VARCHAR(255),
  status VARCHAR(32) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Incident Complaints
CREATE TABLE pollution_reports (
  id VARCHAR(64) PRIMARY KEY,
  report_number VARCHAR(64) UNIQUE NOT NULL, -- e.g. ECO-2026-000101
  user_id VARCHAR(64),
  citizen_name VARCHAR(255) NOT NULL,
  citizen_email VARCHAR(255) NOT NULL,
  pollution_type VARCHAR(64) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity VARCHAR(32) NOT NULL,
  status VARCHAR(64) NOT NULL,
  source VARCHAR(255),
  suspected_entity VARCHAR(255),
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(128) NOT NULL,
  reported_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  report_data JSONB
);

-- Notifications
CREATE TABLE notifications (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(32) DEFAULT 'info',
  report_id VARCHAR(64),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Legal Audit Trail
CREATE TABLE audit_logs (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64),
  user_name VARCHAR(255),
  action VARCHAR(128) NOT NULL,
  details TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 6. Environment Variables

Create a `.env` file in the root directory:

```env
# Database URL (PostgreSQL / Neon DB)
DATABASE_URL="postgresql://[user]:[password]@[endpoint].neon.tech/neondb?sslmode=require"

# JWT Secret for Token Signing
JWT_SECRET="ecowatch-jwt-super-secret-key-2026"

# Google Gemini API Key
GEMINI_API_KEY="your-gemini-api-key"
```

---

## 7. Running Locally

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

---

## 8. REST API Documentation

### Authentication
- `POST /api/auth/register` - Create new citizen or officer account
- `POST /api/auth/login` - Authenticate with email and password
- `POST /api/auth/demo-login` - Instant 1-click login for test personas
- `GET /api/auth/me` - Retrieve current session user

### Pollution Reports
- `GET /api/reports` - Query filtered pollution reports (type, severity, status, search)
- `GET /api/reports/:id` - Fetch single report details with full history
- `POST /api/reports` - Submit new pollution complaint
- `PUT /api/reports/:id/status` - Update complaint status (Authorized officers/admins)
- `PUT /api/reports/:id/assign` - Assign complaint to officer (Admins)
- `POST /api/reports/:id/investigate` - Log field inspection notes
- `POST /api/reports/:id/action` - Record remediation actions taken & mark resolved
- `DELETE /api/reports/:id` - Delete report (Admin audit trail)

### AI Capabilities
- `POST /api/ai/analyze-image` - Run Gemini vision model on pollution image
- `POST /api/ai/analyze-report` - Optimize complaint description with AI
- `POST /api/ai/check-duplicate` - Check for duplicate nearby reports
- `GET /api/ai/risk-summary` - Synthesize regional environmental risk brief

### Analytics & System
- `GET /api/admin/analytics` - Retrieve statistical trends and hotspots
- `GET /api/system/status` - Retrieve active database backend and sync counts
- `POST /api/system/configure-db` - Update Neon database link dynamically

---

## 9. Seed & Demo Personas

The application includes realistic environmental seed data and one-click role switching:
1. **Citizen**: Elena Rostova (`citizen@ecowatch.org` / `password123`)
2. **Field Officer**: Marcus Chen (`officer.chen@ecowatch.gov` / `password123`)
3. **Authority Admin**: Dr. Evelyn Vance (`admin@ecowatch.gov` / `password123`)

---

## 10. Future Enhancements

- Satellite optical spectral analysis integration (Sentinel-2 / Landsat).
- Citizen push notifications via Web Push API.
- Automated drone autonomous flight dispatch protocols.
