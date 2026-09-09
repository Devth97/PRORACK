# ProRack execution plan

## 1. Website and RFQ assistant — implemented MVP

- Professional responsive React/TypeScript website.
- Consent-aware UTM/referrer attribution.
- Project enquiry form and guided RFQ chatbot.
- PDF, Word, Excel and text RFQ/RFP upload up to 10 MB.
- Local event storage and optional sales webhook.
- Production build, API endpoint checks and browser console checks passed.

Before public launch: approve final content and recipients, connect the sales webhook/CRM, choose hosting/domain, add production database and security controls, and complete privacy/legal review.

## 2. ERPNext project request — ready for live credentials

`fetch_projects.py` performs a read-only paginated request to Frappe's Project resource and defaults to open projects. Run it on the Tailscale gateway using environment variables; never commit credentials. The only remaining gate is the actual ERP URL plus a least-privilege API key/secret.

## 3. China visit — working checklist created

Use `china_visit_readiness.md` to collect the current M-visa pack, supplier data sheets, integration evidence and factory acceptance criteria. Traveller-specific forms and bookings still require confirmed personal data, itinerary and supplier invitation documents.

## 4. PowerFab developer access — route documented

Use `powerfab_developer_path.md` to create the company-controlled Trimble Identity, join the PowerFab forum, decide on Partners Program membership and validate .NET versus REST coverage through a read-only proof of concept.

