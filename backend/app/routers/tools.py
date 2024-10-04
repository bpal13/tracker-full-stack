from datetime import datetime, timezone
from dateutil.relativedelta import relativedelta
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from typing import Optional, List
from sqlalchemy.orm import Session
from ..utils import get_stats
from ..db import models
from .. import schemas
from ..db.database import get_db
from ..oauth2 import get_current_user, CheckRoles
import logging


logger = logging.getLogger("trackerLogger")
router = APIRouter(
    prefix="/tools",
    tags=["Tools"]
)


# Get tool statistics
@router.get("/stats")
def get_statistics(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    
    tools = db.query(models.Tools).all()
    stats = get_stats(tools)

    return {"loc_data": stats[0], "status_data": stats[1]}


# Return the tools from the database
@router.get("/", response_model=List[schemas.ToolOut])
def get_tools(db: Session = Depends(get_db), current_user = Depends(get_current_user),
              limit: int = 500, search_id: Optional[str] = "", search_name: Optional[str] = "", 
              search_status: Optional[str] = "", search_loc: Optional[str] = "", search_order: Optional[str] = ""):
    

    
    query = db.query(models.Tools).filter(
        models.Tools.tool_id.contains(search_id),
        models.Tools.tool_serial.contains(search_id),
        models.Tools.tool_name.contains(search_name),
        models.Tools.status.contains(search_status),
        models.Tools.tool_location.contains(search_loc))
    
    match search_order:
        case 'id_asc':
            tools = query.order_by(models.Tools.tool_id.asc()).limit(limit).all()
        case 'id_desc':
            tools = query.order_by(models.Tools.tool_id.desc()).limit(limit).all()
        case 'newest':
            tools = query.order_by(models.Tools.issue_date.desc()).limit(limit).all()
        case 'oldest':
            tools = query.order_by(models.Tools.issue_date.asc()).limit(limit).all()
        case _:
            tools = query.order_by(models.Tools.tool_id.asc()).limit(limit).all()
            
    return tools


# Return a tool
@router.get("/{id}", response_model=schemas.ToolOut)
def get_tool(id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    
    # Check if tool exists
    tool = db.query(models.Tools).filter(models.Tools.id == id).first()

    if tool == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tool does not exist")
    
    return tool


# Add a new tool to the database
@router.post("/new-tool", response_model=schemas.ToolOut, status_code=status.HTTP_201_CREATED)
def create_tool(req:Request, tool: schemas.ToolCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user), authorize: bool = Depends(CheckRoles(['admin', 'operator']))):
    try:
        # Check for existing records
        check_tool_id = db.query(models.Tools).filter(models.Tools.tool_id == tool.tool_id).one_or_none()
        if check_tool_id:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Tool ID already exist")
        
        check_tool_serial = db.query(models.Tools).filter(models.Tools.tool_serial == tool.tool_serial).one_or_none()
        if check_tool_serial:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Tool Serial already exist")
        if not check_tool_id and not check_tool_serial:
            # Add tool to DB
            new_tool = models.Tools(issued_by = current_user.id, **tool.model_dump())
            db.add(new_tool)
            db.commit()

            logger.info(f"{req.client.host} - New tool added with Tool ID: {new_tool.tool_id}")
    except Exception as e:
        print(e)

    return new_tool


# Get all the scrapped tools
@router.get("/scraps", response_model=List[schemas.ToolOut])
def scraps(db: Session = Depends(get_db), current_user = Depends(get_current_user)):

    tools = db.query(models.Tools).filter(models.Tools.status == "Selejt").order_by(models.Tools.tool_id.asc()).all()

    return tools


# Update the tools properties
@router.put("/update/{id}", response_model=schemas.ToolOut)
def update_tool(req: Request, id: int, updated_tool: schemas.ToolUpdate, db: Session = Depends(get_db), authorize: bool = Depends(CheckRoles(['admin', 'operator']))):

    # Check if tool exist
    query = db.query(models.Tools).filter(models.Tools.id == id)
    tool_to_update = query.first()

    if tool_to_update == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tool does not exist")
    
    # Update tool properties
    query.update(updated_tool.model_dump(), synchronize_session=False)
    db.commit()

    logger.info(f"{req.client.host} - Tool update on tool {tool_to_update.tool_id}")

    return query.first()


# Add a calibration
@router.post("/calibrate/{id}", response_model=schemas.CalibOut, status_code=status.HTTP_201_CREATED)
def calibrate_tool(req: Request, id: int, new_calibration: schemas.CalibCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user), authorize: bool = Depends(CheckRoles(['admin', 'operator']))):

    # Check if tool exists
    tool = db.query(models.Tools).filter(models.Tools.id == id).first()

    if tool == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tool does not exist")
    
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

    logger.info(f"{req.client.host} - New calibration on tool {tool.tool_id}")

    return calibration


# Return Calibration details
@router.get("/calibration/{id}", response_model=schemas.CalibOut)
def calibration_details(id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):

    # Check if calibration exist
    calib = db.query(models.Calibrations).filter(models.Calibrations.parent_id == id).first()

    if calib == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Calibration does not exist")
    
    return calib

# Return all calibrations
@router.get("/calibration/{id}/all", response_model=List[schemas.CalibOut])
def get_calibrations(id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    
    # Check for records
    calibrations = db.query(models.Calibrations).order_by(models.Calibrations.calibration_date.desc()).filter(
        models.Calibrations.parent_id == id).all()

    if calibrations == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Calibration does not exist")

    return calibrations


# Update a calibration
@router.put("/calibration/{id}", response_model=schemas.CalibOut)
def update_calibration(req: Request, id: int, updated_calib: schemas.CalibCreate, db: Session = Depends(get_db), 
                        authorize: bool = Depends(CheckRoles(['admin', 'operator']))):

    # Check if calibration exist
    query = db.query(models.Calibrations).filter(models.Calibrations.id == id)
    calib = query.first()
    if calib == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Calibration does not exist")


    # Update record
    query.update(updated_calib.model_dump(), synchronize_session=False)
    db.commit()


    # Update the status, valid_until fields
    calib = query.first()
    tool_query = db.query(models.Tools).filter(models.Tools.id == calib.parent_id)
    tool = tool_query.first()

    today = datetime.now()

    if calib.next_calibration > today:
        tool.status = "Kalibrált"
        tool.valid_until = calib.next_calibration
        db.commit()

    if calib.next_calibration < today:
        tool.status = "Lejárt kalibrálás"
        tool.valid_until = calib.next_calibration
        db.commit()

    if calib.rating == "Selejt":
        tool.status = "Selejt"
        tool.valid_until = calib.next_calibration
        db.commit()

    logger.info(f"{req.client.host} - Calibration updated with id: {calib.id}")    

    return query.first()


# Delete a calibration
@router.delete("/calibration/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_calibration(req: Request, id: int, db: Session = Depends(get_db), authorize: bool = Depends(CheckRoles(['admin', 'operator']))):

    # Check if calibration exist
    calib = db.query(models.Calibrations).filter(models.Calibrations.id == id).first()
    if calib != None:
        parent_tool_id = calib.parent_id
        tool = db.query(models.Tools).filter(models.Tools.id == parent_tool_id).first()
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Calibration does not exist")
    

    # Delete the record
    db.delete(calib)
    db.commit()

    # Update the tool table
    calibration = db.query(models.Calibrations).order_by(models.Calibrations.calibration_date.desc()).filter(
        models.Calibrations.parent_id == tool.id).first()
    
    today = datetime.now()
    if calibration == None:
        tool.status = "Nincs kalibrálva"
        tool.valid_until = None
        db.commit()
    elif calibration.rating == "Selejt":
        tool.status = "Selejt"
        tool.valid_until = calib.next_calibration
        db.commit()
    elif calibration.next_calibration > today:
        tool.status = "Kalibrált"
        tool.valid_until = calib.next_calibration
        db.commit()
    elif calibration.next_calibration < today:
        tool.status = "Lejárt kalibrálás"
        tool.valid_until = calib.next_calibration
        db.commit()

    logger.info(f"{req.client.host} - Calibration removed from tool {tool.tool_id}")    

    return Response(status_code=status.HTTP_204_NO_CONTENT)


