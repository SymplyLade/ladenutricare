import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()


def _resolve_database_url() -> str:
    explicit_url = os.getenv("DATABASE_URL") or os.getenv("DATABASE_PUBLIC_URL")
    if explicit_url:
        if explicit_url.startswith("mysql://"):
            return explicit_url.replace("mysql://", "mysql+pymysql://", 1)
        return explicit_url

    db_user = os.getenv("DB_USER") or os.getenv("MYSQLUSER") or "root"
    db_password = os.getenv("DB_PASSWORD") or os.getenv("MYSQLPASSWORD") or "password"
    db_host = os.getenv("DB_HOST") or os.getenv("MYSQLHOST") or "localhost"
    db_port = os.getenv("DB_PORT") or os.getenv("MYSQLPORT") or "3306"
    db_name = os.getenv("DB_NAME") or os.getenv("MYSQLDATABASE") or "ladenutricare"

    if os.getenv("RENDER") and db_host in {"localhost", "127.0.0.1"}:
        raise RuntimeError(
            "Database is not configured for Render. Set DATABASE_URL (or DB_HOST/DB_USER/DB_PASSWORD/DB_NAME) to your remote MySQL instance."
        )

    return f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"


DATABASE_URL = _resolve_database_url()

engine_kwargs = {
    "echo": os.getenv("SQL_ECHO", "False").lower() == "true",
    "pool_size": int(os.getenv("DB_POOL_SIZE", "10")),
    "max_overflow": int(os.getenv("DB_MAX_OVERFLOW", "20")),
    "pool_pre_ping": True,
    "pool_recycle": int(os.getenv("DB_POOL_RECYCLE", "3600")),
}

ssl_ca = os.getenv("DB_SSL_CA")
if ssl_ca:
    engine_kwargs["connect_args"] = {"ssl": {"ca": ssl_ca}}

engine = create_engine(DATABASE_URL, **engine_kwargs)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_connection() -> bool:
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False
