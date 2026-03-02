from fastapi import APIRouter
router = APIRouter()

@router.post("/create-payment")
def create_payment():
    return {"message": "Payments endpoint"}