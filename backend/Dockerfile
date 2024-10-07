# FROM python:3.10.11-slim
FROM python:alpine

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY app app
COPY alembic alembic
COPY alembic.ini ./

ENTRYPOINT ["gunicorn", "app.main:app", " --workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000" ]
# ENTRYPOINT [ "uvicorn", "app.main:app", "--host", "localhost", "--port", "8000", "--workers", "4" ] 
