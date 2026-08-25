# CyberSave App API and Backend Requirements Document

Date: 2026-08-21
Project: CyberSave
Scope: Mobile app (React Native) + API Gateway + Auth Service + Main Service

## 1) Executive Summary

CyberSave app ka UI kaafi had tak ready hai, lekin backend mostly auth tak limited hai.

Current state:
- Implemented business APIs: 4 (all auth related)
- Implemented gateway routing: Auth + Main proxy configured
- Main service business APIs: 0 (currently empty)

Required for MVP production-ready app:
- Total business APIs needed: ~37
- Already implemented and usable: 4
- New APIs to build: ~33

Backend effort estimate:
- MVP backend build: 6 to 9 weeks (2 backend developers)
- Production-hardening + scale features: additional 4 to 6 weeks

## 2) What Is Already Implemented

Based on current codebase, these APIs/routes exist:

### Auth Service (Implemented)
Base path via gateway: /api/auth

1. POST /api/auth/register
- Purpose: New user registration
- Status: Implemented

2. POST /api/auth/send-otp
- Purpose: Send login OTP to email
- Status: Implemented

3. POST /api/auth/verify-otp
- Purpose: Verify OTP and issue JWT token
- Status: Implemented

4. GET /api/auth/profile
- Purpose: Fetch logged-in user profile
- Status: Implemented (protected)

### API Gateway (Implemented)
- /api/auth -> Auth Service proxy
- /api/main -> Main Service proxy

### Not implemented but partially present in code
- POST /api/auth/verify-phone
- Service/controller code exists but route is commented out.

## 3) Frontend Feature-to-API Requirement Mapping

Note: Many screens currently use static/demo data. Neeche un screens ko real backend se connect karne ke liye required APIs diye gaye hain.

### A) Authentication Module
Required APIs: 6

1. POST /api/auth/register
2. POST /api/auth/send-otp
3. POST /api/auth/verify-otp
4. POST /api/auth/resend-otp (can reuse send-otp with cooldown policy)
5. GET /api/auth/profile
6. POST /api/auth/logout (optional server-side token blacklist if needed)

Current implemented: 4
Missing/new: 2

### B) Home Module (Notifications, Schemes, Chatbot)
Required APIs: 6

1. GET /api/main/home/summary
2. GET /api/main/notifications
3. PATCH /api/main/notifications/:id/read
4. GET /api/main/schemes
5. GET /api/main/schemes/:id
6. POST /api/main/chatbot/message

Current implemented: 0
Missing/new: 6

### C) Services Module (Aadhaar, PAN, Certificates)
Required APIs: 7

1. GET /api/main/services/categories
2. GET /api/main/services?category=aadhaar|pan|certificates
3. GET /api/main/services/:serviceId
4. POST /api/main/applications (service application submit)
5. POST /api/main/applications/:id/documents (upload/attach docs)
6. GET /api/main/applications/:id/required-documents
7. GET /api/main/applications/:id/fee-breakdown

Current implemented: 0
Missing/new: 7

### D) Applications Module
Required APIs: 5

1. GET /api/main/applications
2. GET /api/main/applications/:id
3. GET /api/main/applications/:id/timeline
4. GET /api/main/applications/stats
5. GET /api/main/applications/:id/download (certificate/receipt)

Current implemented: 0
Missing/new: 5

### E) Wallet Module
Required APIs: 6

1. GET /api/main/wallet/balance
2. POST /api/main/wallet/add-money
3. GET /api/main/wallet/transactions
4. GET /api/main/wallet/transactions/:id
5. GET /api/main/wallet/payment-methods
6. POST /api/main/wallet/payment-methods

Current implemented: 0
Missing/new: 6

### F) Profile Module
Required APIs: 7

1. GET /api/main/profile
2. PATCH /api/main/profile
3. GET /api/main/profile/address
4. PATCH /api/main/profile/address
5. GET /api/main/profile/documents
6. POST /api/main/profile/documents
7. DELETE /api/main/profile/documents/:id

Current implemented: 0 (profile currently in auth service only)
Missing/new: 7

### G) Help and Support Module
Required APIs: 4

1. GET /api/main/support/faqs
2. POST /api/main/support/tickets
3. GET /api/main/support/tickets
4. POST /api/main/support/feedback

Current implemented: 0
Missing/new: 4

### H) Cross-cutting/Platform APIs
Required APIs: 2

1. GET /health (gateway + per service)
2. GET /api/main/config/bootstrap (app config, feature flags, limits)

Current implemented: 1 partially
Missing/new: 1

## 4) Total Request Count (MVP)

Business API total required: 37
- Authentication: 6
- Home: 6
- Services: 7
- Applications: 5
- Wallet: 6
- Profile: 7
- Support: 4
- Cross-cutting app config: 1

Already implemented business APIs: 4
New business APIs required: 33

Approx mobile request frequency per active user per day:
- Light user: 20 to 35 API calls/day
- Moderate user: 40 to 70 API calls/day
- Heavy user: 80+ API calls/day

## 5) Backend Services Needed (Kitna Backend Lagega)

Minimum microservices recommended:

1. API Gateway
- Routing, auth token forwarding, rate limiting, request logging

2. Auth Service (already started)
- Registration, OTP login, JWT, profile basics

3. Main Service (currently empty, largest work)
- Home, schemes, services catalog
- Applications lifecycle + timeline
- Profile extended data + documents metadata
- Support tickets + feedback

4. Wallet/Payments Service (can be separate now or phase-2)
- Add money, transaction ledger, payment methods

5. Notification Worker/Service (phase-2 optional)
- Push notifications, reminders, async delivery

### Data stores and infrastructure
- MongoDB: user/profile/application/support domain
- Redis (recommended): OTP cooldown, caching, rate limiting, session controls
- Object storage (S3/GCS/Azure Blob): document uploads
- Queue (optional but recommended): background jobs, notification pipeline

## 6) Development Effort Estimate

## Team assumption
- 2 backend developers
- 1 QA shared
- Existing auth code reused

## Effort by module (MVP)
1. API gateway hardening: 3 to 4 days
2. Auth completion (verify-phone, resend policy, auth guards, tests): 4 to 6 days
3. Main service core models + CRUD APIs: 3 to 4 weeks
4. Wallet APIs + transaction flows: 1.5 to 2 weeks
5. File upload/document module: 4 to 6 days
6. Support module: 3 to 4 days
7. Testing, bug-fix, integration stabilization: 1.5 to 2 weeks

Total MVP backend timeline:
- 6 to 9 weeks

Production hardening (after MVP):
- 4 to 6 additional weeks
- Includes observability, security hardening, retries, idempotency, load optimization, backup/restore drills

## 7) Priority Plan (Recommended)

Phase 1 (Must-have MVP)
1. Auth complete and stable
2. Applications APIs (list/details/timeline/submit)
3. Services catalog APIs
4. Profile and documents APIs
5. Notifications basic APIs

Phase 2 (Operational MVP+)
1. Wallet and payment integration
2. Support tickets and feedback
3. Chatbot backend integration

Phase 3 (Scale)
1. Caching and queue-based async jobs
2. Advanced analytics and admin reports
3. Feature flags and remote config maturity

## 8) Risks and Assumptions

Risks:
1. Main service currently empty, so scope is larger than normal integration task.
2. Payment and document storage integration may add external dependency delays.
3. Chatbot and schemes data-source integration may require third-party APIs.

Assumptions:
1. Current frontend navigation/screens remain mostly unchanged.
2. MongoDB remains primary database.
3. JWT auth continues as current standard.

## 9) Final Answer to "kitna request chahiye" and "kitna backend lagega"

1. Required business APIs for MVP: ~37
2. Already implemented APIs: 4
3. New APIs to build: ~33
4. Backend services practically needed: 3 mandatory (Gateway, Auth, Main) + 1 wallet service recommended
5. Estimated backend effort for MVP: 6 to 9 weeks with 2 backend developers
