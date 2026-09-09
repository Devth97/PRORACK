# PRORACK website

Responsive React / TypeScript website in the existing Vite project.

## Run locally

Run `npm run dev:api` and `npm run dev:web` in separate terminals in this folder. Vite defaults to port 5173 and proxies `/api` to port 8787. If 5173 is occupied, use the URL printed by Vite.

## UI

- Responsive hero with a conceptual SVG warehouse illustration.
- Four storage solutions and an interactive requirement explorer.
- Company overview, engineering approach, six delivery steps and industries.
- Expandable FAQs, mobile navigation and keyboard focus styles.
- Project enquiry form with validation, loading, success and recoverable failure states.
- Consent-aware analytics: campaign attribution is included with enquiries only after analytics consent.

## Chatbot deferred

The previous chatbot was a fixed keyword-based intake flow, not AI. Its UI is removed from this release; the floating contact shortcut opens the project form. The existing backend chat and upload endpoints are retained for future work but are not invoked by the website UI. No model provider is integrated.

## Validation

`npm run build` checks both TypeScript configurations and creates `dist/`.

The enquiry form requires the existing local API. Leads are saved as NDJSON under `data/`. Sales forwarding requires a configured `SALES_WEBHOOK_URL`. Production persistence and integrations remain separate deployment work. RFQ documents should be exchanged with the project team after enquiry; there is no active document-upload UI.

UI/UX Pro Max guidance was consulted from https://github.com/nextlevelbuilder/ui-ux-pro-max-skill. No 21st MCP connection was available in this session. No API key is required or stored by the frontend.
