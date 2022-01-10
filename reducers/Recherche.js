export default function (recherche = "", action) {
  if (action.type === "setRecherche") {
    return action.valeur;
  } else if (action.type === "ResetRecherche") {
    newRecherche = "";
    return newRecherche;
  } else {
    return recherche;
  }
}
