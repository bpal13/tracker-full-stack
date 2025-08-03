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
    prefix="/misc-items",
    tags=["Gauges", "Miscellaneous"]
)


# New item route
@router.post("/new-item", response_model=schemas.GaugeOut, status_code=status.HTTP_201_CREATED)
def create_item(new_item: schemas.GaugeCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    
    # Check for existing records
    item_conflict = db.query(models.MiscItems).filter(models.MiscItems.tool_id == new_item.tool_id).one_or_none()
    
    if item_conflict:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Item ID already exist")    
    elif item_conflict == None:
        item = models.MiscItems(issued_by = current_user.id, **new_item.model_dump())
        db.add(item)
        db.commit()
        return item
    else:
      raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="There was an error pocessing your request.")


# Update an item
@router.put("/modify/{id}", response_model=schemas.GaugeOut)
def update_gauge(id: str, new_data: schemas.GaugeUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    
    # Check if item exist
    query = db.query(models.MiscItems).filter(models.MiscItems.tool_id == id)
    item_to_update = query.one_or_none()    

    # Check for existing 'tool_id' in database
    conflict_check = db.query(models.MiscItems).filter(models.MiscItems.tool_id == new_data.tool_id).one_or_none()

    if item_to_update == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item does not exist.")
    
    elif conflict_check and conflict_check.id != item_to_update.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="New ID is already taken.")
    
    elif item_to_update:
        user = db.query(models.Users).filter(models.Users.id == current_user.id).first()
        # Update item properties
        query.update(new_data.model_dump(), 
                    synchronize_session=False)
        db.commit()
        return query.first()
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="There was an error pocessing your request.")
 

# Fetch all items
@router.get("/", response_model=List[schemas.GaugeOut])
def get_item(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    try:
        all_items = db.query(models.MiscItems).all()
    except Exception:
      raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="There was an error pocessing your request.")
    else:
        return all_items


# Delete an item
@router.delete("/delete-item/{id}")
def delete_gauge(id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):

    # Check for existing records
    item = db.query(models.MiscItems).filter(models.MiscItems.tool_id == id).one_or_none()
    
    if item:
        try:
            db.delete(item)
        except Exception:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="There was an error pocessing your request.")
        else:
            db.commit()
            return Response(status_code=status.HTTP_204_NO_CONTENT)
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item does not exist")
