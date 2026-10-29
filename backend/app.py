"""StackUnity - Serveur Flask : API JSON <-> requêtes SPARQL sur l'ontologie formation_.ttl."""
import os
from flask import Flask
<<<<<<< HEAD
import auth, schema, misc, queries, ai, dashboard
=======
import auth, schema, misc
>>>>>>> origin/main
from modules import MODULES, make_blueprint

app = Flask(__name__)
app.register_blueprint(auth.bp)
<<<<<<< HEAD
app.register_blueprint(dashboard.bp)   # dashboard personnalisé selon le rôle (/api/me/dashboard)
app.register_blueprint(misc.bp)
app.register_blueprint(schema.bp)
app.register_blueprint(queries.bp)     # bibliothèque de requêtes SPARQL
app.register_blueprint(ai.bp)          # API IA (question -> SPARQL, explication, recommandation)
=======
app.register_blueprint(misc.bp)
app.register_blueprint(schema.bp)
>>>>>>> origin/main
for m in MODULES:                       # un blueprint REST par module métier
    app.register_blueprint(make_blueprint(m))

@app.after_request
def cors(resp):                         # CORS pour Angular (localhost:4200)
    resp.headers["Access-Control-Allow-Origin"] = os.getenv("FRONT_ORIGIN", "http://localhost:4200")
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    resp.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    return resp

@app.route("/api/<path:_>", methods=["OPTIONS"])
def preflight(_):
    return "", 204

if __name__ == "__main__":
    app.run(debug=True, port=5000)
