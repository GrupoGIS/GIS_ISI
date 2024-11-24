from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")

def require_employee(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload.get("is_employee"):
        raise HTTPException(status_code=403, detail="Acesso restrito a funcionários")
    return payload

def require_driver(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload.get("is_driver"):
        raise HTTPException(status_code=403, detail="Acesso restrito a motoristas")
    return payload

def require_client(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload.get("is_client"):
        raise HTTPException(status_code=403, detail="Acesso restrito a clientes")
    return payload
