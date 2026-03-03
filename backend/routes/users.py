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




from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserResponse, UserUpdate
from dependencies import get_current_user

router = APIRouter()

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

# Profile picture upload endpoint (to be implemented later with file handling)