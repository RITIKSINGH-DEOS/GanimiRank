import sqlite3
import json
import time
import os
from typing import Optional, Dict, Any

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "ganimirank.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes local SQLite caching table."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS keyword_cache (
            cache_key TEXT PRIMARY KEY,
            keyword TEXT NOT NULL,
            country TEXT NOT NULL,
            local_geo TEXT,
            data_json TEXT NOT NULL,
            timestamp INTEGER NOT NULL
        )
    """)
    conn.commit()
    conn.close()

def make_cache_key(keyword: str, country: str, local_geo: Optional[str]) -> str:
    geo_str = (local_geo or "").strip().lower()
    return f"{keyword.strip().lower()}:{country.strip().lower()}:{geo_str}"

def get_cached_analysis(keyword: str, country: str, local_geo: Optional[str], ttl_seconds: int = 172800) -> Optional[Dict[str, Any]]:
    """Retrieve cached analysis if younger than TTL (default 48 hours)."""
    init_db()
    key = make_cache_key(keyword, country, local_geo)
    now = int(time.time())
    
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT data_json, timestamp FROM keyword_cache WHERE cache_key = ?", (key,))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        if now - row["timestamp"] < ttl_seconds:
            try:
                return json.loads(row["data_json"])
            except Exception:
                return None
    return None

def save_cached_analysis(keyword: str, country: str, local_geo: Optional[str], data: Dict[str, Any]):
    """Stores keyword analysis in local SQLite cache."""
    init_db()
    key = make_cache_key(keyword, country, local_geo)
    now = int(time.time())
    data_str = json.dumps(data)
    
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT OR REPLACE INTO keyword_cache (cache_key, keyword, country, local_geo, data_json, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (key, keyword.strip().lower(), country.strip().lower(), (local_geo or "").strip().lower(), data_str, now))
    conn.commit()
    conn.close()
