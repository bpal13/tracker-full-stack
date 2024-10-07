from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..db.models import Tools, Calibrations
from ..email import send_email_message
import logging
from .. import oauth2
from datetime import datetime


logger = logging.getLogger("trackerLogger")
router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.get("/weekly")
def weekly_db_check(bg_task: BackgroundTasks, db: Session = Depends(get_db), current_user = Depends(oauth2.get_current_user)):

    today = datetime.now()
    stats = {"tools_calibrated": 0,
             "tools_expired": 0,
             "tools_not_calibrated": 0,
             "tools_scrap": 0,
             "tools_not_found": 0,
             "date": today.strftime("%Y.%B %d: %H:%M:%S")
             }   

    try:
        tools = db.query(Tools).all()
        for tool in tools:
            # Check if the tool is not calibrated, missing or scrapped
            if tool.status == "Selejt":
                stats["tools_scrap"] += 1
            elif tool.status == "Nincs kalibrálva":
                stats["tools_not_calibrated"] += 1
            elif tool.status == "Nem található":
                stats["tools_not_found"] += 1
            else:
                # Get the latest calibration
                calib = db.query(Calibrations).filter(Calibrations.parent_id == tool.id).order_by(Calibrations.calibration_date.desc()).first()            
                # If the calibration is expired
                if today >= calib.next_calibration:
                    tool.status = "Lejárt kalibrálás"
                    tool.valid_until = calib.next_calibration
                    db.commit()
                    stats["tools_expired"] += 1
                if today < calib.next_calibration:
                    tool.status = "Kalibrált"
                    tool.valid_until = calib.next_calibration
                    db.commit()
                    stats["tools_calibrated"] += 1
        bg_task.add_task(send_email_message, "Heti Jelentés", [current_user.email], stats, "weekly_report.html")
        logger.info("CALIBRATION CHECK COMPLETE: {}".format(today.strftime("%Y %B %d: %H:%M:%S")))
    except Exception as e:
        # print(e)
        logger.exception(e)
    

    return {"message": "ok"}


@router.get('/daily')
def daily_tool_check(bg_task: BackgroundTasks, db: Session = Depends(get_db), current_user = Depends(oauth2.get_current_user)):
    today = datetime.now()
    body = {}
    try:
        tools = db.query(Tools).all()
        if tools:
            for tool in tools:
                if tool.issue_date == today:
                    body[tool.id] = f"{tool.tool_id} - {tool.tool_brand} {tool.tool_type} {tool.tool_name}"
        if len(body) > 0:
            print(body)
            # bg_task.add_task(send_email_message, "NAPI JELENTES", [""], body, "daily_report.html")
        logger.info("DAILY TASK COMPLETE: {}".format(today.strftime("%Y %B %d: %H:%M:%S")))
    except Exception as e:
        logger.exception(e)

    return {"message": "ok"}