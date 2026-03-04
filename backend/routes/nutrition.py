from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from models import NutritionPlan, User
from schemas import AutoNutritionPlanCreate, CustomNutritionPlanCreate
from script import DAYS, WEEKS, condition_from_id, generate_plan_bundle, normalize_condition_title

router = APIRouter()


def _deactivate_previous_plans(db: Session, user_id: int) -> None:
    (
        db.query(NutritionPlan)
        .filter(NutritionPlan.user_id == user_id, NutritionPlan.is_active == True)
        .update({"is_active": False})
    )


def _legacy_condition_name(patient_type_id: int) -> str:
    return condition_from_id(patient_type_id)


def _resolve_country(value: str | None, fallback: str | None = None) -> str:
    primary = str(value or "").strip()
    if primary:
        return primary
    backup = str(fallback or "").strip()
    if backup:
        return backup
    return "Nigeria"


def _is_monthly_plan(meals: dict | None) -> bool:
    if not isinstance(meals, dict):
        return False
    week_keys = {w.lower() for w in WEEKS}
    return any(k.lower() in week_keys for k in meals.keys())


def _to_monthly_plan(meals: dict | None) -> dict:
    if _is_monthly_plan(meals):
        return meals or {}

    notes = []
    if isinstance(meals, dict):
        if isinstance(meals.get("notes"), list):
            notes = meals["notes"]
        elif isinstance(meals.get("custom_plan"), list):
            notes = meals["custom_plan"]
    if not notes:
        notes = ["Converted to monthly plan format."]

    day_template = {
        "breakfast": ["Breakfast option 1", "Breakfast option 2"],
        "lunch": ["Lunch option 1", "Lunch option 2"],
        "dinner": ["Dinner option 1", "Dinner option 2"],
        "snack": ["Snack option 1", "Snack option 2"],
    }
    if isinstance(meals, dict):
        for slot in ["breakfast", "lunch", "dinner"]:
            if isinstance(meals.get(slot), list) and meals[slot]:
                day_template[slot] = meals[slot]
        if isinstance(meals.get("snack"), list) and meals["snack"]:
            day_template["snack"] = meals["snack"]
        elif isinstance(meals.get("snacks"), list) and meals["snacks"]:
            day_template["snack"] = meals["snacks"]

    monthly = {}
    for week in WEEKS:
        monthly[week] = {}
        for day in DAYS:
            monthly[week][day] = dict(day_template)
    monthly["notes"] = notes
    return monthly


def _extract_country_from_notes(meals: dict | None) -> str | None:
    if not isinstance(meals, dict):
        return None
    notes = meals.get("notes")
    if not isinstance(notes, list):
        return None
    for note in notes:
        text = str(note).strip()
        if text.lower().startswith("localized for:"):
            country = text.split(":", 1)[1].strip().rstrip(".")
            return country or None
    return None


def _lacks_monthly_variety(meals: dict | None) -> bool:
    if not isinstance(meals, dict):
        return True
    signatures = []
    for week in WEEKS:
        week_data = meals.get(week)
        if isinstance(week_data, dict):
            for day in DAYS:
                day_data = week_data.get(day)
                if isinstance(day_data, dict):
                    signatures.append(str(day_data))
    if len(signatures) < 2:
        return True
    return len(set(signatures)) == 1


def _has_repeated_meal_lines(meals: dict | None) -> bool:
    if not isinstance(meals, dict):
        return True
    seen = set()
    repeated = False
    for week in WEEKS:
        week_data = meals.get(week)
        if not isinstance(week_data, dict):
            continue
        for day in DAYS:
            day_data = week_data.get(day)
            if not isinstance(day_data, dict):
                continue
            for slot in ["breakfast", "lunch", "dinner", "snack"]:
                items = day_data.get(slot)
                if slot == "snack" and not isinstance(items, list):
                    items = day_data.get("snacks")
                if not isinstance(items, list):
                    continue
                for item in items:
                    key = str(item).strip().lower()
                    if key in seen:
                        repeated = True
                        break
                    seen.add(key)
                if repeated:
                    break
            if repeated:
                break
        if repeated:
            break
    return repeated


def _replace_local_terms(value, country: str):
    country_text = str(country or "").strip().lower()
    is_nigerian = "nigeria" in country_text

    def _transform_text(text: str) -> str:
        if is_nigerian:
            return text.replace("brown rice", "ofada rice").replace("Brown Rice", "Ofada Rice")
        return (
            text.replace("Ofada Rice", "Brown Rice (Ofada Rice)")
            .replace("ofada rice", "brown rice (ofada rice)")
        )

    if isinstance(value, str):
        return _transform_text(value)
    if isinstance(value, list):
        return [_replace_local_terms(v, country) for v in value]
    if isinstance(value, dict):
        return {k: _replace_local_terms(v, country) for k, v in value.items()}
    return value


@router.get("/patient-types")
def get_patient_types():
    return [
        {"id": 1, "name": "Diabetes", "description": "Generated dynamically from script.py", "general_advice": "Use the generator for a tailored monthly plan."},
        {"id": 2, "name": "Pregnancy", "description": "Generated dynamically from script.py", "general_advice": "Use the generator for a tailored monthly plan."},
        {"id": 3, "name": "Hypertension", "description": "Generated dynamically from script.py", "general_advice": "Use the generator for a tailored monthly plan."},
        {"id": 4, "name": "Cramps", "description": "Generated dynamically from script.py", "general_advice": "Use the generator for a tailored monthly plan."},
        {"id": 5, "name": "Weight Management", "description": "Generated dynamically from script.py", "general_advice": "Use the generator for a tailored monthly plan."},
    ]


@router.get("/patient-types/{patient_type_id}")
def get_patient_type(patient_type_id: int):
    name = _legacy_condition_name(patient_type_id)
    return {
        "id": patient_type_id,
        "name": name,
        "description": f"Dynamic monthly meal plan can be generated for {name}.",
        "general_advice": "This condition uses monthly dynamic meal generation.",
    }


@router.get("/meal-plans")
def get_meal_plans(patient_type_id: int | None = None, country: str | None = None):
    if patient_type_id is None:
        return []
    condition = _legacy_condition_name(patient_type_id)
    generated = generate_plan_bundle(condition, _resolve_country(country))["meals"]
    return [
        {
            "id": patient_type_id * 1000 + 1,
            "patient_type_id": patient_type_id,
            "title": f"{condition} Monthly Meal Plan",
            "description": f"Dynamically generated monthly plan for {condition}.",
            "meals": generated,
        }
    ]


@router.post("/assign")
def assign_nutrition_plan(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    title = normalize_condition_title(payload.get("title"))
    if (not payload.get("title")) and payload.get("plan_id") is not None:
        try:
            plan_id = int(payload.get("plan_id"))
        except (TypeError, ValueError):
            plan_id = None
        if plan_id:
            title = _legacy_condition_name(max(1, plan_id // 1000))
    if not title:
        raise HTTPException(status_code=400, detail="title is required")

    _deactivate_previous_plans(db, current_user.id)
    country = _resolve_country(payload.get("country"), getattr(current_user, "address", None))
    bundle = generate_plan_bundle(title, country)
    db_plan = NutritionPlan(
        user_id=current_user.id,
        title=bundle["title"],
        description=bundle["description"],
        plan_type=bundle["plan_type"],
        meals=bundle["meals"],
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


@router.post("/custom-plan")
def create_custom_nutrition_plan(
    payload: CustomNutritionPlanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _deactivate_previous_plans(db, current_user.id)

    monthly_custom = {}
    for week in WEEKS:
        monthly_custom[week] = {}
        for day in DAYS:
            monthly_custom[week][day] = {
                "breakfast": [f"{week.title()} {day.title()} breakfast"],
                "lunch": [f"{week.title()} {day.title()} lunch"],
                "dinner": [f"{week.title()} {day.title()} dinner"],
                "snack": [f"{week.title()} {day.title()} snack"],
            }
    monthly_custom["notes"] = [payload.desired_meal_plan]

    db_plan = NutritionPlan(
        user_id=current_user.id,
        title=payload.title or "My Custom Monthly Meal Plan",
        description=payload.description or "User-defined monthly meal plan",
        plan_type="Custom",
        meals=monthly_custom,
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


@router.post("/generate-from-title")
@router.post("/generate_from_title")
@router.post("/generate")
def generate_nutrition_plan_from_title(
    payload: AutoNutritionPlanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    title = normalize_condition_title(payload.title)
    if not title:
        raise HTTPException(status_code=400, detail="title is required")

    _deactivate_previous_plans(db, current_user.id)
    country = _resolve_country(payload.country, getattr(current_user, "address", None))
    bundle = generate_plan_bundle(title, country, payload.description)
    db_plan = NutritionPlan(
        user_id=current_user.id,
        title=bundle["title"],
        description=bundle["description"],
        plan_type=bundle["plan_type"],
        meals=bundle["meals"],
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

    monthly_meals = _to_monthly_plan(plan.meals)
    plan_country = _resolve_country(
        _extract_country_from_notes(monthly_meals),
        getattr(current_user, "address", None),
    )
    should_refresh_generated = (
        str(plan.plan_type).lower() == "generated"
        and (
            _lacks_monthly_variety(monthly_meals)
            or _has_repeated_meal_lines(monthly_meals)
        )
    )
    if should_refresh_generated:
        base_title = str(plan.title or "Wellness").replace(" Monthly Meal Plan", "").replace(" Meal Plan", "").strip()
        regenerated = generate_plan_bundle(base_title, plan_country, plan.description)
        plan.meals = regenerated["meals"]
        monthly_meals = plan.meals or {}
        db.commit()
        db.refresh(plan)
    elif monthly_meals != (plan.meals or {}):
        plan.meals = monthly_meals
        db.commit()
        db.refresh(plan)

    localized_monthly = _replace_local_terms(monthly_meals, plan_country)
    if localized_monthly != monthly_meals:
        plan.meals = localized_monthly
        monthly_meals = localized_monthly
        db.commit()
        db.refresh(plan)

    return {
        "id": plan.id,
        "title": plan.title,
        "description": plan.description,
        "patient_type_name": plan.plan_type,
        "meals": monthly_meals,
    }


@router.delete("/my-plan")
def delete_my_nutrition_plan(
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
        raise HTTPException(status_code=404, detail="No active nutrition plan to delete")

    db.delete(plan)
    db.commit()
    return {"message": "Nutrition plan deleted successfully"}
