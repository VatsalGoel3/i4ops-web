# ——— backend stage ———
FROM python:3.11-slim AS backend
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ backend/
CMD ["python", "-m", "gunicorn", "app:create_app()", "--bind=0.0.0.0:8000"]

# ——— frontend stage ———
FROM node:20-slim AS build-frontend
WORKDIR /front
COPY frontend/ .
RUN npm ci && npm run build

# ——— final ———
FROM nginx:1.25-alpine
COPY --from=build-frontend /front/dist /usr/share/nginx/html
COPY --from=backend /app /app
EXPOSE 80
CMD ["sh", "-c", "python /app/app.py & nginx -g 'daemon off;'"]