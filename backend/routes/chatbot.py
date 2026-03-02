from fastapi import APIRouter
router = APIRouter()

@router.post("/message")
def chat_message():
    return {"message": "Chatbot endpoint"}