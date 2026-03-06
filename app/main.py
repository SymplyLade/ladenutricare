"""
Compatibility ASGI entrypoint.

Allows Render start commands like:
    uvicorn app.main:app
to resolve to the real FastAPI app in backend/main.py.
"""

from backend.main import app

