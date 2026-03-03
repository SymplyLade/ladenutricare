from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from models import NutritionPlan, User
from schemas import CustomNutritionPlanCreate

router = APIRouter()


PATIENT_TYPES = [
    {
        "id": 1,
        "name": "Diabetes",
        "description": "Manage blood sugar levels with proper diet.",
        "general_advice": "Avoid sugary foods, eat whole grains, and monitor carbs.",
    },
    {
        "id": 2,
        "name": "Pregnancy",
        "description": "Nutrition for a healthy pregnancy.",
        "general_advice": "Increase folic acid, iron, and calcium. Stay hydrated.",
    },
    {
        "id": 3,
        "name": "Hypertension",
        "description": "Control blood pressure with a balanced diet.",
        "general_advice": "Reduce sodium intake and include potassium-rich foods.",
    },
    {
        "id": 4,
        "name": "Cramps",
        "description": "Ease muscle cramps with proper nutrition.",
        "general_advice": "Stay hydrated and consume magnesium-rich meals.",
    },
    {
        "id": 5,
        "name": "Obesity",
        "description": "Achieve healthy weight with balanced meal choices.",
        "general_advice": "Use portion control and prioritize whole foods.",
    },
]

MEAL_PLANS = [
    {
        "id": 101,
        "patient_type_id": 1,
        "title": "Diabetes-Friendly Meal Plan",
        "description": "Balanced meals to maintain stable blood sugar.",
        "meals": {
            "breakfast": ["Oatmeal with berries", "Scrambled eggs"],
            "lunch": ["Grilled chicken salad", "Quinoa bowl"],
            "dinner": ["Baked salmon", "Steamed vegetables"],
            "snacks": ["Apple slices", "Greek yogurt"],
        },
    },
    {
        "id": 102,
        "patient_type_id": 2,
        "title": "Prenatal Nutrition Plan",
        "description": "Nutrient-rich meals for mother and baby.",
        "meals": {
            "breakfast": ["Fortified cereal", "Milk"],
            "lunch": ["Spinach salad", "Lentil soup"],
            "dinner": ["Salmon", "Sweet potato"],
            "snacks": ["Almonds", "Yogurt"],
        },
    },
    {
        "id": 103,
        "patient_type_id": 3,
        "title": "DASH Diet Plan",
        "description": "Dietary approaches to control blood pressure.",
        "meals": {
            "breakfast": ["Banana oatmeal", "Low-fat milk"],
            "lunch": ["Turkey whole-wheat sandwich", "Mixed greens"],
            "dinner": ["Grilled fish", "Brown rice"],
            "snacks": ["Carrot sticks", "Nuts"],
        },
    },
    {
        "id": 104,
        "patient_type_id": 4,
        "title": "Muscle Health Plan",
        "description": "Foods that support hydration and muscle recovery.",
        "meals": {
            "breakfast": ["Banana smoothie", "Whole grain toast"],
            "lunch": ["Quinoa salad", "Grilled chicken"],
            "dinner": ["Salmon", "Asparagus"],
            "snacks": ["Trail mix", "Greek yogurt"],
        },
    },
    {
        "id": 105,
        "patient_type_id": 5,
        "title": "Weight Management Plan",
        "description": "Calorie-conscious meals for healthy fat loss.",
        "meals": {
            "breakfast": ["Vegetable omelette", "Green tea"],
            "lunch": ["Chicken salad", "Steamed vegetables"],
            "dinner": ["Baked fish", "Roasted greens"],
            "snacks": ["Apple slices", "Cottage cheese"],
        },
    },
]


@router.get("/patient-types")
def get_patient_types():
    return PATIENT_TYPES


@router.get("/patient-types/{patient_type_id}")
def get_patient_type(patient_type_id: int):
    patient_type = next((x for x in PATIENT_TYPES if x["id"] == patient_type_id), None)
    if not patient_type:
        raise HTTPException(status_code=404, detail="Patient type not found")
    return patient_type


@router.get("/meal-plans")
def get_meal_plans(patient_type_id: int | None = None):
    if patient_type_id is None:
        return MEAL_PLANS
    return [plan for plan in MEAL_PLANS if plan["patient_type_id"] == patient_type_id]


@router.post("/assign")
def assign_nutrition_plan(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plan_id = payload.get("plan_id")
    if not plan_id:
        raise HTTPException(status_code=400, detail="plan_id is required")

    selected = next((plan for plan in MEAL_PLANS if plan["id"] == int(plan_id)), None)
    if not selected:
        raise HTTPException(status_code=404, detail="Meal plan not found")

    (
        db.query(NutritionPlan)
        .filter(NutritionPlan.user_id == current_user.id, NutritionPlan.is_active == True)
        .update({"is_active": False})
    )

    patient_type = next(
        (x for x in PATIENT_TYPES if x["id"] == selected["patient_type_id"]), None
    )
    patient_type_name = patient_type["name"] if patient_type else "General"

    db_plan = NutritionPlan(
        user_id=current_user.id,
        title=selected["title"],
        description=selected["description"],
        plan_type=patient_type_name,
        meals=selected["meals"],
        is_active=True,
    )
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)

    return {
        "id": db_plan.id,
        "title": db_plan.title,
        "description": db_plan.description,
        "patient_type_name": db_plan.plan_type,
        "meals": db_plan.meals,
    }


@router.post("/custom-plan")
def create_custom_nutrition_plan(
    payload: CustomNutritionPlanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    (
        db.query(NutritionPlan)
        .filter(NutritionPlan.user_id == current_user.id, NutritionPlan.is_active == True)
        .update({"is_active": False})
    )

    db_plan = NutritionPlan(
        user_id=current_user.id,
        title=payload.title or "My Custom Meal Plan",
        description=payload.description or "User-defined meal plan",
        plan_type="Custom",
        meals={"custom_plan": [payload.desired_meal_plan]},
        is_active=True,
    )
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)

    return {
        "id": db_plan.id,
        "title": db_plan.title,
        "description": db_plan.description,
        "patient_type_name": db_plan.plan_type,
        "meals": db_plan.meals or {},
    }


@router.get("/my-plan")
def get_my_nutrition_plan(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plan = (
        db.query(NutritionPlan)
        .filter(NutritionPlan.user_id == current_user.id, NutritionPlan.is_active == True)
        .order_by(NutritionPlan.id.desc())
        .first()
    )
    if not plan:
        raise HTTPException(status_code=404, detail="No nutrition plan assigned")

    return {
        "id": plan.id,
        "title": plan.title,
        "description": plan.description,
        "patient_type_name": plan.plan_type,
        "meals": plan.meals or {},
    }
