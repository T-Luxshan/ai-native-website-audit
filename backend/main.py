import os

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from routes.audit import router

load_dotenv()

app = FastAPI(title="Website Audit API")

cors_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.exception_handler(RequestValidationError)
async def audit_validation_handler(request: Request, exc: RequestValidationError):
    if request.url.path == "/api/audit":
        errors = exc.errors()
        if any(error.get("loc") == ("body", "url") for error in errors):
            return JSONResponse(
                status_code=400,
                content={"detail": "URL must be a valid http or https address"},
            )
    return JSONResponse(status_code=422, content={"detail": exc.errors()})
