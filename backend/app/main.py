from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request, Response
from .logger.logger_setup import logger_setup
from .routers import admin, auth, tools, schedule
from .db.database import engine
from .db import models
import logging

# Logger
logger_setup()
logger = logging.getLogger("trackerLogger")
logger.info("Logger setup complete.")

# create tables on startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Tool Tracker API",
    description="""
        An API to keep track of the measurement tools used by the employees in the company.
        You can keep track of the tool's location, details and the calibrations associated with said tools.

        Created by: Bence Pal

        Updated:2024.09.25.
        """,
    summary="MEO Tool Tracker API",
    version="0.6",
    debug=False,
    docs_url="/docs",
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://192.168.0.171:8050",
    "http://192.168.0.213:8050"
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(admin.router)
app.include_router(auth.router)
app.include_router(tools.router)
app.include_router(schedule.router)

@app.get('/')
def root(request: Request):
    return {'message': 'tool tracker API'}


