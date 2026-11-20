# # from fastapi import APIRouter, Depends, HTTPException
# # from sqlalchemy.orm import Session
# # from database import get_db
# # from models import User
# # from schemas import UserResponse, UserUpdate
# # from dependencies import get_current_user

# # router = APIRouter()

# # @router.get("/profile", response_model=UserResponse)
# # def get_profile(current_user: User = Depends(get_current_user)):
# #     return current_user

# # @router.put("/profile", response_model=UserResponse)
# # def update_profile(
# #     user_data: UserUpdate,
# #     db: Session = Depends(get_db),
# #     current_user: User = Depends(get_current_user)
# # ):
# #     for key, value in user_data.dict(exclude_unset=True).items():
# #         setattr(current_user, key, value)
# #     db.commit()
# #     db.refresh(current_user)
# #     return current_user


# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from database import get_db
# from models import User
# from schemas import UserResponse, UserUpdate
# from dependencies import get_current_user

# router = APIRouter()

# @router.get("/profile", response_model=UserResponse)
# def get_profile(current_user: User = Depends(get_current_user)):
#     return current_user

# @router.put("/profile", response_model=UserResponse)
# def update_profile(
#     user_data: UserUpdate,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     for key, value in user_data.dict(exclude_unset=True).items():
#         setattr(current_user, key, value)
#     db.commit()
#     db.refresh(current_user)
#     return current_user




from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserResponse, UserUpdate
from dependencies import get_current_user

router = APIRouter()

PROFILE_PICTURE_DIR = Path(__file__).resolve().parents[1] / "uploads" / "profile-pictures"
MAX_PROFILE_PICTURE_SIZE = 2 * 1024 * 1024
ALLOWED_PICTURE_TYPES = {
    "image/jpeg": ("jpg", "image/jpeg"),
    "image/png": ("png", "image/png"),
    "image/gif": ("gif", "image/gif"),
}

@router.get("/profile", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserResponse)
def update_profile(
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    for key, value in user_data.dict(exclude_unset=True).items():
        setattr(current_user, key, value)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/profile/picture", response_model=UserResponse)
async def upload_profile_picture(
    profile_picture: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    file_type = ALLOWED_PICTURE_TYPES.get(profile_picture.content_type or "")
    if not file_type:
        raise HTTPException(status_code=400, detail="Upload a JPG, PNG, or GIF image")

    content = await profile_picture.read(MAX_PROFILE_PICTURE_SIZE + 1)
    if len(content) > MAX_PROFILE_PICTURE_SIZE:
        raise HTTPException(status_code=400, detail="Image must be 2MB or smaller")
    if not content:
        raise HTTPException(status_code=400, detail="The selected image is empty")

    extension, media_type = file_type
    # Check the file signature as well as the browser supplied content type.
    signatures = {
        "image/jpeg": content.startswith(b"\xff\xd8\xff"),
        "image/png": content.startswith(b"\x89PNG\r\n\x1a\n"),
        "image/gif": content.startswith((b"GIF87a", b"GIF89a")),
    }
    if not signatures[media_type]:
        raise HTTPException(status_code=400, detail="The selected file is not a valid image")

    PROFILE_PICTURE_DIR.mkdir(parents=True, exist_ok=True)
    destination = PROFILE_PICTURE_DIR / f"{current_user.id}.{extension}"
    try:
        destination.write_bytes(content)
        current_user.profile_picture = f"/api/users/profile/picture/{current_user.id}"
        db.commit()
        db.refresh(current_user)
        for old_extension in {"jpg", "png", "gif"} - {extension}:
            (PROFILE_PICTURE_DIR / f"{current_user.id}.{old_extension}").unlink(missing_ok=True)
    except Exception:
        db.rollback()
        destination.unlink(missing_ok=True)
        raise
    return current_user


@router.get("/profile/picture/{user_id}")
def get_profile_picture(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.profile_picture:
        raise HTTPException(status_code=404, detail="Profile picture not found")
    for extension, media_type in (("jpg", "image/jpeg"), ("png", "image/png"), ("gif", "image/gif")):
        image_path = PROFILE_PICTURE_DIR / f"{user_id}.{extension}"
        if image_path.is_file():
            return FileResponse(image_path, media_type=media_type, headers={"Cache-Control": "no-cache"})
    raise HTTPException(status_code=404, detail="Profile picture not found")
