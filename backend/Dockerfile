FROM python:3.10.11-slim

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY app app
COPY alembic alembic
COPY alembic.ini ./
COPY .env .env

ENTRYPOINT ["gunicorn", "app.main:app", " --workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:5000"]