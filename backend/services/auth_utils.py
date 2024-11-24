import os
from datetime import datetime, timedelta
from typing import Union
import jwt
from jwt import PyJWTError
from fastapi import HTTPException, status

def generate_salt():
    return os.urandom(16).hex()

def hash_password(password: str, salt: str) -> str:
    return pwd_context.hash(password + salt)