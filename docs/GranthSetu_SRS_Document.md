# Software Requirements Specification (SRS)
## GranthSetu – Abhyasika Management System
**Document Version:** 2.0 (Updated as per Client / CR-01 Mandates)  
**Date:** 30 October 2026  
**Status:** Approved for Baseline & Development  

---

### Contractual Parties

| Role | Organization / Entity | Authorized Representative | Location |
| :--- | :--- | :--- | :--- |
| **Vendor (Developer)** | **Enterprenex Solution Pvt. Ltd.** | Project Lead / Engineering Head | Cidco Waluj Mahanagar 1, Chh. Sambhajinagar |
| **Client** | **GranthSetu (Studyplus Abhyasika)** | Managing Director / Owner ("Sir") | Pune / Chh. Sambhajinagar |

---

## 1. Executive Summary & Purpose

### 1.1 Objective
The purpose of this document is to specify the complete functional, technical, and operational requirements for **GranthSetu**, an integrated web-based management platform designed to replace legacy manual paper registers in study centres and abhyasikas.

### 1.2 Core Problem Statement
The client currently manages student admissions, desk reservations, fee payments, and daily attendance through manual notebooks. This process introduces:
1. **Seat double-booking conflicts** across overlapping shifts.
2. **Fee leakages and unpaid dues** resulting from untracked credit periods and missed manual follow-ups.
3. **Absence of real-time owner oversight**, preventing management from inspecting occupancy and collections remotely.

### 1.3 Solution Scope
GranthSetu provides a responsive web platform and installable PWA with strict role-based access control (RBAC), live interactive seat matrices, UIDAI-compliant Aadhaar eKYC, dual-channel student and parent notifications, automated Razorpay fee reconciliation, and web-camera-based QR attendance tracking.

---

## 2. System Architecture & Tech Stack

```
+----------------------------------------------------------------------------------+
|                              CLIENT ACCESS LAYER                                 |
|      Owner Dashboard (Desktop/Mobile)  |  Staff Desk App  |  Student PWA Portal  |
+----------------------------------------------------------------------------------+
                                        │ (HTTPS / TLS 1.3)
+----------------------------------------------------------------------------------+
|                            APPLICATION LAYER (Next.js 14)                         |
|   App Router  •  Server Actions  •  RBAC Middleware  •  Tailwind CSS Design Sys   |
+----------------------------------------------------------------------------------+
          │                                  │                           │
          ▼                                  ▼                           ▼
+───────────────────+             +────────────────────+       +───────────────────+
|   DATABASE TIER   |             |  EXTERNAL GATEWAYS |       |  BACKGROUND WORK  |
| PostgreSQL 15+    |             | • Razorpay Auto-   |       | • BullMQ / Redis  |
| (Exclusion Constr.|             |   Reconciliation   |       | • WhatsApp Cloud  |
|  Prisma 5.22 ORM) |             | • Digio/Setu eKYC  |       | • SMS DLT (MSG91) |
+───────────────────+             +────────────────────+       +───────────────────+
```

| Layer | Technology Selected | Operational Rationale |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 14 (React) + TypeScript** | Server-side rendering, SEO-ready student portal, sub-2s loads. |
| **Styling & Icons** | **Tailwind CSS + Lucide React** | Mobile-first layout compliant with Owner 2-click requirement. |
| **Database** | **PostgreSQL (v15+)** | ACID compliance, exclusion constraints for double-booking checks. |
| **ORM** | **Prisma ORM (v5.22)** | Type-safe schema generation and database migration management. |
| **Payment Gateway** | **Razorpay Company Account** | Webhook-driven status confirmation; cards, net banking, UPI. |
| **Dual Messaging** | **WhatsApp Cloud API + SMS DLT** | Utility-category verified alerts to both student and guardian. |
| **Identity / eKYC** | **Digio / Setu / Signzy API** | OTP-based Aadhaar verification (restricted to last 4 digits). |
| **QR & Documents** | **Puppeteer & Node-QRCode** | Automated PDF generation for receipts, invoices, and ID cards. |

---

## 3. Strict Change Request Mandates (CR-01)

Per explicit instructions from the Client ("Sir"), the following five requirements supersede any generic implementation:

1. **Company Razorpay Account**:
   * All online transactions must route directly through the client's registered Razorpay merchant account.
   * Private live keys must remain strictly in encrypted server environment variables.
   * Payment statuses update **only via authenticated gateway webhooks**; front-end redirects must never trigger fee clearance.
2. **Dual Messaging to Student AND Parent**:
   * Every critical event (**Admission Confirmation**, **Fees Due Reminder**, and **Fees Paid Receipt**) must dispatch simultaneously to both the student's mobile number and the parent/guardian's mobile number.
   * Primary channel: **WhatsApp Business API**; Fallback channel: **DLT-approved SMS**.
3. **Mobile OTP & Aadhaar Verification**:
   * Verification via SMS OTP is mandatory for both student and parent mobile numbers before seat allotment.
   * Aadhaar identity verification requires explicit student consent followed by OTP verification.
   * **UIDAI Privacy Rule:** The system must **never store, log, or display the full 12-digit Aadhaar number**. Only the last 4 digits (`aadhaar_last4`), provider transaction reference (`provider_ref`), and verification timestamp (`verified_at`) are persisted.
4. **Owner Confidentiality (Staff Restrictions)**:
   * Staff login permissions are restricted to daily operational tasks: admitting students, checking seat occupancy, collecting fees, and monitoring attendance.
   * Under no circumstances can staff accounts view owner-level total revenue, net profit/loss, expense ledgers, or historical activity of other staff members.
5. **Private Repository & CI/CD**:
   * All codebase assets reside in a private GitHub repository managed by Enterprenex Solution Pvt. Ltd. with branch protection rules on `main`.

---

## 4. Role-Based Access Control (RBAC) Matrix

| Feature / Module | Owner | Staff | Student (Self-Service) |
| :--- | :---: | :---: | :---: |
| **View Live Seat Map** | Full Access | Full Access | View Assigned Seat Only |
| **Student Admission & KYC** | Full Access | Full Access | Profile Edit (Read-Only Seat) |
| **Collect Offline Fees (Cash/UPI)** | Full Access | Full Access | Disabled |
| **Pay Dues Online (Razorpay)** | Full Access | Full Access | Self Account Only |
| **Download PDF Receipts / ID Cards** | Full Access | Full Access | Download Own Card/Receipt |
| **QR Attendance Punch Desk** | Full Access | Front Desk Scan | Self Check-in (if enabled) |
| **Send WhatsApp / SMS Reminders** | Manual & Auto | Manual Trigger | Disabled |
| **Income & Expense Ledger (P&L)** | **Full Access** | **Access Denied (403)**| **Access Denied (403)** |
| **Multi-Branch Analytics & Reports** | **Full Access** | **Current Branch Only**| **Disabled** |
| **Audit Log Viewer (Fee Edits/Deletes)**| **Full Access** | **Access Denied** | **Access Denied** |

---

## 5. Functional Requirements (Modules 01 – 09)

### Module 01: Sales & Walk-in Enquiry Pipeline
* **FR-1.1:** Capture prospective student enquiries including full name, contact number, targeted competitive exam (UPSC, MPSC, NEET, CA, Banking), and preferred shift.
* **FR-1.2:** Schedule follow-up callback dates and track stage progression: `New` &rarr; `Contacted` &rarr; `Visited` &rarr; `Converted` &rarr; `Lost`.
* **FR-1.3:** Provide 1-click conversion from qualified enquiry directly into the formal Admission Form.

### Module 02: Student Fee Management System
* **FR-2.1:** Maintain configurable fee plans based on shift duration (Morning, Afternoon, Evening, Night, 24-Hour) and billing intervals (Monthly, Quarterly, Semi-Annual).
* **FR-2.2:** Support partial installment payments with continuous balance tracking:  
  $$\text{Balance Amount} = \text{Plan Fee} - \sum(\text{Approved Payments})$$
* **FR-2.3:** Calculate overdue accounts dynamically and trigger automated dual reminders at 3 defined milestones:
  * 3 days prior to due date
  * On the exact due date
  * 2 days post due date (Grace expiry)
* **FR-2.4:** Generate sequential, immutable digital PDF receipts per branch with tax and registration details.

### Module 03: Interactive Live Seat Reservation
* **FR-3.1:** Display a visual, interactive 2D floor grid showing real-time occupancy status:
  * Green: Vacant
  * Red: Occupied / Booked
  * Yellow: Reserved
* **FR-3.2:** **Double-Booking Prevention:** Enforce a strict PostgreSQL exclusion/unique constraint ensuring no seat has more than one active allocation for an overlapping shift and date range.
* **FR-3.3:** **24-Hour Shift Override:** Booking a 24-Hour full-day shift on a seat automatically locks all other single shifts on that seat for the allocation period.

### Module 04: Owner Executive Dashboard
* **FR-4.1:** Render real-time high-level KPIs within 2 clicks on mobile viewports: Today's Revenue, Total Active Occupancy (%), Overdue Balances, and Library Headcount.
* **FR-4.2:** Provide date-range, shift, and branch filters to inspect historical performance and revenue trends.

### Module 05: Staff Operational Dashboard
* **FR-5.1:** Simplified operational interface optimized for reception tablets and front-desk workstations.
* **FR-5.2:** Restrict visibility strictly to operational workflows: check-in logging, seat availability verification, and receipt issuance.

### Module 06: Payment Gateway Integration (Razorpay)
* **FR-6.1:** Generate secure Razorpay payment links and UPI QR codes for online fee settlements.
* **FR-6.2:** Process automated webhook notifications (`payment.captured`, `payment.failed`, `refund.processed`) using idempotent database operations to prevent duplicate payment credits.
* **FR-6.3:** Maintain daily gateway settlement reconciliation logs matching bank credits against student ledger entries.

### Module 07: Digital Admission Form & eKYC
* **FR-7.1:** Capture complete student profile data: full legal name, date of birth, permanent address, passport photo upload, and academic goal.
* **FR-7.2:** Collect guardian details: primary parent/guardian name, relation, and secondary emergency contact.
* **FR-7.3:** Verify student and parent phone numbers via SMS OTP.
* **FR-7.4:** Execute UIDAI eKYC through licensed gateway (Digio/Setu) with user checkbox consent, saving only the last 4 digits.

### Module 08: Automatic QR Code Generation
* **FR-8.1:** Upon successful admission and initial fee settlement, automatically generate a cryptographic, signed QR token tied to the student's unique registration ID.
* **FR-8.2:** The QR code remains valid for the duration of the active subscription and revokes upon seat cancellation or default.

### Module 09: Automatic Print-Ready ID Card Generation
* **FR-9.1:** Automatically compose a standard ID card (CR80 PVC size format or print-ready PDF) containing:
  * Centre Branding: GranthSetu Abhyasika
  * Student Photograph & Full Name
  * Assigned Seat Number & Shift Timings
  * Student Registration Number & Expiry Date
  * High-resolution Attendance QR Code
  * Centre Emergency Phone Number & Address
* **FR-9.2:** Provide single-card and batch printing functionality for front-desk operators.

---

## 6. Business Rules & Integrity Constraints

1. **Single Occupancy Rule:** A physical seat can never be allotted to more than one student within identical shift hours and overlapping calendar dates.
2. **Immutable Receipts:** Once issued, receipt records cannot be edited or deleted. Corrections require an auditable credit/debit adjustment entry.
3. **Dual Parent-Student Notification Rule:** Every automated notification triggered by the system must send identical alerts to both student and parent mobile numbers.
4. **UIDAI Compliance Rule:** Plain-text or full 12-digit Aadhaar numbers must never be stored in persistent storage, memory caches, application logs, or front-end payloads.
5. **Staff Revenue Wall:** Staff user roles (`STAFF`) returning API calls for financial ledgers or aggregate metrics must receive HTTP 403 Forbidden responses.
6. **Webhook Authority:** An invoice is marked `PAID` only upon cryptographic signature verification of the Razorpay webhook event payload.

---

## 7. 14-Week Delivery Roadmap & Acceptance Milestones

```
W1-W2: Foundation & Schema ──► W3-W5: Core Ops (Admit/Seat/QR) ──► W6-W8: Money (Razorpay/Dual Alerts)
                                                                             │
W14: Go-Live & Handover   ◄── W11-W13: Advanced (Ledger/Analytics) ◄── W9-W10: MVP Ops Demo
```

| Phase | Duration | Scope & Key Deliverables | Client Acceptance Milestone |
| :--- | :--- | :--- | :--- |
| **Phase 1: Foundation** | Weeks 1–2 | Finalize SRS, DB schema, RBAC permissions, CI/CD pipeline, and design system. | **M1:** Signed SRS & working role-based authentication. |
| **Phase 2: Core Operations**| Weeks 3–5 | Admission form with eKYC, live interactive seat map, and automated ID card generation with QR code. | **M2:** Successfully admit a verified student and allot a seat. |
| **Phase 3: Money & Gateway** | Weeks 6–8 | Fee plans, partial payment collection, PDF receipts, Razorpay webhooks, and dual parent alerts. | **M3:** Online fee transaction clears and triggers dual messages. |
| **Phase 4: Operations Demo**| Weeks 9–10| Browser webcam QR attendance scanner, sales pipeline, and Owner/Staff operational dashboards. | **M4:** Complete MVP functional demo across all 9 modules. |
| **Phase 5: Advanced Ops** | Weeks 11–13| Dual messaging engine, Owner P&L ledger, multi-branch selector, and student self-service portal. | **M5:** Feature-complete deployment on staging server. |
| **Phase 6: Launch & Train** | Week 14 | User acceptance testing (UAT), legacy paper CSV data migration, staff training, and production go-live. | **M6:** Final Go-Live sign-off and 30-day warranty window. |

---

## 8. Out of Scope / Post-Launch Backlog (Phase 7)

The following items are explicitly excluded from the current 14-week baseline agreement and will be scoped under subsequent change requests:
* Physical biometric fingerprint or facial recognition hardware integration.
* Automated bidirectional sync with Tally / Zoho Books accounting software.
* Native mobile applications for iOS (Apple App Store) or Android (Google Play Store APK) beyond the responsive Progressive Web App (PWA).
* Seat-specific dynamic surge pricing algorithms.

---

## 9. Acceptance & Formal Sign-Off

By signing below, both parties acknowledge and accept this Software Requirements Specification (SRS v2.0) as the definitive functional scope of the GranthSetu Abhyasika Management System. Any subsequent additions or structural alterations shall require an executed Change Request (CR) document.

<br><br>

### For Client: GranthSetu (Studyplus Abhyasika)

**Authorized Signature:** ________________________________________  
**Name:** ____________________________________________________  
**Designation:** Proprietor / Managing Director ("Sir")  
**Date:** ________________________  
**Official Stamp:**  

<br><br>

### For Vendor: Enterprenex Solution Pvt. Ltd.

**Authorized Signature:** ________________________________________  
**Name:** ____________________________________________________  
**Designation:** Technical Director / Project Manager  
**Date:** ________________________  
**Company Seal:**  

