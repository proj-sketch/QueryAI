import io
import pandas as pd
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from config import ALLOWED_ORIGINS
from rate_limiter import rate_limiter
from gemini_client import generate_response, generate_sql_query
from database import db_manager

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
    sql_query: str | None = None
    chart_type: str | None = None
    chart_data: list | None = None


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

    # Step 1: Check if we have datasets
    datasets = db_manager.list_datasets()
    
    chart_type = None
    chart_data = None
    sql_query = None
    query_results = None

    if datasets:
        # Step 2: Attempt to generate SQL
        sql_gen = await generate_sql_query(query, datasets)
        if sql_gen.get("sql"):
            sql_query = sql_gen["sql"]
            chart_type = sql_gen.get("chart_type", "table")
            
            # Step 3: Execute SQL locally
            query_results = db_manager.execute_query(sql_query)
            if query_results.get("success"):
                chart_data = query_results.get("results")

    # Step 4: Final insight from Gemini
    result = await generate_response(query, query_results, chart_type)

    return QueryResponse(
        response=result["response"],
        error=result["error"],
        remaining=rate_limiter.status(),
        sql_query=sql_query,
        chart_type=chart_type,
        chart_data=chart_data,
    )


# ========== File Upload ==========

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload a CSV or Excel file and ingest it into SQLite."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    # Validate extension
    filename = file.filename.lower()
    if not filename.endswith((".csv", ".xlsx", ".xls")):
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Please upload a CSV or Excel file.",
        )

    try:
        contents = await file.read()
        file_like = io.BytesIO(contents)

        # Parse with pandas
        if filename.endswith(".csv"):
            try:
                df = pd.read_csv(file_like)
            except UnicodeDecodeError:
                file_like.seek(0)
                df = pd.read_csv(file_like, encoding='ISO-8859-1')
        else:
            df = pd.read_excel(file_like)

        if df.empty:
            raise HTTPException(status_code=400, detail="The uploaded file is empty.")

        # Ingest into SQLite
        result = db_manager.ingest_dataframe(df, file.filename)

        return {
            "success": True,
            "message": f"Successfully uploaded '{file.filename}'",
            **result,
        }

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Error processing file: {str(e)}",
        )


@app.get("/api/datasets")
async def list_datasets():
    """List all uploaded datasets."""
    datasets = db_manager.list_datasets()
    return {"datasets": datasets, "count": len(datasets)}


if __name__ == "__main__":
    import uvicorn
    from config import BACKEND_HOST, BACKEND_PORT

    uvicorn.run("main:app", host=BACKEND_HOST, port=BACKEND_PORT, reload=True)
