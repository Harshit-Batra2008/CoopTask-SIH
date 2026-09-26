# CoopTask

> Cooperative workforce coordination for fairer, trusted local services.

[![Built with React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=black)](...)
[![Vite](https://img.shields.io/badge/Vite-7+-646CFF?logo=vite&logoColor=white)](...)
[![Status](https://img.shields.io/badge/status-prototype-orange)](...)

CoopTask is a cooperative-owned workforce coordination platform that helps
organize verified workers, match service requests, distribute workload,
and coordinate jobs through a transparent FairMatch engine.

---

## Overview

Local service workers often operate through fragmented and informal
coordination systems.

CoopTask provides a shared coordination layer between:

- Customers requesting services
- Verified workers completing jobs
- Cooperatives coordinating their workforce

Rather than functioning as a conventional worker marketplace,
CoopTask focuses on cooperative workforce coordination.

---

## Core Features

### FairMatch

CoopTask uses a transparent rule-based matching engine that considers:

- Skill compatibility
- Distance
- Current workload
- Worker availability
- Verification status

The current prototype uses:

| Factor | Weight |
|---|---:|
| Skill | 30% |
| Distance | 40% |
| Workload | 30% |

Only eligible workers are considered for matching.

---

### Customer Experience

Customers can:

- Browse available services
- Submit service requests
- Provide location and job details
- View matched workers
- Understand FairMatch scores
- Track booking status
- Verify service start using an OTP
- Track completion
- Rate completed services

---

### Worker Experience

Workers can:

- Manage availability
- Receive service requests
- Review job details
- Accept or reject requests
- Start services using verification
- Complete jobs
- View workload and job history

---

### Cooperative Dashboard

Cooperative administrators can:

- Monitor workforce availability
- View active requests
- Manage workers
- Track job statuses
- Monitor workload
- View matching metrics
- Analyze service activity

---

## Product Flow

```text
Customer
   │
   ▼
Service Request
   │
   ▼
FairMatch
   │
   ├── Skill
   ├── Distance
   ├── Workload
   └── Eligibility
   │
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
