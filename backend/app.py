"""StackUnity - Serveur Flask : API JSON <-> requêtes SPARQL sur l'ontologie formation_.ttl."""
import os
from flask import Flask
import auth, schema, misc
from modules import MODULES, make_blueprint
from flask import request, jsonify
from nlp import generer_sparql
from store import sparql
from auth import auth_required

app = Flask(__name__)
app.register_blueprint(auth.bp)
app.register_blueprint(misc.bp)
app.register_blueprint(schema.bp)
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


@app.post("/api/nlp")
@auth_required
def assistant_nlp():
    data = request.get_json(silent=True) or {}
    question = data.get("question", "")

    try:
        analyse = generer_sparql(question)
        resultats = sparql(analyse["sparql"])

        return jsonify({
            "question": question,
            "classe": analyse["classe"],
            "intention": analyse["intention"],
            "sparql": analyse["sparql"],
            "resultats": resultats
        })

    except ValueError as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True, port=5000)
