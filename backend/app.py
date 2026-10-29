
"""StackUnity - Serveur Flask :
API JSON <-> requêtes SPARQL sur l'ontologie formation_.ttl.
"""

import os

from flask import Flask, request, jsonify

import auth
import schema
import misc
import queries
import ai
import dashboard

from modules import MODULES, make_blueprint
from nlp import generer_sparql
from store import sparql
from auth import auth_required


# ==========================================================
# Initialisation Flask
# ==========================================================

app = Flask(__name__)


# ==========================================================
# Enregistrement des Blueprints
# ==========================================================

# Authentification
app.register_blueprint(auth.bp)

# Dashboard personnalisé
app.register_blueprint(dashboard.bp)

# Fonctionnalités générales
app.register_blueprint(misc.bp)

# Gestion du schéma ontologique
app.register_blueprint(schema.bp)

# Bibliothèque de requêtes SPARQL
app.register_blueprint(queries.bp)

# Assistant IA avancé des collègues
app.register_blueprint(ai.bp)

# Modules métier
for m in MODULES:
    app.register_blueprint(make_blueprint(m))


# ==========================================================
# Configuration CORS - Angular
# ==========================================================

@app.after_request
def cors(resp):
    resp.headers["Access-Control-Allow-Origin"] = os.getenv(
        "FRONT_ORIGIN",
        "http://localhost:4200"
    )

    resp.headers["Access-Control-Allow-Headers"] = (
        "Content-Type, Authorization"
    )

    resp.headers["Access-Control-Allow-Methods"] = (
        "GET, POST, PUT, DELETE, OPTIONS"
    )

    return resp


@app.route("/api/<path:_>", methods=["OPTIONS"])
def preflight(_):
    return "", 204


# ==========================================================
# Assistant IA Dhia - NLP + SPARQL
# ==========================================================

@app.post("/api/nlp")
@auth_required
def assistant_nlp():

    data = request.get_json(silent=True) or {}
    question = data.get("question", "")

    try:
        # NLP : question française -> SPARQL
        analyse = generer_sparql(question)

        # Exécution de la requête sur l'ontologie
        resultats = sparql(analyse["sparql"])

        return jsonify({
            "question": question,
            "classe": analyse["classe"],
            "intention": analyse["intention"],
            "sparql": analyse["sparql"],
            "resultats": resultats
        })

    except ValueError as e:
        return jsonify({
            "error": str(e)
        }), 400

    except Exception:
        app.logger.exception("Erreur Assistant NLP")

        return jsonify({
            "error": "Erreur lors de l'analyse NLP."
        }), 500


# ==========================================================
# Démarrage du serveur Flask
# ==========================================================

if __name__ == "__main__":
    app.run(debug=True, port=5000)
