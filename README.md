# StackUnity — Application web sur ontologie (Angular + Flask + SPARQL)

    Front Angular (Auth, token JWT) --HTTP/JSON--> Serveur Flask --SPARQL (rdflib)--> backend/ontology/formation_.ttl  <-- Protégé

Toute création / modification / suppression (instances, classes, propriétés) **réécrit `formation_.ttl`**
(copie `formation_.ttl.bak` au premier enregistrement). Dans Protégé : File > Open > ce fichier (rouvrir après chaque modification).

## Lancer
    cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && python app.py   # :5000
    cd frontend && npm install && npx ng serve                                                                        # :4200
Compte démo `admin` / `admin123`, ou « Créer un compte » (comptes gardés dans backend/users.json).

## Les 10 modules (1 module = 1 sous-arbre de l'ontologie = 1 blueprint Flask = 1 page Angular)
| Module (route / API) | Classe racine | Classes |
|---|---|---|
| personnes | Personne | 17 |
| formations | Domaine (Formation, Diplôme, Compétence, Certification, Parcours, Niveau, Période) | 42 |
| matieres | Matiere (Séance, Évaluation, Ressource, Outil numérique) | 26 |
| clubs | Club (Événement…) | 26 |
| organismes | Organisme (Université, Entreprise, Laboratoire, Stage) | 17 |
| espaces | Espace | 9 |
| inscriptions | Inscription | 4 |
| bourses | Bourse | 4 |
| sante | ServiceMedical | 25 |
| vie | ServiceVieEtudiante | 17 |
+ module **Propriétés** (`/api/properties`, page `/proprietes`) : CRUD des ObjectProperty / DatatypeProperty.
Total : 187 classes, toutes couvertes.

## API Flask (JWT : `Authorization: Bearer <token>`)
Pour chaque module `<m>` :
| Méthode | Route | Rôle |
|---|---|---|
| GET / POST | /api/<m>/classes | lister (hiérarchie + nb d'instances) / créer une sous-classe |
| PUT / DELETE | /api/<m>/classes/<Classe> | modifier (label, description, parent) / supprimer (refusée s'il reste sous-classes ou instances) |
| GET | /api/<m>/classes/<Classe>/items?columns=a,b | instances (sous-classes incluses) + valeurs des propriétés demandées |
| GET | /api/<m>/classes/<Classe>/properties | propriétés applicables (selon rdfs:domain) |
| POST | /api/<m>/items | créer une instance |
| GET / PUT / DELETE | /api/<m>/items/<Id> | lire / modifier / supprimer |
Transversal : `POST /api/auth/register|login`, `GET /api/modules`, `/api/stats`, `/api/search?q=`, `POST /api/sparql` (SELECT/ASK), `GET /api/export.ttl`,
`GET /api/individuals/<Id>` (fiche globale + module), `GET /api/classes/<Classe>/individuals`, `GET/POST /api/properties`, `PUT/DELETE /api/properties/<nom>`.

## Frontend Angular : composants
- **shared/** (composants réutilisés par tous les modules) : `module-page` (en-tête + onglets), `entity-crud` (CRUD d'une sous-entité),
  `item-table`, `item-detail`, `item-form` (champs typés : date, nombre, oui/non, liste d'instances), `class-manager`, `class-tree`, `class-form`.
- **features/<module>/<module>.component.ts** : 1 composant par module (10) ; chacun déclare ses onglets = ses sous-entités
  (57 au total), avec les colonnes du tableau et les champs du formulaire propres à chaque sous-entité.
  Exemple : Personnes → Enseignants, Apprenants, Personnel médical, Tuteurs, Tuteurs entreprise, Responsables de club, Administrateurs.
- Dans chaque module : onglets d'entités (CRUD instances) + onglet « ⚙ Classes » (CRUD des classes du module).
- **pages/** : login, dashboard (recherche globale), schema (CRUD des propriétés), sparql.

## Où est quoi
- backend/app.py (assemblage) · modules.py (10 modules + CRUD) · schema.py (propriétés) · auth.py · misc.py · store.py (rdflib + écriture .ttl)
- frontend/src/app/core (auth, api.service, modules.ts, module.types.ts) · shared/ · features/ · pages/
