from fastapi import APIRouter
router = APIRouter()

@router.post("/check")
def check_symptoms():
    return {"message": "Symptom checker endpoint"}