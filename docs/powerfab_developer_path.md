# Tekla PowerFab developer path

## Recommended route

Start with the official PowerFab developer resources and verify the required operations before choosing an API. Trimble currently exposes two materially different integration routes:

- The PowerFab Open API/.NET route is the mature and broad interface. Trimble describes it as XML over a direct socket connection and expects the integration to run on the same LAN or a secure VPN as the PowerFab server.
- The PowerFab Go REST API is JSON over HTTPS but has a smaller and evolving endpoint set. Inspect its live OpenAPI schema and confirm every required endpoint before making it an architectural dependency.

Official overview: [An Introduction to the PowerFab APIs](https://support.tekla.com/sv/node/195122). Developer home: [Tekla PowerFab Developer Center](https://developer.tekla.com/tekla-powerfab).

## Access sequence

1. Create or confirm each developer's Trimble Identity under the company-controlled email domain.
2. Join the [Tekla PowerFab Developer Forum](https://developer.tekla.com/tekla-developer-community) for supported technical questions.
3. Decide whether ProRack's licensed PowerFab environment is sufficient for internal development. Trimble states that development requires a PowerFab licence or membership in the Tekla Partners Program.
4. Apply to the [Tekla Partners Program](https://developer.tekla.com/tekla-partners-program) if ProRack needs the partner suite, formal support, distribution rights or plans to sell the integration.
5. For PowerFab Go REST access, submit the application-registration form linked from Trimble's API overview to obtain a consumer key/secret and callback registration. Store credentials in a server-side secret store.
6. Build a read-only proof of concept against a non-production/test database and record PowerFab version, API version, site/region and permissions.

## First proof of concept

Do not begin with a full ERP sync. Prove one narrow read path:

- list or retrieve a small set of jobs/projects;
- map immutable IDs and modified timestamps;
- compare returned data with PowerFab UI records;
- record pagination, filtering, authentication expiry and error behaviour;
- confirm which API supports the operation without unsupported database access.

Then test inventory, production status and shipping-status workflows one at a time. Keep ERPNext as the business-system boundary until field ownership and conflict rules are explicitly approved.

## Questions for Trimble/partner support

- Which API and version support the exact project, production, inventory, QC and shipping data ProRack needs?
- Is an on-premise service account supported, and how are least-privilege permissions assigned?
- Are write operations idempotent, and is there an audit/event feed or only polling?
- What are the supported request limits, pagination rules and backward-compatibility policy?
- Does PowerFab Go REST support the India/APAC tenant region and multiple sites through `X-Site-Subdomain`?
- Which licences are required for development, production service accounts, PowerFab Go users and information-only users?
- What test/sandbox environment is available?

Trimble's current getting-started guide says the .NET package is `Tekla.PowerFab.API` and is available through NuGet: [Getting started with the Tekla PowerFab API](https://developer.tekla.com/documentation/getting-started-tekla-powerfab-api).

