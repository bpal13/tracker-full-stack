from pathlib import Path
from .schemas import UserMail
from fastapi_mail import FastMail, ConnectionConfig, MessageSchema, MessageType
from .config import settings
from typing import List


email_config = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    MAIL_FROM=settings.MAIL_USERNAME,
    TEMPLATE_FOLDER = Path(__file__).parent / 'templates',
    
)



# Send email function
async def send_email_message(subject: str, to: List[str], body: dict | None , template: str):
    message = MessageSchema(
        subject=f"[TOOL TRACKER] {subject}",
        recipients=to,
        template_body=body,
        subtype=MessageType.html
    )

    fm = FastMail(email_config)
    try:
        await fm.send_message(message, template_name=template)
    except Exception as ex:
        print(ex)


# Registration email
async def send_email(to: UserMail, subject: str):
    message = MessageSchema(
        subject=f"[TOOL TRACKER] {subject}",
        recipients=[to.email],
        template_body=to.model_dump(),
        subtype=MessageType.html,
    )

    fm = FastMail(email_config)
    await fm.send_message(message, template_name="registration.html")

