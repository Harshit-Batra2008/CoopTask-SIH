# 🤝 CoopTask

### Cooperative Workforce Coordination Platform

> **Smart India Hackathon 2026 — Working Prototype by CodeCooperatives**

[![Status](https://img.shields.io/badge/Status-Working%20Prototype-orange)](https://github.com/Harshit-Batra2008/CoopTask-SIH)
[![Built With](https://img.shields.io/badge/Built%20With-React%20%2B%20Vite-blue)](https://react.dev/)
[![Team](https://img.shields.io/badge/Team-CodeCooperatives-green)](https://github.com/Harshit-Batra2008)

---

## 🚧 Prototype / Demo Notice

**CoopTask is currently a functional hackathon prototype developed for Smart India Hackathon 2026.**

This repository demonstrates the proposed product experience, core workflows, and FairMatch concept. It is **not a production-ready application yet**.

The current version intentionally uses lightweight prototype infrastructure so the complete workflow can be demonstrated without requiring a production backend.

### Current prototype components include:

- Local application state
- Browser `localStorage` persistence
- Demo users and worker profiles
- Prototype OTP verification
- Client-side FairMatch processing
- Simulated role switching
- Demo analytics
- Seeded demonstration data

### Production features planned for later include:

- Secure authentication
- Cloud database
- Server-side APIs
- Real-time synchronization
- Production OTP/SMS verification
- GPS and location services
- Push notifications
- Cloud storage
- Production deployment
- Android application

> **The purpose of this version is to demonstrate how the CoopTask platform could work in practice and provide a foundation for future development.**

---

# 🌱 What is CoopTask?

**CoopTask** is a cooperative-owned workforce coordination platform designed to help cooperatives organize workers, manage service requests, distribute work, and coordinate local services through a transparent matching system.

Instead of functioning as another open gig marketplace, CoopTask focuses on creating a **cooperative workforce coordination layer**.

The platform connects:

```text
Customer
   ↓
Service Request
   ↓
FairMatch
   ↓
Verified Worker
   ↓
Service
   ↓
Completion & Rating
   ↓
Cooperative Analytics
```

The goal is to make workforce coordination more organized, transparent, and equitable while giving cooperatives better visibility over their workforce.

---

# 🎯 The Problem

Local service workers and cooperatives can face several coordination challenges:

- Difficulty finding suitable workers for incoming requests
- Uneven distribution of work
- Limited visibility into worker availability
- Manual coordination between customers and workers
- Difficulty tracking service requests
- Lack of transparency in worker assignment
- Limited operational analytics for cooperatives

Traditional gig platforms primarily focus on connecting individual customers with independent workers.

CoopTask instead focuses on **cooperative-owned workforce coordination**.

---

# 💡 Our Solution

CoopTask provides a shared platform for three primary roles:

| Role | Purpose |
|---|---|
| 👤 **Customer** | Creates and tracks service requests |
| 🧑‍🔧 **Worker** | Receives, accepts and completes assigned jobs |
| 🏢 **Cooperative Admin** | Coordinates workers and monitors operations |

The cooperative can maintain a network of verified workers while the system helps coordinate incoming service requests.

---

# ⚖️ FairMatch

The core of CoopTask is **FairMatch**, a transparent rule-based worker matching engine.

Instead of assigning a worker based on only one factor, the prototype considers multiple factors simultaneously.

### Current Matching Model

| Factor | Weight |
|---|---:|
| 📍 Distance | **40%** |
| 🛠️ Skill / Experience | **30%** |
| 📊 Workload | **30%** |

Before a worker is considered for matching, basic eligibility conditions are checked.

These include:

- Required skill
- Worker availability
- Verification status

### Why FairMatch?

The objective is to make worker assignment **explainable and transparent**.

Instead of simply displaying:

> "Worker X was selected."

the system can show the factors contributing to the match.

This allows the cooperative and worker to better understand how an assignment was generated.

---

# 🔄 Complete Service Workflow

```text
                         CUSTOMER
                            │
                            ▼
                  Create Service Request
                            │
                            ▼
                       FAIR MATCH
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
          Skill          Distance       Workload
             │              │              │
             └──────────────┼──────────────┘
                            ▼
                    Worker Assignment
                            │
                            ▼
                     Worker Accepts
                            │
                            ▼
                    OTP Verification
                            │
                            ▼
                   Service In Progress
                            │
                            ▼
                    Service Completed
                            │
                            ▼
                      Customer Rating
                            │
                            ▼
                  Cooperative Analytics
```

---

# 📋 Request Lifecycle

Every service request can progress through a defined lifecycle:

```text
REQUESTED
    ↓
ASSIGNED
    ↓
ACCEPTED
    ↓
IN_PROGRESS
    ↓
COMPLETED
```

The prototype maintains shared application state so that changes made during the workflow can be reflected across the Customer, Worker, and Admin experiences.

---

# 👤 Customer Experience

The Customer interface allows users to:

- Create service requests
- Select required services
- Enter service location
- Add job descriptions
- Specify urgency/preferences
- View FairMatch results
- Track request status
- Complete OTP verification
- View request history
- Rate completed services

### Example

A customer can create a request such as:

> **Electrician required**  
> Power socket in bedroom is not working.

The system evaluates eligible workers and presents the FairMatch results.

---

# 🧑‍🔧 Worker Experience

Workers can:

- View incoming requests
- Review job details
- View assignment information
- Accept assigned work
- Complete OTP verification
- Start a service
- Complete a service
- Track workload
- View job history

The worker workflow is designed to keep the job lifecycle simple and easy to follow.

---

# 🏢 Cooperative Admin Experience

The Admin dashboard provides an operational overview of the cooperative.

It includes:

- Workforce overview
- Worker information
- Service request management
- Active jobs
- Worker availability
- Workload visibility
- Request status
- Matching information
- Operational analytics

This gives the cooperative a centralized view of its workforce and service activity.

---

# 🔐 OTP Verification

The prototype includes an OTP-based verification flow to demonstrate how a service can be verified between the customer and worker.

The current implementation is a **prototype OTP system** and does not use a production SMS provider.

In a production version, this layer could be connected to a secure authentication/OTP service.

---

# 📊 Cooperative Analytics

The Admin dashboard provides a prototype view of operational activity.

The purpose of these analytics is to demonstrate how a cooperative could eventually monitor:

- Total requests
- Completed services
- Active jobs
- Worker activity
- Workforce utilization
- Matching activity
- Service trends

The current analytics are based on prototype/demo data.

---

# 🖥️ Demo

The repository contains a browser-based interactive prototype.

## Recommended Judge Demonstration

For a complete demonstration, follow this flow:

### 1. Customer

Open the Customer Dashboard and create a new service request.

Example:

```text
Service: Electrician
Location: Dwarka
Description: Power socket in bedroom is not working
```

### 2. FairMatch

Submit the request and display the FairMatch results.

Show how the system considers:

- Skill
- Distance
- Workload
- Worker eligibility

### 3. Worker

Switch to the Worker interface.

Open the incoming request and accept the job.

### 4. Verification

Demonstrate the OTP verification step.

### 5. Service

Move the job through:

```text
ASSIGNED
   ↓
ACCEPTED
   ↓
IN_PROGRESS
   ↓
COMPLETED
```

### 6. Customer

Return to the Customer interface and demonstrate the updated request status.

Submit a rating after completion.

### 7. Admin

Open the Admin dashboard and show the updated operational information and analytics.

---

# 🧩 Current Architecture

```text
                         React + Vite
                              │
                              ▼
                    Application Context
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
      FairMatch           OTP Service        Persistence
          │                   │                   │
          └───────────────────┼───────────────────┘
                              ▼
                        Prototype UI
                              │
             ┌────────────────┼────────────────┐
             ▼                ▼                ▼
         Customer           Worker            Admin
```

---

# 🛠️ Technology Stack

## Frontend

- React
- Vite
- JavaScript
- CSS

## Libraries

- Recharts
- Lucide React

## Prototype Services

- React Context / Reducer
- Browser localStorage
- Seed data
- Client-side FairMatch engine
- Prototype OTP service

---

# 📁 Project Structure

```text
CoopTask-SIH/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── layout/
│   │   └── ui/
│   │
│   ├── context/
│   │
│   ├── data/
│   │
│   ├── pages/
│   │   ├── admin/
│   │   ├── customer/
│   │   └── worker/
│   │
│   ├── services/
│   │
│   ├── App.jsx
│   └── styles.css
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
└── README.md
```

---

# 🚀 Running the Prototype

## Requirements

- Node.js
- npm

## 1. Clone the repository

```bash
git clone https://github.com/Harshit-Batra2008/CoopTask-SIH.git
```

## 2. Enter the project directory

```bash
cd CoopTask-SIH
```

## 3. Install dependencies

```bash
npm install
```

## 4. Start the development server

```bash
npm run dev
```

Vite will provide a local development URL, typically:

```text
http://localhost:3000/
```

## 5. Build for production

```bash
npm run build
```

---

# 🌐 Testing in GitHub Codespaces

The project can also be tested in a GitHub Codespace.

After opening the repository in Codespaces:

```bash
npm install
npm run dev
```

When Vite starts, use the forwarded port provided by Codespaces to open the application.

---

# 🧪 Prototype Limitations

The current version intentionally has several prototype limitations.

### Data

The application currently uses local/demo data rather than a production database.

### Authentication

The role-switching experience is designed for demonstration and does not represent production authentication.

### OTP

OTP verification is simulated locally.

### Matching

FairMatch currently executes within the frontend prototype.

### Location

Distance values are part of the prototype data and are not currently generated through live GPS/geolocation services.

### Notifications

The prototype does not yet use production push/SMS notifications.

### Deployment

The current repository represents the application prototype rather than a production deployment.

---

# 🔮 Future Roadmap

## Phase 1 — Prototype

- [x] Customer workflow
- [x] Worker workflow
- [x] Admin dashboard
- [x] FairMatch engine
- [x] Request lifecycle
- [x] OTP demonstration
- [x] Local persistence
- [x] Responsive interface

## Phase 2 — Backend

- [ ] Secure authentication
- [ ] Cloud database
- [ ] Server-side APIs
- [ ] Real-time synchronization
- [ ] Server-side FairMatch
- [ ] Production OTP

## Phase 3 — Real-world Services

- [ ] GPS/location services
- [ ] Real-time worker availability
- [ ] Push notifications
- [ ] Cloud storage
- [ ] Worker verification
- [ ] Cooperative onboarding

## Phase 4 — Platform

- [ ] Android application
- [ ] Multi-language support
- [ ] Demand forecasting
- [ ] Worker welfare integrations
- [ ] Production monitoring
- [ ] Production deployment

---

# 📱 Future Application

The current React/Vite application is designed as the foundation for a future mobile application.

The same product architecture can eventually be extended into an Android application while sharing the same backend and service layer.

---

# 🌍 Long-Term Vision

CoopTask aims to evolve from a hackathon prototype into a **cooperative-owned workforce coordination platform**.

The long-term vision is to provide cooperatives with tools to:

- Coordinate verified workers
- Distribute work transparently
- Reduce manual coordination
- Improve workforce visibility
- Track service operations
- Understand demand
- Support workers
- Provide better service coordination for customers

The objective is not simply to create another gig marketplace.

It is to create a **coordination infrastructure for cooperative workforces**.

---

# 👥 Team CodeCooperatives

### Smart India Hackathon 2026

| # | Team Member |
|---:|---|
| 01 | **Harshit** |
| 02 | **Lakshit Kumar** |
| 03 | **Aditya Singh** |
| 04 | **Harshvardhan** |
| 05 | **Mridul Solanki** |
| 06 | **Kinjal Agarwal** |

---

# 🏆 Project

**Project:** CoopTask  
**Team:** CodeCooperatives  
**Event:** Smart India Hackathon 2026  
**Problem Statement ID:** 26089
**Status:** Functional Prototype / Demo

---

## 📌 Important

This repository represents the **current prototype implementation** of CoopTask.

The prototype focuses on demonstrating the product concept, user workflows, FairMatch engine, cooperative operations, and overall user experience.

Production infrastructure and real-world integrations are planned as the project evolves.

---

## 📄 License

Developed by **CodeCooperatives** for Smart India Hackathon 2026.
