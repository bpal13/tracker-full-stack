from apscheduler.schedulers.background import BackgroundScheduler
from .db.database import SessionLocal
from .db.models import Tools, Calibrations, Users
from .email import send_email_message
import logging
import datetime
from pytz import utc

scheduler = BackgroundScheduler(timezone=utc)

logger = logging.getLogger("trackerLogger")

def five_seconds():
    print('job')


def weekly_db_check():
    db = SessionLocal()

    today = datetime.date.today()
    stats = {"tools_calibrated": 0,
             "tools_expired": 0,
             "tools_not_calibrated": 0,
             "tools_scrap": 0,
             "tools_not_found": 0,
             "date": today.strftime("%Y.%B %d: %H:%M:%S")}   

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
    except Exception as e:
        logger.error(e)
    finally:
        db.close()
        send_email_message("Heti Jelentés", ["pal.bence13@gmail.com"], stats, template="weekly_report.html")
        logger.info("CALIBRATION CHECK COMPLETE: %{}%".format(today.strftime("%Y %B %d: %H:%M:%S")))