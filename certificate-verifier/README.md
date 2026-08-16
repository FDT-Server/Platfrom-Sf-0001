# Certificate Verifier Microservice

A standalone Python FastAPI microservice for verifying student certificates based on URLs.

## Features

- Validates that the URL uses HTTP or HTTPS.
- Protects against SSRF (rejects localhost, private IPs, link-local addresses, etc.).
- Follows redirects safely and validates every destination.
- Limits downloaded certificate size to 5 MB.
- Uses strict HTTP timeouts (10 seconds).
- Supports PDF certificates using `PyMuPDF` (`fitz`).
- Supports HTML credential pages using `BeautifulSoup`.
- Extracts readable text and compares it securely with the authenticated student's name (normalized).
- Detects the claimed certificate issuer.

## Current Limitation

**Important**: Generic certificates cannot be declared fully authentic (`valid: true`) without an official issuer verification mechanism. Simply finding the words "Microsoft" or "Google" inside a PDF is not sufficient proof of authenticity. 

Currently, if independent cryptographic or API-based verification from the issuer cannot be performed, the service will return:
```json
{
  "valid": false,
  "reason": "Certificate identity could not be independently verified."
}
```
This architecture is modular so issuer-specific verification can be added later.

## Installation & Virtual Environment

Requires Python 3.10+.

1. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

2. Activate the virtual environment:
   - On Windows:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the FastAPI Server

Start the development server using uvicorn:

```bash
python main.py
```
Or directly with uvicorn:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`.

## API Request Example

**POST** `/verify-certificate`

```json
{
    "student_name": "Student Name",
    "certificate_url": "https://example.com/certificate",
    "claimed_issuer": "Microsoft"
}
```

## API Response Example

```json
{
    "valid": false,
    "url_accessible": true,
    "content_readable": true,
    "student_name_match": true,
    "issuer_detected": "Microsoft",
    "issuer_verified": false,
    "certificate_id": null,
    "reason": "Certificate identity could not be independently verified."
}
```
*(Note: `valid` will remain `false` until an official verification integration is implemented).*

## Testing

Run the test suite using `pytest`:

```bash
pytest
```
To run tests with async support:
```bash
pytest -v tests/
```
