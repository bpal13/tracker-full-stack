import datetime
from passlib.context import CryptContext
from fastapi import Depends
from sqlalchemy.orm import Session
from .db.database import get_db
from datetime import datetime, timezone



# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash(password: str):
    return pwd_context.hash(password)


def verify(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)



# Tool status check
def update_calibration_status(tool, calibration, db: Session = Depends(get_db)):
    '''Updates the 'status' and the 'valid until' fields of the selected tool.'''
    today = datetime.now()

    if calibration == None:
        tool.status = "Nincs kalibrálva"
        tool.valid_until = None
        db.commit()

    if calibration and calibration.next_calibration > today:
        tool.status = "Kalibrált"
        tool.valid_until = calibration.next_calibration
        db.commit()

    if calibration and calibration.next_calibration < today:
        tool.status = "Lejárt kalibrálás"
        tool.valid_until = calibration.next_calibration
        db.commit()

    if calibration and calibration.rating == "Selejt":
        tool.status = "Selejt"
        tool.valid_until = calibration.next_calibration
        db.commit()


# Get tool statistics
def get_stats(tools):
    status_labels = ["Kalibrált", "Lejárt kalibrálás",
                     "Selejt", "Nincs kalibrálva", "Nem található"]
    status_data = {label: 0 for label in status_labels}

    loc_labels = ["MEO", "Raktár", "Tanműhely", "Tartalék", "Kisgépes csarnok", "Nagygépes csarnok", "Köszörű",
                  "Szerelde", "Egyéb", "Digma", "Huzal", "TEK", "HERMLE", "Tömbszikra", "Személyek", "Eszterga", "1150", "IXION"]
    loc_data = {label: 0 for label in loc_labels}

    for row in tools:
        if row.status in status_data:
            status_data[row.status] += 1

        if row.tool_location in loc_data:
            loc_data[row.tool_location] += 1

    return status_data, loc_data