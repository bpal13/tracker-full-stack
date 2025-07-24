from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from ..oauth2 import get_current_user, CheckRoles
from dateutil.relativedelta import relativedelta
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from typing import Optional, List
from ..db.database import get_db
from ..utils import get_stats
from ..db import models
from .. import schemas
import logging


router = APIRouter(
    prefix="/misc",
    tags=["Misc", "Gauges"]
)


@router.get("/", response_model=List[schemas.ToolOut])
def get_item(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    pass


@router.post("/crate-gauge")
def create_item():
    pass