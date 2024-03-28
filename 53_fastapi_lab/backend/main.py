from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient

app = FastAPI()

# Connect to MongoDB
client = MongoClient("mongodb://root:example@localhost:27017/")
db = client["iplab"]
collection = db["iplab"]

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class User(BaseModel):
    username: str
    password: str
    cpassword: str
    email: str
    phone: str

@app.post("/register")
async def register_user(user: User):
    # Backend validation
    if len(user.username) <= 5:
        raise HTTPException(status_code=400, detail="Username must be more than 5 characters.")
    if len(user.password) <= 6:
        raise HTTPException(status_code=400, detail="Password must be more than 6 characters.")
    if user.password != user.cpassword:
        raise HTTPException(status_code=400, detail="Passwords do not match.")
    if len(user.phone) != 11:
        raise HTTPException(status_code=400, detail="Phone number must have exactly 11 digits.")
    # Check if username, email, and phone number are unique
    existing_user = collection.find_one({"$or": [{"username": user.username}, {"email": user.email}, {"phone": user.phone}]})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username, email, or phone number already exists.")

    # Save user to MongoDB
    collection.insert_one(user.dict())

    return {"message": "User registered successfully."}
