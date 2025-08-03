from fastapi import APIRouter, Depends, HTTPException, status, Response, Request # type: ignore
from ..oauth2 import get_current_user, CheckRoles
from dateutil.relativedelta import relativedelta # type: ignore
from datetime import datetime, timezone
from sqlalchemy.orm import Session # type: ignore
from typing import Optional, List
from ..db.database import get_db
from ..utils import get_stats
from ..db import models
from .. import schemas
from ..functions import tool_methods


# logger = logging.getLogger("trackerLogger")
router = APIRouter(
    prefix="/tools",
    tags=["Tools"]
)


# Get tool statistics
@router.get("/stats")
def get_statistics(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    try:
        tools = db.query(models.Tools).all()
        stats = get_stats(tools)
        return {"loc_data": stats[0], "status_data": stats[1]}
    
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="There was an error pocessing your request.")


# Return the tools from the database
@router.get("/", response_model=List[schemas.ToolOut])
def get_tools(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    
    try:
        all_tools = db.query(models.Tools).all()
               
        return all_tools
    
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="There was an error pocessing your request.")



@router.get("/search", response_model=List[schemas.ToolOut])
def search_tools(db: Session = Depends(get_db), current_user = Depends(get_current_user), search_keyword: Optional[str] = ""):

    tools = db.query(models.Tools).filter(models.Tools.tool_id.contains(search_keyword)).all()

    return tools


# Return a tool
# Requires 'tool_id' now
@router.get("/{id}", response_model=schemas.ToolOut)
def get_tool(id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    
    tool = db.query(models.Tools).filter(models.Tools.tool_id == id).one_or_none()

    if tool is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tool does not exist")          
    elif tool:
        return tool
    
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="There was an error pocessing your request.")
       

# Add a new tool to the database
@router.post("/new-tool", response_model=schemas.ToolOut, status_code=status.HTTP_201_CREATED)
def create_tool(tool: schemas.ToolCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    
    # Check for existing records
    check_tool_id = db.query(models.Tools).filter(models.Tools.tool_id == tool.tool_id).one_or_none()
    check_tool_serial = db.query(models.Tools).filter(models.Tools.tool_serial == tool.tool_serial).one_or_none()
    
    if check_tool_id:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Tool ID already exist")        
    elif check_tool_serial:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Tool Serial already exist")    
    elif check_tool_id is None and check_tool_serial is None:
        # Add tool to DB
        new_tool = models.Tools(issued_by = current_user.id, **tool.model_dump())
        db.add(new_tool)
        db.commit()
        return new_tool
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="There was an error pocessing your request.")


# Update the tools properties
# Requires 'tool_id' now
@router.put("/update/{id}", response_model=schemas.ToolOut)
def update_tool(id: str, updated_tool: schemas.ToolUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):

    # Check if tool exist
    db_query = db.query(models.Tools).filter(models.Tools.tool_id == id)
    tool_to_update = db_query.one_or_none()

    # Check for existing tool_id in database
    conflict_check = db.query(models.Tools).filter(models.Tools.tool_id == updated_tool.tool_id).one_or_none()

    if tool_to_update == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tool does not exist.")
    
    elif conflict_check and conflict_check.id != tool_to_update.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="New ID is already taken.")
    
    elif tool_to_update:
        user = db.query(models.Users).filter(models.Users.id == current_user.id).first()
        # Update tool properties
        db_query.update(updated_tool.model_dump(), 
                        synchronize_session=False)
        db.commit()
        return db_query.first()
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="There was an error pocessing your request.")


# Add a calibration
# Requires 'tool_id' now
@router.post("/calibrate/{id}", response_model=schemas.CalibOut, status_code=status.HTTP_201_CREATED)
def calibrate_tool(id: str, new_calibration: schemas.CalibCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):

    # Check if tool exists
    tool = db.query(models.Tools).filter(models.Tools.tool_id == id).one_or_none()
    cal_conflict = db.query(models.Calibrations).filter(models.Calibrations.calibration_id == new_calibration.calibration_id).one_or_none()

    if tool == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tool does not exist")
    # Check if calibration exists
    elif cal_conflict:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Calibration ID already exist")

    elif tool:
        # Add new calibration
        today = datetime.now(timezone.utc)
        user = db.query(models.Users).filter(models.Users.id == current_user.id).first()

        calibration = models.Calibrations(parent_id = tool.id,
                                        calibration_by = user.fullname,
                                        calibration_date = today,
                                        next_calibration = today + relativedelta(years=+1) ,
                                        **new_calibration.model_dump())
        db.add(calibration)
        db.commit()

        # Update tool status
        today = datetime.now()

        if calibration.next_calibration > today:
            tool.status = "Kalibrált"
            tool.valid_until = calibration.next_calibration
            db.commit()

        if calibration.next_calibration < today:
            tool.status = "Lejárt kalibrálás"
            tool.valid_until = calibration.next_calibration
            db.commit()

        if calibration.rating == "Selejt":
            tool.status = "Selejt"
            tool.valid_until = calibration.next_calibration
            db.commit()

        return calibration
    
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="There was an error pocessing your request.")



# Return Calibration details
# needs calibration_id
@router.get("/calibration/{id}", response_model=schemas.CalibOut)
def calibration_details(id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):

    # Check if calibration exist
    calib = db.query(models.Calibrations).filter(models.Calibrations.calibration_id == id).one_or_none()

    if calib == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Calibration does not exist")
    elif calib:
        return calib
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="There was an error pocessing your request.")


# Return all calibrations
# requires tool_id
@router.get("/calibrations/{id}", response_model=List[schemas.CalibOut])
def get_calibrations(id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    
    # Verify the tools existence
    parent_tool = db.query(models.Tools).filter(models.Tools.tool_id == id).one_or_none()

    if parent_tool == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tool does not exist")
    elif parent_tool:
        # Check for records
        calibrations = db.query(models.Calibrations).order_by(models.Calibrations.calibration_date.desc()).filter(
            models.Calibrations.parent_id == parent_tool.id).all()

        if calibrations == None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Calibration does not exist")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="There was an error pocessing your request.")

    return calibrations


# Update a calibration
# requires calibration_id
@router.put("/calibration-update/{id}", response_model=schemas.CalibOut)
def update_calibration(id: str, updated_calib: schemas.CalibUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):

    # Check if calibration exist
    query = db.query(models.Calibrations).filter(models.Calibrations.calibration_id == id)
    calib = query.one_or_none()

    if calib == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Calibration does not exist")
    elif calib:
        # Update record
        query.update(updated_calib.model_dump(), synchronize_session=False)
        db.commit()


        # Update the status, valid_until fields
        calib = query.first()
        tool_query = db.query(models.Tools).filter(models.Tools.id == calib.parent_id)
        tool = tool_query.first()

        today = datetime.now()
        try:
            if calib.rating == "Selejt":
                tool.status = "Selejt"
                tool.valid_until = calib.calibration_date

            elif calib.next_calibration > today:
                tool.status = "Kalibrált"
                tool.valid_until = calib.next_calibration

            elif calib.next_calibration < today:
                tool.status = "Lejárt kalibrálás"
                tool.valid_until = calib.next_calibration

        except Exception:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="There was an error pocessing your request.")
        else:
            db.commit()

    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="There was an error pocessing your request.")
    
    return query.first()


# Delete a calibration
# requires calibration_id
@router.delete("/delete-calibration/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_calibration(id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):

    # Check if calibration exist
    cal = db.query(models.Calibrations).filter(models.Calibrations.calibration_id == id).one_or_none()
    if cal != None:
        parent_tool_id = cal.parent_id
        tool = db.query(models.Tools).filter(models.Tools.id == parent_tool_id).first()
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Calibration does not exist")
    

    # Delete the record
    try:
        db.delete(cal)
        db.commit()
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="There was an error pocessing your request.")

    # Update the tool table
    calibration = db.query(models.Calibrations).order_by(models.Calibrations.calibration_date.desc()).filter(
        models.Calibrations.parent_id == tool.id).first()
    
    today = datetime.now()
    try:
        if calibration == None:
            tool.status = "Nincs kalibrálva"
            tool.valid_until = None
        elif calibration.rating == "Selejt":
            tool.status = "Selejt"
            tool.valid_until = calibration.calibration_date
        elif calibration.next_calibration > today:
            tool.status = "Kalibrált"
            tool.valid_until = calibration.next_calibration
        elif calibration.next_calibration < today:
            tool.status = "Lejárt kalibrálás"
            tool.valid_until = calibration.next_calibration
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="There was an error pocessing your request.")
    else:
        db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)


