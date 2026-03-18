"""
DatabaseManager — SQLite wrapper for ingesting and querying uploaded datasets.
Stores the database file at backend/database/queryai.db
"""

import os
import sqlite3
import re
import pandas as pd

DB_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(DB_DIR, "queryai.db")


def _sanitize_table_name(name: str) -> str:
    """Convert a filename into a safe SQLite table name."""
    # Remove extension
    name = os.path.splitext(name)[0]
    # Replace non-alphanumeric chars with underscores
    name = re.sub(r"[^a-zA-Z0-9]", "_", name)
    # Remove leading digits
    name = re.sub(r"^[0-9]+", "", name)
    # Collapse multiple underscores
    name = re.sub(r"_+", "_", name).strip("_")
    # Fallback
    if not name:
        name = "uploaded_data"
    return name.lower()


class DatabaseManager:
    """Manages SQLite storage for uploaded datasets."""

    def __init__(self, db_path: str = DB_PATH):
        self.db_path = db_path
        self._ensure_db()

    def _ensure_db(self):
        """Create the database file if it doesn't exist."""
        conn = sqlite3.connect(self.db_path)
        conn.close()

    def _get_conn(self) -> sqlite3.Connection:
        return sqlite3.connect(self.db_path)

    def ingest_dataframe(self, df: pd.DataFrame, original_filename: str) -> dict:
        """
        Ingest a pandas DataFrame into SQLite.
        Returns metadata about the created table.
        """
        table_name = _sanitize_table_name(original_filename)

        # Clean column names — replace spaces/special chars with underscores
        df.columns = [
            re.sub(r"[^a-zA-Z0-9_]", "_", str(col)).strip("_").lower()
            for col in df.columns
        ]

        conn = self._get_conn()
        try:
            # Replace table if it already exists
            df.to_sql(table_name, conn, if_exists="replace", index=False)

            # Get column info
            cursor = conn.execute(f"PRAGMA table_info('{table_name}')")
            columns = [
                {"name": row[1], "type": row[2]} for row in cursor.fetchall()
            ]

            return {
                "table_name": table_name,
                "row_count": len(df),
                "column_count": len(columns),
                "columns": columns,
            }
        finally:
            conn.close()

    def list_datasets(self) -> list[dict]:
        """List all ingested datasets with row counts and column info."""
        conn = self._get_conn()
        try:
            cursor = conn.execute(
                "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
            )
            tables = [row[0] for row in cursor.fetchall()]

            datasets = []
            for table in tables:
                # Row count
                count_cursor = conn.execute(f"SELECT COUNT(*) FROM '{table}'")
                row_count = count_cursor.fetchone()[0]

                # Column info
                info_cursor = conn.execute(f"PRAGMA table_info('{table}')")
                columns = [
                    {"name": row[1], "type": row[2]}
                    for row in info_cursor.fetchall()
                ]

                # Sample rows
                sample_cursor = conn.execute(f"SELECT * FROM '{table}' LIMIT 3")
                sample_rows = [
                    dict(zip([col["name"] for col in columns], row))
                    for row in sample_cursor.fetchall()
                ]

                datasets.append({
                    "table_name": table,
                    "row_count": row_count,
                    "column_count": len(columns),
                    "columns": columns,
                    "sample_rows": sample_rows,
                })

            return datasets
        finally:
            conn.close()

    def get_table_info(self, table_name: str) -> dict | None:
        """Get detailed info for a specific table."""
        conn = self._get_conn()
        try:
            # Check if table exists
            cursor = conn.execute(
                "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
                (table_name,),
            )
            if not cursor.fetchone():
                return None

            # Row count
            count_cursor = conn.execute(f"SELECT COUNT(*) FROM '{table_name}'")
            row_count = count_cursor.fetchone()[0]

            # Column info
            info_cursor = conn.execute(f"PRAGMA table_info('{table_name}')")
            columns = [
                {"name": row[1], "type": row[2]}
                for row in info_cursor.fetchall()
            ]

            # Sample rows (first 5)
            sample_cursor = conn.execute(f"SELECT * FROM '{table_name}' LIMIT 5")
            sample_rows = [
                dict(zip([col["name"] for col in columns], row))
                for row in sample_cursor.fetchall()
            ]

            return {
                "table_name": table_name,
                "row_count": row_count,
                "column_count": len(columns),
                "columns": columns,
                "sample_rows": sample_rows,
            }
        finally:
            conn.close()

    def execute_query(self, sql_query: str) -> dict:
        """Execute a SQL query against the SQLite database and return results."""
        conn = self._get_conn()
        try:
            # We use pandas to execute and fetch results easily
            df = pd.read_sql_query(sql_query, conn)
            
            # Convert to list of dicts for JSON serialization
            # Replace NaNs with None for valid JSON
            df = df.where(pd.notnull(df), None)
            results = df.to_dict(orient="records")
            
            return {
                "success": True,
                "columns": list(df.columns),
                "row_count": len(df),
                "results": results,
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
            }
        finally:
            conn.close()


# Singleton instance
db_manager = DatabaseManager()
