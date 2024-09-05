from fastapi import APIRouter
from ..oauth2 import get_current_user


router = APIRouter(
    prefix="/email",
    tags='Email'
)

@router.get("/send")
def send_mail():
    pass