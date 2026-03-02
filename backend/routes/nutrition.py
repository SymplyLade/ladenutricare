from fastapi import APIRouter
router = APIRouter()

@router.get("/plans")
def get_nutrition_plans():
    return {"message": "Nutrition plans endpoint"}