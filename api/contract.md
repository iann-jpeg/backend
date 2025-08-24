# API Contract Map for Admin Backend

## Auth
- POST /auth/login
  - Request: { email: string, password: string }
  - Response: { token: string, user: { id: string, name: string, email: string, role: string } }
- POST /auth/register
  - Request: { email: string, password: string, fullName: string }
  - Response: { user: { id, name, email, role }, token: string }
- POST /auth/logout
  - Request: {}
  - Response: { success: boolean }
- GET /auth/profile
  - Response: { id: string, name: string, email: string, role: string }

## Dashboard
- GET /dashboard/stats
  - Response: { totalClaims, totalQuotes, totalConsultations, totalOutsourcingRequests, totalPayments, totalDiasporaRequests, totalUsers, pendingClaims, activePolicies, monthlyRevenue, conversionRate, totalSubmissions, allSubmissions: { claims, outsourcing, consultations, payments, diaspora } }
- GET /dashboard/activities
  - Response: [ { ...activity } ]
- GET /dashboard/export-pdf
  - Response: PDF blob

## Claims
- POST /claims (FormData)
- GET /claims
- GET /claims/:id
- PUT /claims/:id/status { status }

## Consultations
- POST /consultations
- GET /consultations

## Diaspora
- POST /diaspora
- GET /diaspora

## Outsourcing
- POST /outsourcing
- GET /outsourcing

## Payments
- POST /payments
- POST /payments/process/:id
- GET /payments/:id/status

## Quotes
- POST /quotes (FormData)
- GET /quotes

## Resources
- GET /resources/public
- GET /resources/download/:id

## Auth/Role
- All admin routes require Authorization: Bearer <token> and role ADMIN or SUPER_ADMIN

---

### Types are inferred from frontend usage. See frontend/src/lib/api.ts and frontend/src/pages/Resources.tsx for details.
