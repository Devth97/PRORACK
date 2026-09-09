"""Read ERPNext projects using Frappe REST; no ERP records are changed."""

import argparse
import json
import os
import sys
from urllib.parse import urlsplit

import requests


PROJECT_FIELDS = [
    "name", "project_name", "status", "customer",
    "expected_start_date", "expected_end_date", "percent_complete",
    "is_active", "percent_complete_method", "modified",
]


class ERPNextClient:
    def __init__(self, base_url, api_key, api_secret):
        self.base_url = base_url.strip().rstrip("/")
        parsed = urlsplit(self.base_url)
        if (parsed.scheme != "https" or not parsed.hostname
                or parsed.username or parsed.password or parsed.query or parsed.fragment):
            raise ValueError("ERP_URL must be an HTTPS base URL without credentials, query, or fragment.")
        if not api_key.strip() or not api_secret.strip():
            raise ValueError("ERP_API_KEY and ERP_API_SECRET must be nonempty.")
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"token {api_key.strip()}:{api_secret.strip()}",
            "Accept": "application/json",
        })

    def close(self):
        self.session.close()

    def get_all_projects(self, status="Open", page_size=100, active_only=False):
        """Return every matching project readable by the API user.

        Pass status=None to include all statuses; active_only adds is_active=Yes.
        Open status and active status are separate ERPNext fields.
        Offset pagination is not a
        database snapshot: concurrent source changes can affect the result.
        """
        if not 1 <= page_size <= 1000:
            raise ValueError("page_size must be between 1 and 1000.")
        projects = []
        start = 0
        seen = set()
        while True:
            params = {
                "fields": json.dumps(PROJECT_FIELDS),
                "order_by": "name asc",
                "limit_start": start,
                "limit_page_length": page_size,
            }
            filters = []
            if status is not None:
                filters.append(["status", "=", status])
            if active_only:
                filters.append(["is_active", "=", "Yes"])
            if filters:
                params["filters"] = json.dumps(filters)
            response = self.session.get(
                f"{self.base_url}/api/resource/Project",
                params=params,
                timeout=(10, 30),
                allow_redirects=False,
            )
            if 300 <= response.status_code < 400:
                raise ValueError("ERP redirected the request. Set ERP_URL to the canonical HTTPS site URL.")
            response.raise_for_status()
            payload = response.json()
            batch = payload.get("data") if isinstance(payload, dict) else None
            if not isinstance(batch, list) or any(
                not isinstance(row, dict) or not isinstance(row.get("name"), str)
                for row in batch
            ):
                raise ValueError("Unexpected response: expected a data array of named Project records.")
            if not batch:
                return projects
            names = [row["name"] for row in batch]
            if len(set(names)) != len(names) or seen.intersection(names):
                raise ValueError("Duplicate projects across pages; source data may have changed. Retry the fetch.")
            seen.update(names)
            projects.extend(batch)
            # Continue until an empty page, even if the server caps page size.
            start += len(batch)


def main():
    parser = argparse.ArgumentParser(description="Fetch ERPNext projects as JSON (Open by default).")
    scope = parser.add_mutually_exclusive_group()
    scope.add_argument("--all", action="store_true", help="Include all project statuses.")
    scope.add_argument("--status", default="Open", help="Exact Project status to fetch (default: Open).")
    parser.add_argument("--active-only", action="store_true", help="Also require is_active=Yes.")
    args = parser.parse_args()
    names = ("ERP_URL", "ERP_API_KEY", "ERP_API_SECRET")
    missing = [name for name in names if not os.environ.get(name, "").strip()]
    if missing:
        print(f"Set these environment variables: {', '.join(missing)}", file=sys.stderr)
        return 1
    client = None
    try:
        client = ERPNextClient(*(os.environ[name] for name in names))
        projects = client.get_all_projects(
            status=None if args.all else args.status, active_only=args.active_only,
        )
        print(json.dumps(projects, indent=2, ensure_ascii=True))
        print(f"Fetched {len(projects)} projects.", file=sys.stderr)
        return 0
    except requests.HTTPError as error:
        code = error.response.status_code
        hints = {
            401: "Check the API key and secret.",
            403: "Check the API user's Project read permissions and user restrictions.",
            404: "Check ERP_URL and that the Project DocType exists.",
            429: "API rate limit reached; wait before trying again.",
        }
        print(f"ERP returned HTTP {code}. {hints.get(code, 'Check ERP server logs and field permissions.')}", file=sys.stderr)
    except requests.RequestException:
        print("ERP request failed. Check connectivity, the HTTPS certificate, and server availability.", file=sys.stderr)
    except ValueError as error:
        print(f"Fetch failed: {error}", file=sys.stderr)
    finally:
        if client is not None:
            client.close()
    return 1


if __name__ == "__main__":
    sys.exit(main())
