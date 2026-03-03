from typing import Optional, Union

from sqlalchemy.orm import Session

from models import Notification, NotificationType


NotificationKind = Union[NotificationType, str]


def create_notification(
    db: Session,
    user_id: int,
    title: str,
    message: str,
    notification_type: NotificationKind = NotificationType.SYSTEM,
    link: Optional[str] = None,
) -> Notification:
    """Create an in-app notification within the current DB transaction."""
    notification = Notification(
        user_id=user_id,
        type=notification_type,
        title=title,
        message=message,
        link=link,
    )
    db.add(notification)
    return notification
