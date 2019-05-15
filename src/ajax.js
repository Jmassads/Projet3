// requête http basée sur la méthode get
// Prend en paramètres l'URL cible et la fonction callback appelée en cas de succès
function AjaxGet(url, callback) {
  /* 
   On crée une variable pour notre requête HTTP
   L'objet XMLHttpRequest permet d'interagir avec le serveur

   */
  const xhr = new XMLHttpRequest();
  /* 
    On attache une fonction à l'event handler de notre requête -> onreadystatechange
    https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
    Le readystate que l'on cherche est le code 4 - la requête est terminée (il y a 5 états)
   
  */
  xhr.onreadystatechange = function (e) {
    // Est ce que la requête est terminée?
    if (xhr.readyState === 4 || xhr.readyState === XMLHttpRequest.DONE) {
      /* Tout va bien, la réponse a été reçue

      
         Est ce que la requête est bien passée?
         https://developer.mozilla.org/fr/docs/Web/HTTP/Status 
      */
      if (xhr.status === 200) {
        // parfait !
         // Appelle la fonction callback en lui passant la réponse de la requête
        callback(xhr.responseText)
      } else {
        // il y a eu un problème avec la requête,
        // par exemple la réponse peut être un code 404 (Non trouvée)
        console.log("Statut:" + xhr.status);
      }
    }
  }
  xhr.ontimeout = function () {
    console.error("Erreur réseau avec l'URL " + url);
  }

  // open et send sont des méthodes de la class XMLHttpRequest.
  // open ouvre notre requête
  xhr.open('get', url);
  // on envoie la requête
  xhr.send();
}





export {
  AjaxGet
};