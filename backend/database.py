# # """
# # Database Configuration and Connection Setup
# # SQLAlchemy + MySQL
# # """

# # from sqlalchemy import create_engine
# # from sqlalchemy.ext.declarative import declarative_base
# # from sqlalchemy.orm import sessionmaker
# # import os
# # from dotenv import load_dotenv

# # load_dotenv()

# # # Database URL
# # DATABASE_URL = os.getenv(
# #     "DATABASE_URL",
# #     "mysql+pymysql://root:password@localhost:3306/ladenutricare"
# # )

# # # Create engine
# # engine = create_engine(
# #     DATABASE_URL,
# #     echo=os.getenv("SQL_ECHO", "False").lower() == "true",
# #     pool_pre_ping=True,
# #     pool_recycle=3600,
# # )

# # # Session factory
# # SessionLocal = sessionmaker(
# #     autocommit=False,
# #     autoflush=False,
# #     bind=engine
# # )

# # # Base class for models
# # Base = declarative_base()

# # # Dependency to get DB session
# # def get_db():
# #     db = SessionLocal()
# #     try:
# #         yield db
# #     finally:
# #         db.close()



# """
# Database Configuration and Connection Setup
# SQLAlchemy + MySQL with improved pooling and SSL support
# """

# from sqlalchemy import create_engine, text
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker
# import os
# from dotenv import load_dotenv

# load_dotenv()

# # Database connection components – can be set individually or via full URL
# DB_USER = os.getenv("DB_USER", "root")
# DB_PASSWORD = os.getenv("DB_PASSWORD", "password")
# DB_HOST = os.getenv("DB_HOST", "localhost")
# DB_PORT = os.getenv("DB_PORT", "3306")
# DB_NAME = os.getenv("DB_NAME", "ladenutricare")
# DB_SSL_CA = os.getenv("DB_SSL_CA", None)  # Path to SSL CA certificate if needed

# # Construct DATABASE_URL if not explicitly provided
# DATABASE_URL = os.getenv(
#     "DATABASE_URL",
#     f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
# )

# # Engine configuration with connection pooling
# engine = create_engine(
#     DATABASE_URL,
#     echo=os.getenv("SQL_ECHO", "False").lower() == "true",
#     pool_size=int(os.getenv("DB_POOL_SIZE", "10")),           # Number of connections to keep in pool
#     max_overflow=int(os.getenv("DB_MAX_OVERFLOW", "20")),     # Max overflow connections
#     pool_pre_ping=True,                                       # Verify connections before using
#     pool_recycle=int(os.getenv("DB_POOL_RECYCLE", "3600")),   # Recycle connections after 1 hour
#     connect_args={
#         "ssl": {"ca": DB_SSL_CA} if DB_SSL_CA else None       # SSL if provided
#     }
# )

# # Session factory
# SessionLocal = sessionmaker(
#     autocommit=False,
#     autoflush=False,
#     bind=engine
# )

# # Base class for models
# Base = declarative_base()



# def get_db():
#     """Dependency to get DB session."""
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# def test_connection():
#     """Quick test to verify database connection."""
#     try:
#         with engine.connect() as conn:
#             conn.execute(text("SELECT 1"))
#         print("✅ Database connection successful!")
#         return True
#     except Exception as e:
#         print(f"❌ Database connection failed: {e}")
#         return False

# # Optional: run test if script executed directly
# if __name__ == "__main__":
#     test_connection()




from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "ladenutricare")

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

engine = create_engine(
    DATABASE_URL,
    echo=os.getenv("SQL_ECHO", "False").lower() == "true",
    pool_size=int(os.getenv("DB_POOL_SIZE", "10")),
    max_overflow=int(os.getenv("DB_MAX_OVERFLOW", "20")),
    pool_pre_ping=True,
    pool_recycle=int(os.getenv("DB_POOL_RECYCLE", "3600")),
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def test_connection():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False