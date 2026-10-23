"""Authentification : inscription / connexion / JWT. Comptes persistés dans users.json."""
import os, json, datetime, functools
import jwt
from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash

SECRET = os.getenv("JWT_SECRET", "change-me-in-prod")
USERS_FILE = os.path.join(os.path.dirname(__file__), "users.json")
bp = Blueprint("auth", __name__, url_prefix="/api/auth")

if os.path.exists(USERS_FILE):
    USERS = json.load(open(USERS_FILE, encoding="utf-8"))
else:                                           # compte par défaut : admin / admin123
    USERS = {"admin": {"hash": generate_password_hash("admin123"), "role": "admin"}}

def make_token(username):
    exp = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=8)
    return jwt.encode({"sub": username, "role": USERS[username]["role"], "exp": exp}, SECRET, algorithm="HS256")

def auth_required(fn):
    @functools.wraps(fn)
    def wrapper(*a, **kw):
        try:
            payload = jwt.decode(request.headers.get("Authorization", "").removeprefix("Bearer "),
                                 SECRET, algorithms=["HS256"])
            request.user = payload["sub"]
        except jwt.PyJWTError:
            return jsonify(error="Token invalide ou expiré"), 401
        return fn(*a, **kw)
    return wrapper

@bp.post("/register")
def register():
    d = request.get_json(force=True)
    u, p = (d.get("username") or "").strip(), d.get("password") or ""
    if len(u) < 3 or len(p) < 6:
        return jsonify(error="Nom (3+) et mot de passe (6+) requis"), 400
    if u in USERS:
        return jsonify(error="Utilisateur existant"), 409
    USERS[u] = {"hash": generate_password_hash(p), "role": "user"}
    json.dump(USERS, open(USERS_FILE, "w", encoding="utf-8"), indent=2)
    return jsonify(token=make_token(u), username=u), 201

@bp.post("/login")
def login():
    d = request.get_json(force=True)
    u = USERS.get(d.get("username"))
    if not u or not check_password_hash(u["hash"], d.get("password", "")):
        return jsonify(error="Identifiants incorrects"), 401
    return jsonify(token=make_token(d["username"]), username=d["username"])
