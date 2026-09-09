# ProRack ERPNext project fetcher

A read-only starting point using `GET /api/resource/Project`. It fetches all pages, orders by project ID, and defaults to `status = Open`. `--all` includes every status accessible to the API user; `--status` accepts a custom status.

`Open` and `Is Active` are separate fields. Add `--active-only` to require `is_active = Yes`. This filter is optional because ProRack's definition of "current" has not been confirmed. For the architecture review, see [the digital-thread analysis](docs/architecture_analysis.md).

## Run in PowerShell

With Python 3.10 or newer installed:

```powershell
python -m pip install -r requirements.txt
$env:ERP_URL = 'https://your-erp-domain.com'
$env:ERP_API_KEY = Read-Host 'ERP API key'
$taskSecret = Read-Host 'ERP API secret' -AsSecureString
$env:ERP_API_SECRET = [System.Net.NetworkCredential]::new('', $taskSecret).Password
python fetch_projects.py
```

Use the ERP site base URL, without `/app` or `/api/resource/Project`. Obtain an API key and secret from the integration user's API Access section in ERPNext. Give that user read access to Project and the relevant projects. Do not paste credentials into chat or commit them. The script reads process environment variables; it does not load `.env` files.

```powershell
# Every status, including completed/cancelled projects:
python fetch_projects.py --all

# Open AND active projects:
python fetch_projects.py --active-only

# Active projects of every status (may include completed projects):
python fetch_projects.py --all --active-only

# A specific status in your installation:
python fetch_projects.py --status 'Open'

# Save JSON locally (the count is printed separately to stderr):
python fetch_projects.py > projects.json

# Remove credentials from this shell when finished:
Remove-Item Env:ERP_API_KEY, Env:ERP_API_SECRET
```

Output contains `name`, `project_name`, `status`, `customer`, `expected_start_date`, `expected_end_date`, `percent_complete`, `is_active`, `percent_complete_method`, and `modified`. These are standard Project fields; adjust `PROJECT_FIELDS` if your installation uses different fields or permissions. An empty JSON array means no matching visible projects; it does not prove the ERP has no projects.

`percent_complete` is the ERP project's measure, whose basis appears in `percent_complete_method`; it must not be relabeled as fabrication or installation progress. `expected_end_date` is not automatically an approved contractual baseline. `modified` is the ERP record's change timestamp, not a PowerFab refresh timestamp or a manufacturing event time.

## Reuse from Python

```python
import os
from fetch_projects import ERPNextClient

erp = ERPNextClient(
    os.environ['ERP_URL'],
    os.environ['ERP_API_KEY'],
    os.environ['ERP_API_SECRET'],
)
try:
    projects = erp.get_all_projects()  # status=None for every status
finally:
    erp.close()
```

Requests use token authentication, certificate validation, and connection/read timeouts. Redirects are rejected; configure the canonical HTTPS URL. Errors return a nonzero exit code without dumping server responses or credentials. Pagination is ordered but is not a consistent database snapshot if projects change during the fetch.

Reference: [Frappe REST API documentation](https://docs.frappe.io/framework/user/en/api/rest).

Field reference: [official ERPNext v15 Project schema](https://github.com/frappe/erpnext/blob/version-15/erpnext/projects/doctype/project/project.json). Confirm the installed version and customizations before broader integration.

This workspace already has dependencies installed in `.venv`. You can run `.\.venv\Scripts\python.exe fetch_projects.py` after setting the environment variables above. A new workstation can use the installation steps above.

The actual ERP connection requires your site's URL and credentials and has not been verified against ProRack's installation.
