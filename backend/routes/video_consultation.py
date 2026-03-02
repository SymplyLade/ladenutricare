from fastapi import APIRouter
router = APIRouter()

@router.post("/generate-link")
def generate_video_link():
    return {"message": "Video consultation endpoint"}