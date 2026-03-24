# Frontend - FilmR

Frontend de la aplicacion filmR.
Construido con React + Vite y estilado con Tailwind.

## 1. Requisitos

- Node.js 18+
- npm 9+

## 2. Variables de entorno

Crear un archivo `.env` dentro de `frontend/` con:

```env
VITE_API_URL=http://localhost:8000
```

Para produccion, reemplazar por la URL publica del backend:

```env
VITE_API_URL=https://tu-backend.com
```

## 3. Instalar dependencias

Desde la carpeta `frontend/`:

```bash
npm install
```

## 4. Correr en desarrollo

```bash
npm run dev
```

Por defecto abre en `http://localhost:5173`.

Build de produccion:

```bash
npm run build
```

Preview local del build:

```bash
npm run preview
```

## 5. Estructura del proyecto

```text
frontend/
	src/
		components/   # componentes reutilizables (Navbar, HeroBanner, MovieRow, etc.)
		pages/        # vistas principales (Home, Search, Discover, MovieDetail)
		services/     # llamadas HTTP al backend
		hooks/        # hooks custom
		mocks/        # datos mock para pruebas visuales
	public/
	index.html
```
