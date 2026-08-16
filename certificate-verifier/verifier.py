import re
import socket
import httpx
import fitz  # PyMuPDF
from urllib.parse import urlparse
from bs4 import BeautifulSoup

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

PRIVATE_IP_REGEX = re.compile(
    r"^(127\.\d+\.\d+\.\d+)|"
    r"^(10\.\d+\.\d+\.\d+)|"
    r"^(172\.1[6-9]\.\d+\.\d+)|"
    r"^(172\.2[0-9]\.\d+\.\d+)|"
    r"^(172\.3[0-1]\.\d+\.\d+)|"
    r"^(192\.168\.\d+\.\d+)|"
    r"^(169\.254\.\d+\.\d+)|"
    r"^::1|"
    r"^[fF][cCdD][0-9a-fA-F]{2}:|"
    r"^[fF][eE][89aAbB][0-9a-fA-F]:|"
    r"localhost",
    re.IGNORECASE
)

def is_safe_url(url: str) -> bool:
    try:
        parsed = urlparse(url)
        if parsed.scheme not in ("http", "https"):
            return False
        
        hostname = parsed.hostname
        if not hostname:
            return False
        
        if PRIVATE_IP_REGEX.match(hostname):
            return False
            
        try:
            ip = socket.gethostbyname(hostname)
            if PRIVATE_IP_REGEX.match(ip):
                return False
        except socket.gaierror:
            pass
            
        return True
    except Exception:
        return False

def normalize_string(s: str) -> str:
    if not s:
        return ""
    s = s.lower()
    s = re.sub(r"[^\w\s]", "", s)
    return re.sub(r"\s+", " ", s).strip()

def extract_text_from_html(html: str) -> str:
    soup = BeautifulSoup(html, "html.parser")
    for script in soup(["script", "style"]):
        script.extract()
    return soup.get_text(separator=" ")

def extract_text_from_pdf(content: bytes) -> str:
    try:
        text = ""
        with fitz.open(stream=content, filetype="pdf") as doc:
            for page in doc:
                text += page.get_text() + " "
        return text
    except Exception as e:
        print(f"PDF extraction error: {e}")
        return ""

async def fetch_url_safely(url: str) -> dict:
    current_url = url
    redirects_followed = 0
    max_redirects = 5

    async with httpx.AsyncClient(timeout=10.0, follow_redirects=False) as client:
        while redirects_followed <= max_redirects:
            if not is_safe_url(current_url):
                return {"error": "URL failed SSRF safety checks.", "accessible": False}
                
            try:
                # We use stream to enforce size limits
                async with client.stream("GET", current_url) as response:
                    if response.status_code in (301, 302, 303, 307, 308):
                        current_url = response.headers.get("location")
                        if not current_url:
                            return {"error": "Invalid redirect.", "accessible": False}
                        # Handle relative redirects
                        if not current_url.startswith("http"):
                            current_url = str(response.url.join(current_url))
                        redirects_followed += 1
                        continue
                    
                    response.raise_for_status()
                    
                    content_length = response.headers.get("Content-Length")
                    if content_length and int(content_length) > MAX_FILE_SIZE:
                        return {"error": "File exceeds maximum allowed size.", "accessible": True, "readable": False}
                        
                    content = b""
                    async for chunk in response.aiter_bytes():
                        content += chunk
                        if len(content) > MAX_FILE_SIZE:
                            return {"error": "File exceeds maximum allowed size.", "accessible": True, "readable": False}
                            
                    return {
                        "content": content,
                        "content_type": response.headers.get("content-type", "").lower(),
                        "accessible": True,
                        "readable": True
                    }
                    
            except httpx.HTTPStatusError as e:
                return {"error": f"HTTP Error {e.response.status_code}", "accessible": False}
            except httpx.RequestError as e:
                return {"error": f"Network error: {str(e)}", "accessible": False}
            except Exception as e:
                return {"error": f"Unexpected error: {str(e)}", "accessible": False}
                
    return {"error": "Too many redirects.", "accessible": False}

async def verify_certificate(student_name: str, url: str, claimed_issuer: str) -> dict:
    result = {
        "valid": False,
        "url_accessible": False,
        "content_readable": False,
        "student_name_match": False,
        "issuer_detected": None,
        "issuer_verified": False,
        "certificate_id": None,
        "reason": ""
    }

    fetch_result = await fetch_url_safely(url)
    if "error" in fetch_result:
        result["reason"] = fetch_result["error"]
        result["url_accessible"] = fetch_result.get("accessible", False)
        result["content_readable"] = fetch_result.get("readable", False)
        return result

    result["url_accessible"] = True
    result["content_readable"] = True

    content = fetch_result["content"]
    content_type = fetch_result["content_type"]
    
    text_content = ""
    if "application/pdf" in content_type or url.lower().endswith(".pdf"):
        text_content = extract_text_from_pdf(content)
    else:
        text_content = extract_text_from_html(content.decode('utf-8', errors='ignore'))
        
    if not text_content.strip():
        result["content_readable"] = False
        result["reason"] = "Could not extract text from the provided URL."
        return result
        
    norm_student_name = normalize_string(student_name)
    norm_content = normalize_string(text_content)
    
    if norm_student_name and norm_student_name in norm_content:
        result["student_name_match"] = True

    norm_claimed_issuer = normalize_string(claimed_issuer)
    if norm_claimed_issuer and norm_claimed_issuer in norm_content:
        result["issuer_detected"] = claimed_issuer

    # Overall valid must remain false unless independent verification is actually established
    result["valid"] = False
    result["reason"] = "Certificate identity could not be independently verified."
    
    return result
