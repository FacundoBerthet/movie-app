# Backend - filmR

Backend API de filmR hecho con FastAPI.
Se encarga de consultar TMDB y exponer endpoints para el frontend.

## 1. Requisitos

- Python 3.11+
- pip

Opcional:
- entorno virtual (`venv`)

## 2. Variables de entorno

Crear un archivo `.env` dentro de `backend/` con:

```env
TMDB_API_KEY=tu_api_key_de_tmdb
TMDB_BASE_URL=https://api.themoviedb.org/3
BACKEND_CORS_ORIGINS=http://localhost:5173,http://localhost:4173
```

Si frontend/back estan deployados, usar los dominios reales en `BACKEND_CORS_ORIGINS`.

## 3. Instalar dependencias

Desde la carpeta `backend/`:

```bash
pip install -r requirements.txt
```

## 4. Correr en desarrollo

Desde la carpeta `backend/`:

```bash
uvicorn app.main:app --reload
```

La API queda disponible en:
- `http://localhost:8000`
- docs Swagger: `http://localhost:8000/docs`

## 5. Estructura del proyecto

```text
backend/
  app/
    main.py          # inicializacion FastAPI + CORS + routers
    config.py        # settings y cliente HTTP para TMDB
    routers/         # endpoints (movies, genres)
    services/        # logica de negocio y mapeo de respuestas TMDB
    models/          # modelos Pydantic de respuesta
    errors/          # excepciones de dominio
```

## Errores comunes

- `401` desde TMDB: API key invalida o faltante.
- Error CORS: revisar `BACKEND_CORS_ORIGINS`.
- Timeout de TMDB: reintentar o verificar conectividad.
