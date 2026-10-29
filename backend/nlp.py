
import re
import unicodedata
from nltk.stem.snowball import FrenchStemmer

stemmer = FrenchStemmer()

# Correspondance vocabulaire / classes OWL
CLASSES = {
    "Apprenant": [
        "apprenant", "etudiant", "eleve"
    ],
    "Enseignant": [
        "enseignant", "professeur"
    ],
    "Tuteur": [
        "tuteur"
    ],
    "PersonnelMedical": [
        "personnel medical"
    ],
    "Personne": [
        "personne", "individu"
    ],
    "Universite": [
        "universite", "faculte"
    ],
    "Entreprise": [
        "entreprise", "societe"
    ],
    "Laboratoire": [
        "laboratoire"
    ],
    "Organisme": [
        "organisme", "organisation"
    ],
}

def normaliser(texte):
    texte = unicodedata.normalize("NFD", texte.lower())
    texte = "".join(
        c for c in texte
        if unicodedata.category(c) != "Mn"
    )
    return re.findall(r"[a-z]+", texte)


def generer_sparql(question):
    if not isinstance(question, str) or not question.strip():
        raise ValueError("Veuillez saisir une question.")

    mots = normaliser(question)
    racines = {stemmer.stem(m) for m in mots}

    classe = None

    # Reconnaissance des synonymes par racines
    for nom, synonymes in CLASSES.items():
        for synonyme in synonymes:
            syn_racines = {
                stemmer.stem(m)
                for m in normaliser(synonyme)
            }

            if syn_racines.issubset(racines):
                classe = nom
                break

        if classe:
            break

    if classe is None:
        raise ValueError(
            "Classe non reconnue. Essayez : apprenants, "
            "enseignants, personnes, universités ou entreprises."
        )

    # Détection de l'intention
    compteur = any(
        mot in racines
        for mot in ["combi", "nombr", "total"]
    )

    condition = f"""
        ?item a owl:NamedIndividual .
        ?item a/rdfs:subClassOf* :{classe} .
    """

    if compteur:
        intention = "Compter"
        requete = f"""
SELECT (COUNT(DISTINCT ?item) AS ?total)
WHERE {{
    {condition}
}}
"""
    else:
        intention = "Lister"
        requete = f"""
SELECT DISTINCT ?item ?nom
WHERE {{
    {condition}
    OPTIONAL {{ ?item rdfs:label ?nom }}
}}
ORDER BY ?nom
LIMIT 100
"""

    return {
        "classe": classe,
        "intention": intention,
        "sparql": requete.strip()
    }
