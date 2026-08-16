import pytest
from verifier import is_safe_url, normalize_string, verify_certificate

def test_is_safe_url_valid():
    assert is_safe_url("https://www.google.com") is True
    assert is_safe_url("http://example.com/certificate.pdf") is True

def test_is_safe_url_ssrf():
    assert is_safe_url("http://localhost:8000") is False
    assert is_safe_url("http://127.0.0.1") is False
    assert is_safe_url("http://[::1]") is False
    assert is_safe_url("http://10.0.0.1") is False
    assert is_safe_url("https://192.168.1.100") is False
    assert is_safe_url("http://172.16.0.5") is False
    assert is_safe_url("file:///etc/passwd") is False

def test_normalize_string():
    assert normalize_string("John Doe") == "johndoe"
    assert normalize_string("  JOHN   DOE  ") == "johndoe"
    assert normalize_string("Jane-Doe!") == "janedoe"
    assert normalize_string(None) == ""

@pytest.mark.asyncio
async def test_verify_certificate_invalid_url():
    result = await verify_certificate("Student Name", "http://localhost", "Microsoft")
    assert result["valid"] is False
    assert result["url_accessible"] is False
    assert "safety checks" in result["reason"].lower() or "unsafe" in result["reason"].lower()

@pytest.mark.asyncio
async def test_verify_certificate_inaccessible_url():
    result = await verify_certificate("Student Name", "https://this-domain-surely-does-not-exist.org", "Microsoft")
    assert result["valid"] is False
    assert result["url_accessible"] is False

@pytest.mark.asyncio
async def test_verify_certificate_unverifiable():
    # An example that won't actually fetch a real cert but tests the structure
    result = await verify_certificate("Example Name", "https://example.com", "Example Issuer")
    
    assert result["valid"] is False
    assert "independently verified" in result["reason"]

# Additional tests could mock httpx to test name match, name mismatch, and unsupported content.
