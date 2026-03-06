"""
Compatibility ASGI entrypoint for deployments using:
    uvicorn app.main:app
with backend as the working directory.
"""

from main import app

