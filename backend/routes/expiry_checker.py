from fastapi import APIRouter
router = APIRouter()

@router.post("/check")
def check_expiry():
    return {"message": "Expiry checker endpoint"}