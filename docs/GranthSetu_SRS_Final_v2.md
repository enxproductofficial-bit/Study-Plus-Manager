Ref no.: ENX/PRD/AMS/2026-10-003                                        Date: 30 October 2026
    
Software Requirements Specification (SRS)
GranthSetu – Abhyasika Management System.
Powered by ENTERPRENEX SOLUTION PVT LTD

Client: GranthSetu (Studyplus Abhyasika)
Developer: Enterprenex Solution Pvt. Ltd., Cidco Waluj Mahanagar 1, Chh. Sambhajinagar 
Document version: 2.0 (Updated as per Client / CR-01 Mandates)

1. Introduction
1.1 Purpose
This document specifies the functional and non-functional requirements of the GranthSetu – Abhyasika Management System, a unified cloud-based platform for study-centre administration, fee collection and seat management. It is intended for GranthSetu management, the Enterprenex development team, designers, testers and future maintainers.

1.2 Scope
The software replaces manual paper registers with a secure digital system covering student admission, seat allotment, fee collection, attendance, ID cards and owner-level reporting. It will be accessible on mobile and desktop. The system is multi-branch ready from day one so that GranthSetu can add centres in future.

1.3 Definitions and Abbreviations
Term        Meaning
Abhyasika   Study room / study centre where students rent seats
GranthSetu  Brand name of the Abhyasika Management System
Owner       Abhyasika owner with full access (management/revenue/P&L)
Staff       Centre employees with limited, role-based access (no revenue/ledger data)
Student     Admitted member who rents a seat
Shift       Time slot: morning, afternoon, evening, night or 24-hour full-day
KYC / eKYC  Know Your Customer identity details / UIDAI OTP-based verification
Aadhaar_Last4 Storage of only the last 4 digits of Aadhaar (UIDAI compliance rule)
Dual Alerts Simultaneous notifications dispatched to both student and parent mobile
UPI         Unified Payments Interface
RBAC        Role-based access control (Owner, Staff, Student)
SRS         Software Requirements Specification

1.4 References
• Project Requirement Sheet: Abhyasika Management Software (Enterprenex Solution Pvt. Ltd., 2 pages)
• Change Request CR-01: Company Razorpay, Company GitHub, Dual Messaging, Mobile OTP + Aadhaar Verification

2. Overall Description
2.1 Product Perspective
A new, standalone, cloud-based web application (responsive for mobile and desktop) with role-based logins for Owner, Staff and Student. It integrates with the company's Razorpay merchant account, WhatsApp Business API with SMS fallback, and a licensed Aadhaar eKYC provider (Digio/Setu/Signzy).

2.2 Product Functions (Summary)
1. Sales management (walk-in enquiry pipeline and conversions)
2. Student fees management (shift/hourly/monthly plans, partial payments, receipts)
3. Seat reservation with live interactive seat map (double-booking prevention)
4. Owner dashboard (real-time collections, occupancy %, dues, P&L)
5. Staff dashboard (attendance, allotments, payments; zero visibility into owner ledger)
6. Payment gateway integration (Company Razorpay account with webhook auto-reconciliation)
7. Digital admission form with dual mobile OTP and Aadhaar eKYC
8. Automatic QR code generation (signed unique token per student)
9. Automatic ID card generation (print-ready PDF with QR, photo, shift and seat)
10. Dual-channel messaging: Simultaneous WhatsApp/SMS to both Student and Parent
11. Advanced features: QR attendance with study-hour tracking, income/expense ledger, multi-branch, student self-service portal, encrypted backups

2.3 User Classes and Characteristics
User                                Description                                 Access level
Owner                               Runs the centre; needs full visibility      Full, all branches, ledger, P&L, audit logs
Staff                               Front-desk & operations; basic computer/phone Limited: attendance, seat allotment, fees; NO owner-level financial data
Student                             Seat holder / self-service                  Own profile, seat status, fee history, renewals, pay online
System Administrator (Enterprenex)  Maintains and supports the platform         Technical administration, DevOps, backups

2.4 Operating Environment
• Web application running on modern browsers (Chrome, Edge, Firefox, Safari) on desktop, tablet and mobile.
• Cloud-hosted backend and PostgreSQL database with automated nightly backups.
• QR scanning via device web-camera (browser-based on staff mobile, tablet, or counter laptop).

2.5 Design and Implementation Constraints
• Payments must route exclusively through the company's Razorpay account; live keys stored in encrypted server environment variables only (never in client-side code).
• Webhook-only payment confirmation: Invoices marked paid solely via authenticated Razorpay webhook signatures.
• UIDAI Aadhaar Privacy Rule: Explicit student consent required; strictly store the last 4 digits only (aadhaar_last4); the full 12-digit number is never stored, logged, or displayed.
• Dual Messaging: Notifications must route to both Student and Parent numbers (WhatsApp primary, DLT-registered SMS fallback).
• Company GitHub: Private repository under the company GitHub organization with branch protection on main.

2.6 Assumptions and Dependencies
• The client will supply fee plans, shift timings, seat layout and branding (logo) for ID cards and receipts.
• The client maintains an active company Razorpay merchant account and approved WhatsApp/DLT SMS templates.
• Students and parents have active mobile numbers for OTP and notifications.
• Stable internet is available at the centre.


3. Functional Requirements
Requirement IDs use the format FR-module-number. Priority: M = Must, S = Should.

3.1 Sales Management (FR-SM)
ID       Requirement                                                                                      Priority
FR-SM-1  Record walk-in enquiries with name, contact, preferred shift and plan, and enquiry date.         M
FR-SM-2  Track enquiry status (new, follow-up, converted, lost) and convert an enquiry to an admission in 1 click. M
FR-SM-3  Show revenue generated per seat, per plan and per batch/shift.                                   M
FR-SM-4  Provide a daily sales snapshot: enquiries, conversions, conversion rate and revenue.             M
FR-SM-5  Allow follow-up reminders and notes against each enquiry.                                        S

3.2 Student Fees Management (FR-FM)
ID       Requirement                                                                                      Priority
FR-FM-1  Configure plan-wise fee structures: hourly, shift-based, monthly, quarterly.                     M
FR-FM-2  Auto-calculate fees and due dates from the student's plan and joining date.                     M
FR-FM-3  Record full and partial payments (cash, UPI, Razorpay) and track pending balance (never negative). M
FR-FM-4  Dual Fee Reminders: Send automated reminders 3 days before, on due date, and 2 days after due date to BOTH Student and Parent mobile numbers. M
FR-FM-5  Generate an instant digital receipt for every transaction (PDF) with sequential branch numbering. M
FR-FM-6  Maintain complete fee history per student and a real-time list of all defaulters/dues.          M
FR-FM-7  Support discounts, late fees, refunds and adjustments with mandatory reason and audit log entry. S

3.3 Student Seat Reservation System (FR-SR)
ID       Requirement                                                                                      Priority
FR-SR-1  Display a live visual seat map showing vacant (green), booked (red) and reserved (amber) seats.  M
FR-SR-2  Allocate seats shift-wise: morning, afternoon, evening, night and 24-hour full-day.              M
FR-SR-3  Double-Booking Prevention: Database exclusion constraint ensuring a seat+shift has only one active allocation per date range. M
FR-SR-4  24-Hour Shift Override: Booking a 24-hour full-day shift on a seat automatically blocks all other individual shifts on that seat. M
FR-SR-5  Allow seat change, transfer and release (on exit or non-renewal) with historical tracking.       M
FR-SR-6  Allow the owner to configure seat layout (sections, quiet zones, charging points, lockers).     M

3.4 Owner Dashboard (FR-OD)
ID       Requirement                                                                                      Priority
FR-OD-1  Show real-time revenue (today, week, month, custom range) accessible within 2 clicks on mobile.  M
FR-OD-2  Show occupancy rate overall and by shift with real-time percentage indicators.                  M
FR-OD-3  Show due payments, upcoming renewals and defaulter lists with 1-click reminder dispatch.        M
FR-OD-4  Show staff operational activity (logins, collections, allotments).                              M
FR-OD-5  Responsive mobile-first layout accessible anywhere via secure login.                             M
FR-OD-6  Owner controls to manage users, roles, branches, fee plans, seats and system configurations.     M

3.5 Staff Dashboard (FR-ST)
ID       Requirement                                                                                      Priority
FR-ST-1  Role-based login for staff accounts created and managed by the owner.                            M
FR-ST-2  Staff can manage student attendance, seat allotment and offline fee collection.                  M
FR-ST-3  Staff Revenue Wall: Staff CANNOT view owner-level data (total revenue, profit & loss, expenses, or other staff activity). HTTP 403 enforced on all financial APIs. M
FR-ST-4  Log every staff action with user ID, timestamp, old values and new values in audit_logs.        M

3.6 Payment Gateway Integration (FR-PG) - Company Razorpay Account
ID       Requirement                                                                                      Priority
FR-PG-1  Integrate Company Razorpay Account: Online payment collection via UPI, cards, net banking, and dynamic payment links. M
FR-PG-2  Webhook Auto-Reconciliation: Payments marked successful ONLY upon receiving and verifying authentic Razorpay webhook signatures (never trust client redirect). M
FR-PG-3  Idempotency & Error Handling: Handle duplicate webhook calls, failed transactions, and refunds safely without double-crediting balances. M
FR-PG-4  Dual Payment Receipt Alert: Trigger instant payment receipt link to BOTH Student and Parent on successful webhook capture. M
FR-PG-5  Provide daily gateway settlement reconciliation reports against recorded fees.                   S

3.7 Admission Form & eKYC (FR-AF)
ID       Requirement                                                                                      Priority
FR-AF-1  Digital admission form capturing student KYC, course goal, shift preference, and guardian details. M
FR-AF-2  Dual Mobile Verification: Student mobile and Parent mobile must both be verified via SMS OTP.    M
FR-AF-3  UIDAI Aadhaar eKYC: OTP verification through licensed provider (Digio/Setu/Signzy) with explicit consent checkbox. Store ONLY the last 4 digits (aadhaar_last4) and provider ref. Full 12 digits never saved. M
FR-AF-4  Photo upload, duplicate mobile validation, and auto-generated unique Student Reg No (e.g. GS-2026-0001). M
FR-AF-5  Allow the owner or staff to view student profile, edit details, deactivate or re-admit.           M
FR-AF-6  Print or download the complete admission form as a PDF document.                                S

3.8 Automatic QR Code Generation (FR-QR)
ID       Requirement                                                                                      Priority
FR-QR-1  Auto-generate a cryptographically signed unique QR token for every admitted student.             M
FR-QR-2  The QR code supports browser-based attendance check-in and check-out.                           M
FR-QR-3  Scanning the QR code displays student profile, photo, allotted seat, shift and fee clearance status. M
FR-QR-4  Invalidate the QR code when a student exits or defaults; support token regeneration.             S

3.9 Automatic ID Card Generation (FR-ID)
ID       Requirement                                                                                      Priority
FR-ID-1  Auto-generate a unique ID card for every admitted student in under 1 minute.                     M
FR-ID-2  Card template includes: Centre Branding (GranthSetu), Student Name, Photo, Course, Shift, Allotted Seat, Address, Emergency Contact, Reg ID, and High-Res QR. M
FR-ID-3  Provide print-ready PDF/image format (CR80 standard card size) and bulk printing capabilities.    M
FR-ID-4  Configurable template carrying GranthSetu logo and centre contact information.                   S

3.10 Advanced Features
3.10.1 Dual Alerts and Notifications (FR-AL)
ID       Requirement                                                                                      Priority
FR-AL-1  Dual Notification Routing: Every message (Admission Confirmation, Fees Due, Fees Paid) dispatched simultaneously to BOTH Student and Parent mobile numbers. M
FR-AL-2  Primary channel WhatsApp Business API (utility category); automatic fallback to DLT-approved SMS. M
FR-AL-3  Message log dashboard tracking delivery status, provider message IDs, timestamps, and retry counts. S

3.10.2 QR Attendance & Study Hours (FR-AT)
ID       Requirement                                                                                      Priority
FR-AT-1  Record attendance via browser camera QR scan-in and scan-out with exact timestamps.             M
FR-AT-2  Anti-duplicate scan protection and automated daily study-hour calculations per student.         M
FR-AT-3  Daily study-hour reports per student, shift, and branch; flag missed check-outs for staff review. S

3.10.3 Expense and Income Ledger (FR-LG)
ID       Requirement                                                                                      Priority
FR-LG-1  Itemized ledger for income (fees, locker rentals, misc) and expenses (rent, electricity, wifi, maintenance, salaries). M
FR-LG-2  Calculate monthly and quarterly profit and loss (P&L) statement at centre and branch level.      M
FR-LG-3  Confidentiality: Ledger and P&L completely restricted to Owner role (hidden from Staff).         M

3.10.4 Multi-Branch Architecture (FR-MB)
ID       Requirement                                                                                      Priority
FR-MB-1  Multi-branch from day one: Every table carries branch_id; users and records scoped to branches. S
FR-MB-2  Branch switcher interface with consolidated owner view across all branches.                     S

3.10.5 Receipts and Invoices (FR-RC)
ID       Requirement                                                                                      Priority
FR-RC-1  Generate automated PDF receipts with branch-specific sequential numbering (e.g. GS-PUN-0001).    M
FR-RC-2  Auto-dispatch receipt download links to both Student and Parent via WhatsApp and SMS.            S

3.10.6 Analytics and Reports (FR-AN)
ID       Requirement                                                                                      Priority
FR-AN-1  Track occupancy trends, revenue velocity, and student retention/churn insights.                  M
FR-AN-2  Export financial ledgers and student rosters to PDF and Excel/CSV format.                        S

3.10.7 Cloud Backup and Access Control (FR-BK)
ID       Requirement                                                                                      Priority
FR-BK-1  Automated, encrypted daily cloud backups of PostgreSQL database and uploaded media.              M
FR-BK-2  Role-based access control (RBAC) enforced on every API route and server action.                 M
FR-BK-3  Documented disaster recovery and restore procedure with RPO < 24 hrs, RTO < 4 hrs.               S

3.10.8 Student Self-Service Portal (FR-SS)
ID       Requirement                                                                                      Priority
FR-SS-1  Passwordless student mobile OTP login to view active seat status, shift hours, and profile.      M
FR-SS-2  Students can view complete fee history, outstanding dues, and download receipts and ID card.   M
FR-SS-3  Students can pay pending dues online directly via Razorpay portal integration.                   S

4. External Interface Requirements
4.1 User Interfaces
• Responsive, mobile-first design usable on smartphones, tablets and desktop computers.
• High-contrast visual seat map: vacant (green), booked (red), reserved (amber).
• Clean, simple interface allowing staff to complete admissions in under 3 minutes.
• Language support: English primary; Marathi and Hindi localized labels prepared for future release.

4.2 Hardware Interfaces
• Device camera (web-cam or mobile browser camera) for QR attendance scanning and student photo capture.
• Standard office desk printers for receipts and ID cards (PVC card printer optional).

4.3 Software Interfaces
• Company Razorpay Payment Gateway API (Orders, Payments, Webhooks).
• WhatsApp Business Cloud API / BSP (Gupshup, Meta) with fallback SMS gateway (MSG91, Fast2SMS).
• Licensed Aadhaar eKYC Gateway (Digio, Setu, Signzy) adhering to UIDAI guidelines.
• S3-compatible cloud storage for student photos, KYC docs and automated backups.

4.4 Communication Interfaces
• HTTPS / TLS 1.3 encryption for all client-server communication.
• Webhooks with cryptographic signature verification for Razorpay and WhatsApp status receipts.
• REST / Server Action endpoints with JSON request-response formatting.

5. Non-Functional Requirements
Category        Requirement
Performance     Standard pages load within 2 seconds; live seat map refreshes within 2 seconds; supports 500+ students and 20+ concurrent users per branch.
Availability    At least 99.5% monthly uptime, excluding scheduled off-hours maintenance.
Security        HTTPS/TLS, JWT/session auth, RBAC permissions wall, rate-limiting on OTP requests (5-min expiry, max 3 attempts), OWASP Top 10 protection, no card data stored.
Data Privacy    UIDAI compliance: Only last 4 digits of Aadhaar stored; full number never logged. Student KYC data restricted to authorized roles.
Reliability     Daily automated encrypted backups; RPO <= 24 hours, RTO <= 4 hours.
Usability       New staff member can operate admissions, seat allotments and fee collection with under 30 minutes of orientation.
Scalability     Multi-branch database schema supports adding new branches without code redesign.
Compatibility   Tested and verified across latest Chrome, Edge, Safari, Firefox, and mobile browsers (Android Chrome, iOS Safari).
Maintainability Clean modular TypeScript code, Prisma schema migrations, and version-controlled GitHub releases.
Auditability    All financial transactions, seat transfers, and discounts logged in audit_logs with user ID and timestamp; records cannot be silently deleted.

6. Data Requirements
6.1 Main Data Entities
branches, users, roles, students, guardians, enquiries, shifts, seats, seat_allocations, fee_plans, student_fees, payments, receipts, attendance, expenses, incomes, notifications, message_logs, otp_requests, aadhaar_verifications, audit_logs.

6.2 Key Data Rules
• Each admitted student has a unique Student Reg ID and a signed unique QR token.
• Single Active Occupancy: A seat + shift can have strictly one active occupant per date range.
• Balance Formula: Balance = Plan Amount - Sum(Approved Payments); partial payments allowed, never negative.
• 24-Hour Block: A 24-hour shift allocation locks all other shifts on that seat for the period.
• Webhook Authority: Payments marked paid solely via authenticated gateway webhooks.
• Sequential Receipts: Receipt numbers are branch-prefixed, strictly sequential, and immutable.
• Dual Log Rule: Every message event generates logged entries for both student and parent mobile numbers.

7. Key Business Workflows
1. Enquiry to Admission: Walk-in recorded -> follow-up -> digital admission form -> student & parent mobile OTP verified -> Aadhaar eKYC consent & last 4 check -> seat & shift allotted -> first fee collected -> receipt & QR generated -> ID card ready -> dual welcome messages dispatched.
2. Fee Collection: System flags due -> payment collected offline (cash/UPI) or online (Razorpay payment link) -> webhook verifies signature -> student fee balance updated -> sequential PDF receipt issued -> dual WhatsApp/SMS confirmation sent.
3. Seat Renewal: Automated reminder sent 3 days before expiry to student and parent -> student renews (paid) or seat is released to vacant on seat map.
4. Daily Attendance: Student presents ID card -> desk web-cam scans QR -> anti-duplicate verified -> check-in logged -> check-out logs departure and calculates total study hours.

8. Acceptance Criteria (High Level)
• Admission completed in under 3 minutes; ID card printed in under 1 minute.
• Zero double-booking of seats enforced by database constraints.
• 100% reconciliation: Fee balances exactly match gateway and cash receipts.
• Dual notifications delivered to both student and parent mobile numbers for all 3 trigger events.
• Staff cannot view owner revenue, ledger, or other staff activity.
• Owner can inspect today's collections, occupancy and dues within 2 clicks on mobile.
• Daily automated cloud backups complete successfully.

9. Out of Scope (Phase 7 Post-Launch Backlog)
• Physical biometric fingerprint / facial recognition hardware integration.
• Direct accounting software sync (Tally / Zoho Books integration).
• Native iOS/Android app store builds (replaced by installable responsive PWA).
• Online classroom, LMS, or video course hosting.

10. Project Head Confirmations & Parameters (Status)
Item                                Status / Parameter
1. Payment Gateway                  RESOLVED: Company Razorpay Account (Webhook confirmation, test mode -> live)
2. WhatsApp & SMS Provider          RESOLVED: WhatsApp Cloud API / BSP with SMS DLT fallback; Dual Student + Parent routing
3. Aadhaar Verification Provider    RESOLVED: Digio / Setu API (UIDAI-compliant OTP eKYC, last 4 digits only)
4. Source Control & Repository      RESOLVED: Company GitHub Organization (Private repo, main/develop branches)
5. Delivery Timeline                RESOLVED: 14-Week Roadmap (Weeks 1-10 MVP, Weeks 11-13 Advanced, Week 14 Launch)
6. Shift Timings                    Morning (06:00-14:00), Afternoon (14:00-22:00), Evening (18:00-23:00), 24-Hour
7. Seat Layout & Capacity           Configured per branch (e.g. 48 seats in initial Shivaji Nagar model)
8. ID Card Format                   CR80 standard PVC dimensions & print-ready multi-card PDF layout

11. Acceptance & Formal Sign-Off

By signing below, Enterprenex Solution Pvt. Ltd. and GranthSetu agree that this Software Requirements Specification (SRS v2.0) defines the complete baseline scope for the 14-week project. Any additions outside this document shall follow the formal Change Request process.


For Client: GranthSetu (Studyplus Abhyasika)

Authorized Signature: _____________________________________________
Name:                 _____________________________________________
Designation:          Proprietor / Managing Director ("Sir")
Date:                 _____________________________________________
Official Stamp:


For Developer: Enterprenex Solution Pvt. Ltd.

Authorized Signature: _____________________________________________
Name:                 _____________________________________________
Designation:          Project Lead / Technical Director
Date:                 _____________________________________________
Company Seal:

