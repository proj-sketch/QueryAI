from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from config import ALLOWED_ORIGINS
from rate_limiter import rate_limiter
from gemini_client import generate_response

app = FastAPI(
    title="QueryAI Backend",
    description="Backend API for QueryAI — Conversational Business Intelligence",
    version="1.0.0",
)

# CORS — allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ========== Models ==========

class QueryRequest(BaseModel):
    query: str


class QueryResponse(BaseModel):
    response: str | None
    error: str | None
    remaining: dict | None


# ========== Routes ==========

@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "QueryAI Backend"}


@app.get("/api/limits")
async def get_limits():
    """Get current rate limit status."""
    return rate_limiter.status()


@app.post("/api/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    """Process a natural language query using Gemini AI."""
    query = request.query.strip()

    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    # Check rate limit
    limit_check = rate_limiter.check()
    if not limit_check["allowed"]:
        return QueryResponse(
            response=None,
            error=limit_check["error"],
            remaining=limit_check["remaining"],
        )

    # Record the request
    rate_limiter.record()

    # Call Gemini
    result = await generate_response(query)

    return QueryResponse(
        response=result["response"],
        error=result["error"],
        remaining=rate_limiter.status(),
    )


if __name__ == "__main__":
    import uvicorn
    from config import BACKEND_HOST, BACKEND_PORT

    uvicorn.run("main:app", host=BACKEND_HOST, port=BACKEND_PORT, reload=True)
