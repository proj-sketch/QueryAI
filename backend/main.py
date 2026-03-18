import io
import pandas as pd
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from config import ALLOWED_ORIGINS
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
    sql_query: str | None = None
    chart_type: str | None = None
    chart_data: list | None = None


# ========== Routes ==========

@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "QueryAI Backend"}





@app.post("/api/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    """Process a natural language query using Gemini AI."""
    query = request.query.strip()

    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

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
    result = await generate_response(query, query_results, chart_type, datasets)

    return QueryResponse(
        response=result["response"],
        error=result["error"],
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
            file_bytes = file_like.read()
            
            best_df = None
            max_cols = 0
            
            for enc in ['utf-8', 'utf-8-sig', 'iso-8859-1', 'cp1252', 'utf-16']:
                try:
                    text = file_bytes.decode(enc)
                    for sep in [',', ';', '\t', '|']:
                        try:
                            df_temp = pd.read_csv(io.StringIO(text), sep=sep)
                            if len(df_temp.columns) > max_cols:
                                max_cols = len(df_temp.columns)
                                best_df = df_temp
                        except Exception:
                            continue
                except UnicodeDecodeError:
                    continue
            
            if best_df is not None and max_cols > 0:
                df = best_df
            else:
                # Absolute fallback
                file_like.seek(0)
                df = pd.read_csv(file_like)
        else:
            df = pd.read_excel(file_like)

        if df.empty:
            raise HTTPException(status_code=400, detail="The uploaded file is empty.")

        # Auto-expand "squished" data (very common when CSVs are saved as XLSX by mistake)
        if len(df.columns) <= 2:
            col_data = df.iloc[:, 0].dropna().astype(str)
            comma_counts = col_data.str.count(',')
            if not comma_counts.empty and comma_counts.max() > 2:
                # Filter out garbage lines without commas (like bplist headers)
                valid_lines = col_data[comma_counts > 0].tolist()
                if valid_lines:
                    csv_text = "\n".join(valid_lines)
                    try:
                        expanded_df = pd.read_csv(io.StringIO(csv_text), skipinitialspace=True)
                        if len(expanded_df.columns) > 2:
                            df = expanded_df
                    except Exception:
                        pass

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
