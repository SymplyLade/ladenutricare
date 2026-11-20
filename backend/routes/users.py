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




from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import Response
from sqlalchemy.orm import Session
from database import get_db
from models import ProfilePicture, User
from schemas import UserResponse, UserUpdate
from dependencies import get_current_user

router = APIRouter()

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

    _, media_type = file_type
    # Check the file signature as well as the browser supplied content type.
    signatures = {
        "image/jpeg": content.startswith(b"\xff\xd8\xff"),
        "image/png": content.startswith(b"\x89PNG\r\n\x1a\n"),
        "image/gif": content.startswith((b"GIF87a", b"GIF89a")),
    }
    if not signatures[media_type]:
        raise HTTPException(status_code=400, detail="The selected file is not a valid image")

    try:
        picture = db.query(ProfilePicture).filter(ProfilePicture.user_id == current_user.id).first()
        if picture is None:
            picture = ProfilePicture(user_id=current_user.id)
            db.add(picture)
        picture.image_data = content
        picture.content_type = media_type
        current_user.profile_picture = f"/api/users/profile/picture/{current_user.id}"
        db.commit()
        db.refresh(current_user)
    except Exception:
        db.rollback()
        raise
    return current_user


@router.get("/profile/picture/{user_id}")
def get_profile_picture(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.profile_picture:
        raise HTTPException(status_code=404, detail="Profile picture not found")
    picture = db.query(ProfilePicture).filter(ProfilePicture.user_id == user_id).first()
    if picture is None:
        raise HTTPException(status_code=404, detail="Profile picture not found")
    return Response(
        content=picture.image_data,
        media_type=picture.content_type,
        headers={"Cache-Control": "private, max-age=3600"},
    )
