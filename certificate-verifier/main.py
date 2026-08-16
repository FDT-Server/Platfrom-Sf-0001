from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from verifier import verify_certificate

app = FastAPI(title="Certificate Verification Service")

class CertificateVerificationRequest(BaseModel):
    student_name: str
    certificate_url: str
    claimed_issuer: str

class CertificateVerificationResponse(BaseModel):
    valid: bool
    url_accessible: bool
    content_readable: bool
    student_name_match: bool
    issuer_detected: Optional[str] = None
    issuer_verified: bool
    certificate_id: Optional[str] = None
    reason: str

@app.post("/verify-certificate", response_model=CertificateVerificationResponse)
async def api_verify_certificate(request: CertificateVerificationRequest):
    try:
        result = await verify_certificate(
            student_name=request.student_name,
            url=request.certificate_url,
            claimed_issuer=request.claimed_issuer
        )
        return CertificateVerificationResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
