"""
Servicio de predicción de ratings con el modelo XGBoost entrenado sobre IMDb.
Carga el modelo y los feature maps una sola vez al iniciar la app.
"""

import joblib
import numpy as np
import pandas as pd
from pathlib import Path

# --- Rutas ---
BASE_DIR          = Path(__file__).resolve().parent.parent.parent
MODEL_PATH        = BASE_DIR / "ml" / "xgb_final.joblib"
FEATURE_MAPS_PATH = BASE_DIR / "ml" / "feature_maps.joblib"

# --- Cargar modelo y feature maps una sola vez ---
model = joblib.load(MODEL_PATH)
fm    = joblib.load(FEATURE_MAPS_PATH)

# --- Umbrales para el label ---
THRESHOLDS = {"Muy buena": 6.65, "Buena": 6.5, "Regular": 5.5}

def get_label(predicted: float) -> str:
    for label, threshold in THRESHOLDS.items():
        if predicted >= threshold:
            return label
    return "Floja"

def predict(data: dict, credits: dict) -> tuple[float, str]:
    """
    Recibe el response de /movie/{id} y /movie/{id}/credits de TMDB
    y devuelve el rating predicho y su label.
    """
    # Director
    director_name   = next(
        (m["name"] for m in credits.get("crew", []) if m.get("job") == "Director"), None
    )
    director_nconst = fm["name_to_nconst"].get(director_name)

    # Writer
    writer_name   = next(
        (m["name"] for m in credits.get("crew", []) if m.get("job") in ["Screenplay", "Writer"]), None
    )
    writer_nconst = fm["name_to_nconst"].get(writer_name)

    # Actores top 3 con historial — si no matchea intenta con el siguiente del reparto
    cast_sorted = sorted(credits.get("cast", []), key=lambda x: x.get("order", 99))
    actor_names   = []
    actor_nconsts = []
    for member in cast_sorted:
        if len(actor_nconsts) == 3:
            break
        nconst = fm["name_to_nconst"].get(member["name"])
        if nconst and nconst in fm["actor_dict"]:
            actor_names.append(member["name"])
            actor_nconsts.append(nconst)

    # Si no llegamos a 3 actores con historial completamos con promedio global
    while len(actor_nconsts) < 3:
        actor_nconsts.append(None)

    # Features de director
    director_avg   = fm["director_dict"].get(director_nconst, fm["global_mean_director"])
    director_best  = fm["director_best"].get(director_nconst, fm["global_mean_director_best"])
    director_std   = fm["director_std"].get(director_nconst, fm["global_std_director"])
    director_count = fm["director_count"].get(director_nconst, fm["global_count_director"])

    # Feature de writer
    writer_avg = fm["writer_dict"].get(writer_nconst, fm["global_mean_writer"])

    # Features de actores
    actor_ratings        = [fm["actor_dict"].get(a, fm["global_mean_actor"]) for a in actor_nconsts if a is not None]
    cast_avg_rating      = np.mean(actor_ratings) if actor_ratings else fm["global_mean_actor"]
    top_actor_avg_rating = actor_ratings[0] if actor_ratings else fm["global_mean_actor"]

    # director_writer_same
    director_writer_same = 1 if director_nconst and director_nconst == writer_nconst else 0

    # Idioma y estudio
    language    = data.get("original_language", "")
    language_te = fm["language_dict"].get(language, fm["global_mean_language"])

    companies = data.get("production_companies", [])
    studio    = companies[0].get("name") if companies else None
    studio_te = fm["studio_dict"].get(studio, fm["global_mean_studio"])

    # Budget
    budget             = data.get("budget", 0) or 0
    budget_mean_log    = np.log1p(fm["budget_mean"])
    budget_log_imputed = np.log1p(budget) if budget > 0 else budget_mean_log

    # Géneros
    genre_names = [g["name"] for g in data.get("genres", [])]
    all_genres = fm["genre_columns"]
    genre_features = {g: 1 if g in genre_names else 0 for g in all_genres}

    # Año y runtime
    year    = int(data.get("release_date", "0000")[:4]) if data.get("release_date") else 0
    runtime = data.get("runtime", 0) or 0

    # Saga
    belongs = 1 if data.get("belongs_to_collection") else 0

    features = {
        "startYear":             year,
        "runtimeMinutes":        runtime,
        **genre_features,
        "director_avg_rating":   director_avg,
        "director_best_rating":  director_best,
        "director_std_rating":   director_std,
        "director_movie_count":  director_count,
        "writer_avg_rating":     writer_avg,
        "cast_avg_rating":       cast_avg_rating,
        "top_actor_avg_rating":  top_actor_avg_rating,
        "director_writer_same":  director_writer_same,
        "budget_log_imputed":    budget_log_imputed,
        "original_language_te":  language_te,
        "production_company_te": studio_te,
        "belongs_to_collection": belongs,
    }

    X         = pd.DataFrame([features])[fm["feature_columns"]]
    predicted = float(model.predict(X)[0])
    label     = get_label(predicted)

    return round(predicted, 2), label