import hashlib
import random

WEEKS = ["week_1", "week_2", "week_3", "week_4"]
DAYS = ["day_1", "day_2", "day_3", "day_4", "day_5", "day_6", "day_7"]


def normalize_condition_title(value: str) -> str:
    text = str(value or "").strip()
    return text if text else "General Wellness"


def normalize_country(value: str) -> str:
    text = str(value or "").strip()
    return text if text else "Nigeria"


def condition_from_id(patient_type_id: int) -> str:
    names = {
        1: "Diabetes",
        2: "Pregnancy",
        3: "Hypertension",
        4: "Cramps",
        5: "Weight Management",
    }
    return names.get(int(patient_type_id), f"Condition {patient_type_id}")


def _seeded_rng(text: str, country: str) -> random.Random:
    source = f"{normalize_condition_title(text).lower()}::{normalize_country(country).lower()}"
    digest = hashlib.sha256(source.encode("utf-8")).hexdigest()
    return random.Random(int(digest[:16], 16))


def _condition_tokens(text: str) -> list[str]:
    cleaned = "".join(ch if ch.isalnum() or ch.isspace() else " " for ch in text.lower())
    parts = [p.strip() for p in cleaned.split() if len(p.strip()) > 2]
    return parts or ["wellness"]


def _focus_phrase(tokens: list[str], rng: random.Random) -> str:
    selected = tokens[:]
    rng.shuffle(selected)
    if len(selected) == 1:
        return selected[0]
    return f"{selected[0]} and {selected[1]}"


def _is_diabetes_condition(tokens: list[str], title: str) -> bool:
    t = str(title).lower()
    token_set = {x.lower() for x in tokens}
    return (
        "diabetes" in t
        or "diabetic" in t
        or "diabetes" in token_set
        or "diabetic" in token_set
        or ("blood" in token_set and "sugar" in token_set)
    )


def _location_key(country: str) -> str:
    c = normalize_country(country).lower()
    if "nigeria" in c:
        return "nigeria"
    if "ghana" in c:
        return "ghana"
    if "kenya" in c:
        return "kenya"
    if "south africa" in c or "south-africa" in c:
        return "south_africa"
    if "united kingdom" in c or c in {"uk", "u.k."} or "england" in c or "britain" in c:
        return "united_kingdom"
    if "united states" in c or c in {"us", "u.s.", "usa"} or "america" in c:
        return "united_states"
    if "canada" in c:
        return "canada"
    if "india" in c:
        return "india"
    return "global"


NIGERIAN_BREAKFAST = [
    "Akamu and Moi Moi", "Boiled Yam and Egg Sauce", "Akara and Pap", "Oats and Banana", "Wheat Bread and Avocado",
    "Sweet Potato and Egg", "Custard and Groundnut", "Boiled Corn and Pear", "Millet Pap and Akara", "Plantain and Egg",
]
NIGERIAN_LUNCH = [
    "Ofada Rice and Ayamase", "Beans Porridge and Ugu", "Jollof Rice and Grilled Fish", "Boiled Plantain and Vegetable Sauce",
    "Yam Porridge", "White Rice and Stew", "Moi Moi and Salad", "Asaro and Turkey", "Amala and Ewedu", "Eba and Okra Soup",
]
NIGERIAN_DINNER = [
    "Unripe Plantain Porridge", "Boiled Sweet Potato and Fish Stew", "Acha and Light Soup", "Boiled Plantain and Fish Pepper Soup",
    "Vegetable Soup with Fish", "Grilled Fish and Steamed Vegetables", "Moi Moi and Garden Egg", "Yam and Vegetable Sauce (light)",
]
NIGERIAN_SNACKS = ["Pawpaw Slices", "Orange", "Watermelon", "Garden Egg", "Roasted Groundnut", "Coconut Pieces", "Cucumber", "Tiger Nut"]
NIGERIAN_DRINKS = ["Water", "Unsweetened Zobo", "Unsweetened Kunu", "Lemon Water", "Ginger Water"]

DIABETES_BREAKFAST = [
    "Oats and Chia Seeds", "Akamu (Unsweetened) and Moi Moi", "Millet Pap (Unsweetened) and Boiled Egg",
    "Wheat Bread and Avocado", "Unripe Plantain Porridge", "Beans and Boiled Egg",
]
DIABETES_LUNCH = [
    "Beans Porridge and Ugu", "Ofada Rice (Small Portion) and Vegetable Stew", "Unripe Plantain and Vegetable Sauce",
    "Moi Moi and Cabbage Salad", "Okra Soup and Fish", "Efo Riro and Grilled Fish",
]
DIABETES_DINNER = [
    "Vegetable Soup and Fish", "Garden Egg Sauce and Grilled Fish", "Unripe Plantain Porridge (Light)",
    "Ugu Soup and Chicken", "Boiled Sweet Potato and Vegetable Sauce", "Okra and Turkey (Light)",
]
DIABETES_SNACKS = ["Cucumber", "Carrot Sticks", "Garden Egg", "Roasted Groundnut (Small Handful)", "Apple", "Pawpaw Slices"]

GHANAIAN_BREAKFAST = ["Hausa Koko and Koose", "Tom Brown Porridge", "Bread and Avocado", "Oats and Banana"]
GHANAIAN_LUNCH = ["Waakye and Fish", "Banku and Tilapia", "Jollof Rice and Chicken", "Boiled Yam and Kontomire"]
GHANAIAN_DINNER = ["Light Soup and Fish", "Plantain and Beans Stew", "Garden Egg Stew", "Palava Sauce and Rice"]
GHANAIAN_SNACKS = ["Pineapple", "Orange", "Groundnut", "Coconut Pieces"]
GHANAIAN_DRINKS = ["Water", "Unsweetened Sobolo", "Lemon Water"]

KENYAN_BREAKFAST = ["Uji and Boiled Egg", "Sweet Potato and Tea", "Oats and Fruit", "Wheat Bread and Avocado"]
KENYAN_LUNCH = ["Githeri and Sukuma Wiki", "Ugali and Fish", "Brown Rice and Beans", "Chapati and Lentils"]
KENYAN_DINNER = ["Tilapia and Vegetables", "Matoke and Beans", "Vegetable Stew and Sweet Potato", "Chicken Soup and Greens"]
KENYAN_SNACKS = ["Mango", "Banana", "Groundnuts", "Cucumber"]
KENYAN_DRINKS = ["Water", "Herbal Tea", "Lemon Water"]

GLOBAL_BREAKFAST = ["Oatmeal and Fruit", "Whole Wheat Toast and Egg", "Greek Yogurt and Nuts", "Smoothie Bowl"]
GLOBAL_LUNCH = ["Grilled Chicken and Brown Rice", "Quinoa Salad and Fish", "Turkey Wrap and Vegetables", "Lentil Bowl"]
GLOBAL_DINNER = ["Baked Fish and Vegetables", "Vegetable Soup and Protein", "Sweet Potato and Chicken", "Beans and Greens"]
GLOBAL_SNACKS = ["Apple", "Orange", "Nuts", "Carrot Sticks"]
GLOBAL_DRINKS = ["Water", "Herbal Tea", "Infused Water"]

SOUTH_AFRICAN_BREAKFAST = ["Maize Porridge and Milk", "Muesli and Yogurt", "Brown Toast and Avocado", "Egg and Tomato Relish"]
SOUTH_AFRICAN_LUNCH = ["Pap and Chakalaka", "Samp and Beans", "Brown Rice and Stew", "Grilled Fish and Spinach"]
SOUTH_AFRICAN_DINNER = ["Grilled Chicken and Vegetables", "Lentil Curry and Rice", "Vegetable Stew and Pap", "Light Soup and Fish"]
SOUTH_AFRICAN_SNACKS = ["Orange", "Apple", "Nuts", "Cucumber"]
SOUTH_AFRICAN_DRINKS = ["Water", "Rooibos Tea", "Lemon Water"]

UK_BREAKFAST = ["Porridge and Fruit", "Whole Wheat Toast and Egg", "Beans and Toast", "Yogurt and Oats"]
UK_LUNCH = ["Baked Potato and Tuna", "Chicken Salad Wrap", "Lentil Soup and Bread", "Brown Rice and Veg Curry"]
UK_DINNER = ["Baked Salmon and Veg", "Chicken Stew and Potatoes", "Vegetable Pasta", "Turkey and Greens"]
UK_SNACKS = ["Apple", "Pear", "Nuts", "Carrot Sticks"]
UK_DRINKS = ["Water", "Herbal Tea", "Unsweetened Tea"]

US_BREAKFAST = ["Oatmeal and Berries", "Whole Grain Toast and Avocado", "Greek Yogurt and Nuts", "Egg and Sweet Potato"]
US_LUNCH = ["Grilled Chicken Bowl", "Turkey Sandwich and Salad", "Salmon and Brown Rice", "Bean Chili and Veg"]
US_DINNER = ["Baked Fish and Vegetables", "Roast Chicken and Veg", "Lentil Stew", "Lean Beef and Greens"]
US_SNACKS = ["Apple", "Banana", "Mixed Nuts", "Carrot Sticks"]
US_DRINKS = ["Water", "Unsweetened Iced Tea", "Sparkling Water"]

CANADA_BREAKFAST = ["Oatmeal and Fruit", "Egg and Whole Wheat Toast", "Yogurt and Granola", "Porridge and Nuts"]
CANADA_LUNCH = ["Grilled Salmon and Quinoa", "Chicken and Barley Soup", "Turkey Sandwich", "Lentil Bowl"]
CANADA_DINNER = ["Baked Cod and Vegetables", "Chicken Stir Fry", "Bean Stew and Brown Rice", "Turkey and Sweet Potato"]
CANADA_SNACKS = ["Apple", "Blueberries", "Nuts", "Cucumber"]
CANADA_DRINKS = ["Water", "Herbal Tea", "Lemon Water"]

INDIA_BREAKFAST = ["Idli and Sambar", "Upma and Yogurt", "Poha and Groundnut", "Dalia and Milk"]
INDIA_LUNCH = ["Brown Rice and Dal", "Roti and Mixed Vegetable Curry", "Khichdi and Curd", "Chana Masala and Roti"]
INDIA_DINNER = ["Vegetable Soup and Paneer", "Roti and Spinach Dal", "Grilled Fish and Veg Curry", "Light Chicken Curry and Millet"]
INDIA_SNACKS = ["Roasted Chana", "Guava", "Papaya", "Cucumber"]
INDIA_DRINKS = ["Water", "Buttermilk", "Herbal Tea"]

BREAKFAST_SIDES_BY_LOCATION = {
    "nigeria": ["Boiled Egg", "Avocado", "Banana", "Groundnut", "Cucumber", "Apple", "Pawpaw", "Orange"],
    "ghana": ["Boiled Egg", "Avocado", "Banana", "Groundnut", "Orange", "Pineapple"],
    "kenya": ["Boiled Egg", "Avocado", "Banana", "Mango", "Groundnuts", "Orange"],
    "south_africa": ["Boiled Egg", "Avocado", "Banana", "Yogurt", "Apple", "Orange"],
    "united_kingdom": ["Boiled Egg", "Avocado", "Apple", "Pear", "Banana", "Nuts"],
    "united_states": ["Boiled Egg", "Avocado", "Berries", "Banana", "Apple", "Nuts"],
    "canada": ["Boiled Egg", "Avocado", "Blueberries", "Apple", "Banana", "Nuts"],
    "india": ["Boiled Egg", "Banana", "Papaya", "Guava", "Groundnut", "Curd"],
    "global": ["Boiled Egg", "Avocado", "Banana", "Apple", "Orange", "Nuts"],
}
LUNCH_SIDES_BY_LOCATION = {
    "nigeria": ["Ugu", "Carrot", "Cabbage", "Tomato", "Beans", "Plantain", "Garden Egg", "Okra"],
    "ghana": ["Kontomire", "Tomato", "Beans", "Plantain", "Garden Egg", "Okra"],
    "kenya": ["Sukuma Wiki", "Tomato", "Beans", "Spinach", "Carrot", "Avocado"],
    "south_africa": ["Spinach", "Carrot", "Cabbage", "Beans", "Tomato", "Peas"],
    "united_kingdom": ["Peas", "Broccoli", "Carrot", "Beans", "Tomato", "Spinach"],
    "united_states": ["Broccoli", "Kale", "Beans", "Tomato", "Carrot", "Avocado"],
    "canada": ["Broccoli", "Beans", "Carrot", "Spinach", "Tomato", "Peas"],
    "india": ["Spinach", "Okra", "Beans", "Tomato", "Carrot", "Cucumber"],
    "global": ["Carrot", "Cabbage", "Tomato", "Beans", "Spinach", "Cucumber"],
}
DINNER_SIDES_BY_LOCATION = {
    "nigeria": ["Fish", "Turkey", "Chicken", "Ugu", "Okra", "Garden Egg", "Spinach", "Mushroom"],
    "ghana": ["Fish", "Chicken", "Kontomire", "Okra", "Garden Egg", "Spinach"],
    "kenya": ["Fish", "Chicken", "Sukuma Wiki", "Spinach", "Beans", "Mushroom"],
    "south_africa": ["Fish", "Chicken", "Spinach", "Beans", "Mushroom", "Peas"],
    "united_kingdom": ["Fish", "Chicken", "Turkey", "Broccoli", "Spinach", "Peas"],
    "united_states": ["Fish", "Chicken", "Turkey", "Kale", "Broccoli", "Beans"],
    "canada": ["Fish", "Chicken", "Turkey", "Broccoli", "Spinach", "Peas"],
    "india": ["Fish", "Chicken", "Paneer", "Spinach", "Okra", "Beans"],
    "global": ["Fish", "Chicken", "Turkey", "Spinach", "Beans", "Mushroom"],
}
SNACK_EXTRAS_BY_LOCATION = {
    "nigeria": ["Groundnut", "Coconut", "Cucumber", "Orange", "Apple", "Dates", "Banana", "Tiger Nut"],
    "ghana": ["Groundnut", "Coconut", "Orange", "Pineapple", "Banana", "Apple"],
    "kenya": ["Groundnuts", "Cucumber", "Mango", "Banana", "Apple", "Dates"],
    "south_africa": ["Nuts", "Cucumber", "Orange", "Apple", "Pear", "Banana"],
    "united_kingdom": ["Nuts", "Apple", "Pear", "Banana", "Berries", "Carrot"],
    "united_states": ["Nuts", "Apple", "Banana", "Berries", "Carrot", "Celery"],
    "canada": ["Nuts", "Apple", "Blueberries", "Banana", "Carrot", "Cucumber"],
    "india": ["Roasted Chana", "Groundnut", "Cucumber", "Guava", "Papaya", "Dates"],
    "global": ["Nuts", "Cucumber", "Orange", "Apple", "Banana", "Dates"],
}
DRINK_EXTRAS_BY_LOCATION = {
    "nigeria": ["without sugar", "cold", "warm", "with ginger", "plain", "light"],
    "ghana": ["without sugar", "cold", "warm", "plain", "light"],
    "kenya": ["without sugar", "warm", "plain", "light"],
    "south_africa": ["without sugar", "warm", "plain", "light"],
    "united_kingdom": ["without sugar", "warm", "plain", "light"],
    "united_states": ["without sugar", "cold", "plain", "light"],
    "canada": ["without sugar", "warm", "plain", "light"],
    "india": ["without sugar", "warm", "plain", "light"],
    "global": ["without sugar", "cold", "warm", "plain", "light"],
}


def _base_pools_for_location(location_key: str) -> dict:
    if location_key == "nigeria":
        return {
            "breakfast": NIGERIAN_BREAKFAST,
            "lunch": NIGERIAN_LUNCH,
            "dinner": NIGERIAN_DINNER,
            "snack": NIGERIAN_SNACKS,
            "drinks": NIGERIAN_DRINKS,
            "breakfast_sides": BREAKFAST_SIDES_BY_LOCATION["nigeria"],
            "lunch_sides": LUNCH_SIDES_BY_LOCATION["nigeria"],
            "dinner_sides": DINNER_SIDES_BY_LOCATION["nigeria"],
            "snack_extras": SNACK_EXTRAS_BY_LOCATION["nigeria"],
            "drink_extras": DRINK_EXTRAS_BY_LOCATION["nigeria"],
        }
    if location_key == "ghana":
        return {
            "breakfast": GHANAIAN_BREAKFAST,
            "lunch": GHANAIAN_LUNCH,
            "dinner": GHANAIAN_DINNER,
            "snack": GHANAIAN_SNACKS,
            "drinks": GHANAIAN_DRINKS,
            "breakfast_sides": BREAKFAST_SIDES_BY_LOCATION["ghana"],
            "lunch_sides": LUNCH_SIDES_BY_LOCATION["ghana"],
            "dinner_sides": DINNER_SIDES_BY_LOCATION["ghana"],
            "snack_extras": SNACK_EXTRAS_BY_LOCATION["ghana"],
            "drink_extras": DRINK_EXTRAS_BY_LOCATION["ghana"],
        }
    if location_key == "kenya":
        return {
            "breakfast": KENYAN_BREAKFAST,
            "lunch": KENYAN_LUNCH,
            "dinner": KENYAN_DINNER,
            "snack": KENYAN_SNACKS,
            "drinks": KENYAN_DRINKS,
            "breakfast_sides": BREAKFAST_SIDES_BY_LOCATION["kenya"],
            "lunch_sides": LUNCH_SIDES_BY_LOCATION["kenya"],
            "dinner_sides": DINNER_SIDES_BY_LOCATION["kenya"],
            "snack_extras": SNACK_EXTRAS_BY_LOCATION["kenya"],
            "drink_extras": DRINK_EXTRAS_BY_LOCATION["kenya"],
        }
    if location_key == "south_africa":
        return {
            "breakfast": SOUTH_AFRICAN_BREAKFAST,
            "lunch": SOUTH_AFRICAN_LUNCH,
            "dinner": SOUTH_AFRICAN_DINNER,
            "snack": SOUTH_AFRICAN_SNACKS,
            "drinks": SOUTH_AFRICAN_DRINKS,
            "breakfast_sides": BREAKFAST_SIDES_BY_LOCATION["south_africa"],
            "lunch_sides": LUNCH_SIDES_BY_LOCATION["south_africa"],
            "dinner_sides": DINNER_SIDES_BY_LOCATION["south_africa"],
            "snack_extras": SNACK_EXTRAS_BY_LOCATION["south_africa"],
            "drink_extras": DRINK_EXTRAS_BY_LOCATION["south_africa"],
        }
    if location_key == "united_kingdom":
        return {
            "breakfast": UK_BREAKFAST,
            "lunch": UK_LUNCH,
            "dinner": UK_DINNER,
            "snack": UK_SNACKS,
            "drinks": UK_DRINKS,
            "breakfast_sides": BREAKFAST_SIDES_BY_LOCATION["united_kingdom"],
            "lunch_sides": LUNCH_SIDES_BY_LOCATION["united_kingdom"],
            "dinner_sides": DINNER_SIDES_BY_LOCATION["united_kingdom"],
            "snack_extras": SNACK_EXTRAS_BY_LOCATION["united_kingdom"],
            "drink_extras": DRINK_EXTRAS_BY_LOCATION["united_kingdom"],
        }
    if location_key == "united_states":
        return {
            "breakfast": US_BREAKFAST,
            "lunch": US_LUNCH,
            "dinner": US_DINNER,
            "snack": US_SNACKS,
            "drinks": US_DRINKS,
            "breakfast_sides": BREAKFAST_SIDES_BY_LOCATION["united_states"],
            "lunch_sides": LUNCH_SIDES_BY_LOCATION["united_states"],
            "dinner_sides": DINNER_SIDES_BY_LOCATION["united_states"],
            "snack_extras": SNACK_EXTRAS_BY_LOCATION["united_states"],
            "drink_extras": DRINK_EXTRAS_BY_LOCATION["united_states"],
        }
    if location_key == "canada":
        return {
            "breakfast": CANADA_BREAKFAST,
            "lunch": CANADA_LUNCH,
            "dinner": CANADA_DINNER,
            "snack": CANADA_SNACKS,
            "drinks": CANADA_DRINKS,
            "breakfast_sides": BREAKFAST_SIDES_BY_LOCATION["canada"],
            "lunch_sides": LUNCH_SIDES_BY_LOCATION["canada"],
            "dinner_sides": DINNER_SIDES_BY_LOCATION["canada"],
            "snack_extras": SNACK_EXTRAS_BY_LOCATION["canada"],
            "drink_extras": DRINK_EXTRAS_BY_LOCATION["canada"],
        }
    if location_key == "india":
        return {
            "breakfast": INDIA_BREAKFAST,
            "lunch": INDIA_LUNCH,
            "dinner": INDIA_DINNER,
            "snack": INDIA_SNACKS,
            "drinks": INDIA_DRINKS,
            "breakfast_sides": BREAKFAST_SIDES_BY_LOCATION["india"],
            "lunch_sides": LUNCH_SIDES_BY_LOCATION["india"],
            "dinner_sides": DINNER_SIDES_BY_LOCATION["india"],
            "snack_extras": SNACK_EXTRAS_BY_LOCATION["india"],
            "drink_extras": DRINK_EXTRAS_BY_LOCATION["india"],
        }
    return {
        "breakfast": GLOBAL_BREAKFAST,
        "lunch": GLOBAL_LUNCH,
        "dinner": GLOBAL_DINNER,
        "snack": GLOBAL_SNACKS,
        "drinks": GLOBAL_DRINKS,
        "breakfast_sides": BREAKFAST_SIDES_BY_LOCATION["global"],
        "lunch_sides": LUNCH_SIDES_BY_LOCATION["global"],
        "dinner_sides": DINNER_SIDES_BY_LOCATION["global"],
        "snack_extras": SNACK_EXTRAS_BY_LOCATION["global"],
        "drink_extras": DRINK_EXTRAS_BY_LOCATION["global"],
    }


def _build_combo_pool(main_items: list[str], side_items: list[str], sep: str = " with ") -> list[str]:
    pool = []
    for main in main_items:
        for side in side_items:
            pool.append(f"{main}{sep}{side}")
    return pool


def _build_drink_pool(drinks: list[str], extras: list[str]) -> list[str]:
    return [f"{drink} ({extra})" for drink in drinks for extra in extras]


def _take_unique(pool: list[str], pointer: int, count: int) -> tuple[list[str], int]:
    taken = []
    idx = pointer
    while len(taken) < count:
        if idx >= len(pool):
            idx = 0
        candidate = pool[idx]
        idx += 1
        if candidate in taken:
            continue
        taken.append(candidate)
    return taken, idx


def _day_menu(breakfast_pool: list[str], lunch_pool: list[str], dinner_pool: list[str], snack_pool: list[str], drink_pool: list[str], cursor: dict) -> dict:
    breakfast_items, cursor["breakfast"] = _take_unique(breakfast_pool, cursor["breakfast"], 2)
    lunch_items, cursor["lunch"] = _take_unique(lunch_pool, cursor["lunch"], 2)
    snack_items, cursor["snacks"] = _take_unique(snack_pool, cursor["snacks"], 2)
    dinner_items, cursor["dinner"] = _take_unique(dinner_pool, cursor["dinner"], 2)
    drink_item, cursor["drinks"] = _take_unique(drink_pool, cursor["drinks"], 1)

    return {
        "breakfast": [breakfast_items[0], breakfast_items[1], drink_item[0]],
        "lunch": [lunch_items[0], lunch_items[1]],
        "snack": [snack_items[0], snack_items[1]],
        "dinner": [dinner_items[0], dinner_items[1]],
    }


def generate_meals(condition_title: str, country: str) -> dict:
    rng = _seeded_rng(condition_title, country)
    tokens = _condition_tokens(condition_title)
    focus = _focus_phrase(tokens, rng)
    is_diabetes = _is_diabetes_condition(tokens, condition_title)

    country_text = normalize_country(country)
    location_key = _location_key(country_text)
    pools = _base_pools_for_location(location_key)

    if is_diabetes and location_key == "nigeria":
        breakfast_source = DIABETES_BREAKFAST
        lunch_source = DIABETES_LUNCH
        dinner_source = DIABETES_DINNER
        snack_source = DIABETES_SNACKS
    else:
        breakfast_source = pools["breakfast"]
        lunch_source = pools["lunch"]
        dinner_source = pools["dinner"]
        snack_source = pools["snack"]

    breakfast_pool = _build_combo_pool(breakfast_source, pools["breakfast_sides"])
    lunch_pool = _build_combo_pool(lunch_source, pools["lunch_sides"])
    dinner_pool = _build_combo_pool(dinner_source, pools["dinner_sides"])
    snack_pool = _build_combo_pool(snack_source, pools["snack_extras"], sep=" with ")
    drink_pool = _build_drink_pool(pools["drinks"], pools["drink_extras"])

    rng.shuffle(breakfast_pool)
    rng.shuffle(lunch_pool)
    rng.shuffle(dinner_pool)
    rng.shuffle(snack_pool)
    rng.shuffle(drink_pool)

    cursor = {"breakfast": 0, "lunch": 0, "dinner": 0, "snacks": 0, "drinks": 0}

    monthly = {}
    for week in WEEKS:
        monthly[week] = {}
        for day in DAYS:
            monthly[week][day] = _day_menu(
                breakfast_pool,
                lunch_pool,
                dinner_pool,
                snack_pool,
                drink_pool,
                cursor,
            )

    monthly["notes"] = [
        f"Generated from condition focus: {focus}.",
        f"Localized for: {country_text}.",
        "This is a monthly meal plan (4 weeks, 7 days each).",
        "Meal order: breakfast, lunch, snack, dinner.",
        "For diabetes, high-fiber and vegetable-rich meals are prioritized.",
    ]
    return monthly


def generate_plan_bundle(condition_title: str, country: str, description: str | None = None) -> dict:
    title = normalize_condition_title(condition_title)
    country_text = normalize_country(country)
    return {
        "title": f"{title.title()} Monthly Meal Plan",
        "description": description or f"Dynamically generated monthly meal plan for {title} in {country_text}.",
        "plan_type": "Generated",
        "meals": generate_meals(title, country_text),
    }


SYMPTOM_RULES = [
    {
        "illness": "Possible cancer-related condition",
        "department": "Oncology",
        "doctor_type": "Oncologist",
        "urgency": "high",
        "keywords": ["cancer", "tumor", "tumour", "lump", "unexplained weight loss", "bloody discharge"],
    },
    {
        "illness": "Possible cardiac condition",
        "department": "Cardiology",
        "doctor_type": "Cardiologist",
        "urgency": "high",
        "keywords": ["chest pain", "palpitation", "heart racing", "heart pain", "fainting"],
    },
    {
        "illness": "Possible stroke or severe neurologic event",
        "department": "Emergency Medicine",
        "doctor_type": "Emergency Physician / Neurologist",
        "urgency": "high",
        "keywords": ["one-sided weakness", "slurred speech", "face droop", "seizure", "convulsion"],
    },
    {
        "illness": "Possible respiratory condition",
        "department": "Pulmonology",
        "doctor_type": "Pulmonologist",
        "urgency": "medium",
        "keywords": ["cough", "wheezing", "shortness of breath", "breathing difficulty", "asthma"],
    },
    {
        "illness": "Possible ENT condition",
        "department": "ENT",
        "doctor_type": "ENT Specialist",
        "urgency": "low",
        "keywords": ["sore throat", "ear pain", "sinus", "runny nose", "blocked nose"],
    },
    {
        "illness": "Possible dermatologic condition",
        "department": "Dermatology",
        "doctor_type": "Dermatologist",
        "urgency": "low",
        "keywords": ["rash", "itching", "eczema", "skin swelling", "acne"],
    },
    {
        "illness": "Possible neurologic condition",
        "department": "Neurology",
        "doctor_type": "Neurologist",
        "urgency": "medium",
        "keywords": ["headache", "migraine", "dizziness", "numbness", "tingling"],
    },
    {
        "illness": "Possible gastrointestinal condition",
        "department": "Gastroenterology",
        "doctor_type": "Gastroenterologist",
        "urgency": "medium",
        "keywords": ["stomach pain", "abdominal pain", "diarrhea", "vomiting", "constipation", "ulcer"],
    },
    {
        "illness": "Possible endocrine/metabolic condition",
        "department": "Endocrinology",
        "doctor_type": "Endocrinologist",
        "urgency": "medium",
        "keywords": ["high blood sugar", "low blood sugar", "excessive thirst", "frequent urination", "thyroid"],
    },
    {
        "illness": "Possible urinary tract condition",
        "department": "Urology",
        "doctor_type": "Urologist",
        "urgency": "medium",
        "keywords": ["painful urination", "urine pain", "blood in urine", "flank pain", "urinary urgency"],
    },
    {
        "illness": "Possible reproductive health condition",
        "department": "Gynecology",
        "doctor_type": "Gynecologist",
        "urgency": "medium",
        "keywords": ["pelvic pain", "period pain", "menstrual cramps", "vaginal discharge", "irregular period"],
    },
    {
        "illness": "Possible musculoskeletal condition",
        "department": "Orthopedics",
        "doctor_type": "Orthopedic Specialist",
        "urgency": "low",
        "keywords": ["joint pain", "back pain", "knee pain", "bone pain", "sprain"],
    },
    {
        "illness": "Possible eye condition",
        "department": "Ophthalmology",
        "doctor_type": "Ophthalmologist",
        "urgency": "low",
        "keywords": ["eye pain", "blurred vision", "red eye", "vision loss", "eye discharge"],
    },
    {
        "illness": "Possible blood disorder",
        "department": "Hematology",
        "doctor_type": "Hematologist",
        "urgency": "medium",
        "keywords": ["easy bruising", "unusual bleeding", "severe fatigue", "pale skin"],
    },
    {
        "illness": "Possible mental health condition",
        "department": "Psychiatry",
        "doctor_type": "Psychiatrist",
        "urgency": "medium",
        "keywords": ["anxiety", "panic attack", "depression", "insomnia", "mood swings"],
    },
]


def _advice_by_urgency(urgency: str) -> str:
    if urgency == "high":
        return "This may be urgent. Seek immediate medical care or visit emergency now."
    if urgency == "medium":
        return "Book an appointment as soon as possible for proper evaluation."
    return "Book a routine appointment if symptoms persist or worsen."


def analyze_symptoms_bundle(symptoms: str, duration: str) -> dict:
    text = str(symptoms or "").strip()
    normalized = text.lower()
    selected = None
    selected_matches = []
    best_score = 0
    for rule in SYMPTOM_RULES:
        matches = [k for k in rule["keywords"] if k in normalized]
        score = len(matches)
        if score > best_score:
            best_score = score
            selected = rule
            selected_matches = matches

    if selected is None:
        if any(k in normalized for k in ["fever", "cold", "flu", "body pain", "weakness"]):
            selected = {
                "illness": "Possible infection or general illness",
                "department": "General Medicine",
                "doctor_type": "General Physician",
                "urgency": "medium",
            }
            selected_matches = ["fever/cold/flu pattern"]
        else:
            selected = {
                "illness": "Unspecified illness pattern",
                "department": "General Medicine",
                "doctor_type": "General Physician",
                "urgency": "low",
            }
            selected_matches = ["no strong rule match"]

    if selected["urgency"] == "high":
        confidence = "high"
    elif best_score >= 2:
        confidence = "high"
    elif best_score == 1:
        confidence = "medium"
    else:
        confidence = "low"

    emergency_signals = {
        "chest pain",
        "shortness of breath",
        "fainting",
        "seizure",
        "convulsion",
        "one-sided weakness",
        "slurred speech",
        "face droop",
        "cancer",
        "tumor",
        "tumour",
    }
    emergency_flag = selected["urgency"] == "high" or any(k in normalized for k in emergency_signals)

    analysis = (
        f"Based on reported symptoms ({text}) over {duration}, "
        f"the likely illness group is {selected['illness']}, and the recommended department is {selected['department']}."
    )

    next_steps = []
    if emergency_flag:
        next_steps.append("Seek emergency care immediately.")
        next_steps.append("Do not delay if symptoms are worsening.")
    elif selected["urgency"] == "medium":
        next_steps.append("Book a specialist appointment within 24-48 hours.")
    else:
        next_steps.append("Book a routine appointment if symptoms persist.")
    next_steps.append(f"Preferred doctor type: {selected['doctor_type']}.")

    return {
        "illness_group": selected["illness"],
        "recommended_department": selected["department"],
        "doctor_type": selected["doctor_type"],
        "urgency_level": selected["urgency"],
        "confidence": confidence,
        "matched_keywords": selected_matches[:5],
        "emergency_flag": emergency_flag,
        "next_steps": next_steps,
        "analysis": analysis,
        "advice": _advice_by_urgency(selected["urgency"]),
    }


MEDICATION_INTERACTIONS = [
    {
        "pair": ("warfarin", "ibuprofen"),
        "severity": "high",
        "message": "Warfarin with ibuprofen may increase bleeding risk.",
    },
    {
        "pair": ("warfarin", "aspirin"),
        "severity": "high",
        "message": "Warfarin with aspirin may significantly increase bleeding risk.",
    },
    {
        "pair": ("sildenafil", "nitroglycerin"),
        "severity": "high",
        "message": "Sildenafil with nitroglycerin may cause dangerous blood pressure drop.",
    },
    {
        "pair": ("metformin", "alcohol"),
        "severity": "medium",
        "message": "Metformin with frequent alcohol use may raise lactic acidosis risk.",
    },
    {
        "pair": ("lisinopril", "spironolactone"),
        "severity": "medium",
        "message": "Combination may raise potassium levels; monitor closely.",
    },
    {
        "pair": ("ibuprofen", "prednisone"),
        "severity": "medium",
        "message": "Ibuprofen with prednisone may increase gastrointestinal irritation.",
    },
]

CONDITION_CONTRAINDICATIONS = [
    {
        "condition_tokens": ["asthma"],
        "med_tokens": ["propranolol"],
        "severity": "high",
        "message": "Propranolol may worsen asthma symptoms in some patients.",
    },
    {
        "condition_tokens": ["ulcer", "stomach pain", "gastritis"],
        "med_tokens": ["ibuprofen", "diclofenac", "naproxen"],
        "severity": "high",
        "message": "NSAIDs may worsen ulcer or gastritis symptoms.",
    },
    {
        "condition_tokens": ["kidney", "renal"],
        "med_tokens": ["ibuprofen", "diclofenac", "naproxen"],
        "severity": "medium",
        "message": "NSAIDs may worsen kidney function; use caution.",
    },
]


def _severity_rank(level: str) -> int:
    order = {"low": 1, "medium": 2, "high": 3}
    return order.get(str(level).lower(), 1)


def analyze_medication_safety(
    medication_name: str,
    existing_medications: list[str] | None = None,
    condition_text: str | None = None,
) -> dict:
    med = str(medication_name or "").strip().lower()
    existing = [str(x or "").strip().lower() for x in (existing_medications or []) if str(x or "").strip()]
    condition = str(condition_text or "").strip().lower()

    warnings = []
    max_severity = "low"
    matched_rules = []

    if med in existing:
        warnings.append(f"{medication_name} appears to be duplicated in your medication list.")
        max_severity = "medium"
        matched_rules.append("duplicate_medication")

    all_meds = [med] + existing
    for rule in MEDICATION_INTERACTIONS:
        a, b = rule["pair"]
        if a in all_meds and b in all_meds:
            warnings.append(rule["message"])
            matched_rules.append(f"interaction:{a}+{b}")
            if _severity_rank(rule["severity"]) > _severity_rank(max_severity):
                max_severity = rule["severity"]

    for rule in CONDITION_CONTRAINDICATIONS:
        cond_hit = any(token in condition for token in rule["condition_tokens"])
        med_hit = any(token == med for token in rule["med_tokens"])
        if cond_hit and med_hit:
            warnings.append(rule["message"])
            matched_rules.append(f"condition_contra:{med}")
            if _severity_rank(rule["severity"]) > _severity_rank(max_severity):
                max_severity = rule["severity"]

    unique_warnings = list(dict.fromkeys(warnings))
    confidence = "high" if len(matched_rules) >= 2 else ("medium" if len(matched_rules) == 1 else "low")
    requires_human_review = max_severity == "high" or (max_severity == "medium" and len(unique_warnings) >= 2)

    return {
        "medication": medication_name,
        "severity": max_severity,
        "warnings": unique_warnings,
        "confidence": confidence,
        "matched_rules": matched_rules,
        "requires_human_review": requires_human_review,
        "safe_to_proceed": len(unique_warnings) == 0,
    }
