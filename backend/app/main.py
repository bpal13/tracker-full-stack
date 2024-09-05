from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import models
from .db.database import engine
from .routers import admin, auth, tools
from .logs.logger import logger

# create tables on startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Tool Tracker API",
    description="""
        An API to keep track of the measurement tools used by the employees in the company.
        You can keep track of the tool's location, details and the calibrations associated with said tools.

        Created by: Bence Pal

        Updated:2024.09.05.
        """,
    summary="MEO Tool Tracker API",
    version="0.5",
    debug=False,
    contact={
        "name": "Pál Bence",
        "email": "email@example.com",
    },
    docs_url="/docs",
    on_startup=logger.info("API Startup."),
    on_shutdown=logger.info("API Shutdown.")
)

origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://localhost:5173/",
    "http://192.168.0.171:8050",
    "http://docker2:8050",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(admin.router)
app.include_router(auth.router)
app.include_router(tools.router)


@app.get('/')
def root():
    return {'message': 'tool tracker API'}
