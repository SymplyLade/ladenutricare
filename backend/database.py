import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import logging

load_dotenv()
logger = logging.getLogger(__name__)


def _env_value(*keys: str) -> str | None:
    """
    Read env vars and ignore placeholder values like "DB_HOST" or "MYSQLHOST".
    This helps when Render env vars were copied as template strings.
    """
    for key in keys:
        raw = os.getenv(key)
        if raw is None:
            continue
        value = raw.strip()
        if not value:
            continue
        if value.upper() == key.upper():
            continue
        return value
    return None


def _looks_like_placeholder_database_url(url: str) -> bool:
    upper_url = url.upper()
    placeholder_tokens = (
        "DB_USER",
        "DB_PASSWORD",
        "DB_HOST",
        "DB_PORT",
        "DB_NAME",
        "<USER>",
        "<PASSWORD>",
        "<HOST>",
        "<PORT>",
        "<DBNAME>",
    )
    return any(token in upper_url for token in placeholder_tokens)


def _resolve_database_url() -> str:
    explicit_url = _env_value("DATABASE_URL", "DATABASE_PUBLIC_URL")
    if explicit_url:
        if _looks_like_placeholder_database_url(explicit_url):
            explicit_url = None
        else:
            if explicit_url.startswith("postgres://"):
                return explicit_url.replace("postgres://", "postgresql+psycopg://", 1)
            if explicit_url.startswith("postgresql://"):
                return explicit_url.replace("postgresql://", "postgresql+psycopg://", 1)
            if explicit_url.startswith("mysql://"):
                return explicit_url.replace("mysql://", "mysql+pymysql://", 1)
            return explicit_url

    # Keep a fresh local checkout usable without requiring a developer to
    # install and configure MySQL. Production deployments should provide a
    # database URL or the DB_* / MYSQL* variables below.
    has_database_config = any(
        _env_value(key) is not None
        for key in ("DB_USER", "DB_PASSWORD", "DB_HOST", "DB_PORT", "DB_NAME",
                    "MYSQLUSER", "MYSQLPASSWORD", "MYSQLHOST", "MYSQLPORT", "MYSQLDATABASE")
    )
    if not has_database_config and not os.getenv("RENDER"):
        return "sqlite:///./ladenutricare.db"

    db_user = _env_value("DB_USER", "MYSQLUSER") or "root"
    db_password = _env_value("DB_PASSWORD", "MYSQLPASSWORD") or "password"
    db_host = _env_value("DB_HOST", "MYSQLHOST") or "localhost"
    db_port = _env_value("DB_PORT", "MYSQLPORT") or "3306"
    db_name = _env_value("DB_NAME", "MYSQLDATABASE") or "ladenutricare"

    if os.getenv("RENDER") and db_host in {"localhost", "127.0.0.1"}:
        logger.warning(
            "Render is using localhost DB_HOST. Set DATABASE_URL (recommended) or remote DB_HOST/DB_USER/DB_PASSWORD/DB_NAME."
        )

    return f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"


DATABASE_URL = _resolve_database_url()

engine_kwargs = {
    "echo": os.getenv("SQL_ECHO", "False").lower() == "true",
    "pool_pre_ping": True,
    "pool_recycle": int(os.getenv("DB_POOL_RECYCLE", "3600")),
}
if not DATABASE_URL.startswith("sqlite:"):
    engine_kwargs["pool_size"] = int(os.getenv("DB_POOL_SIZE", "10"))
    engine_kwargs["max_overflow"] = int(os.getenv("DB_MAX_OVERFLOW", "20"))

ssl_ca = os.getenv("DB_SSL_CA")
if ssl_ca:
    if DATABASE_URL.startswith("postgresql+psycopg://"):
        engine_kwargs["connect_args"] = {"sslrootcert": ssl_ca}
    else:
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


def ensure_appointment_workflow_schema() -> None:
    """Add columns and enum values required by the appointment workflow."""
    appointment_columns = {column["name"] for column in inspect(engine).get_columns("appointments")}
    with engine.begin() as conn:
        if "consultation_format" not in appointment_columns:
            conn.execute(text(
                "ALTER TABLE appointments ADD COLUMN consultation_format "
                "VARCHAR(32) NOT NULL DEFAULT 'google_meet'"
            ))
        if engine.dialect.name == "mysql":
            conn.execute(text(
                "ALTER TABLE appointments MODIFY COLUMN status "
                "ENUM('PENDING','DOCTOR_CONFIRMED','APPROVED','REJECTED','COMPLETED','CANCELLED') "
                "DEFAULT 'PENDING'"
            ))
