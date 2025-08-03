from fastapi.middleware.cors import CORSMiddleware
from .routers import admin, auth, tools, schedule, gauges
from .logger.logger_setup import logger_setup
from .db.database import engine
from fastapi import FastAPI
from .db import models
import logging

# Logger
# logger_setup()
# logger = logging.getLogger("trackerLogger")
# logger.info("Logger setup complete.")

# create tables on startup
models.Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:5173",
    "http://localhost:5000",
    "http://172.16.0.229:5000"]


app = FastAPI(
    title="Tool Tracker API",
    description="""
        An API to keep track of the measurement tools used by the employees in the company.
        You can keep track of the tool's location, details and the calibrations associated with said tools.

        Created by: Bence Pal

        Updated:2024.10.07.
        """,
    summary="MEO Tool Tracker API",
    version="0.6",
    debug=True,
    docs_url="/docs",
)


app.include_router(admin.router)
app.include_router(auth.router)
app.include_router(tools.router)
app.include_router(schedule.router)
app.include_router(gauges.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

@app.get('/')
def root():
    return {'message': 'tool tracker API 1.0'}


