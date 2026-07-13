/* =============================================================================
 * Compteur d'installations — anonyme, sans cookie, sans compte
 * -----------------------------------------------------------------------------
 * Incrémente UNE seule fois par appareil, uniquement quand l'app est ouverte
 * en mode « installé » (écran d'accueil / standalone). Ne stocke aucune donnée
 * personnelle : juste un nombre qui grandit, hébergé par un compteur public
 * (abacus.jasoncameron.dev). L'IP de la requête n'est pas conservée par le service.
 *
 * Lecture du total : https://abacus.jasoncameron.dev/get/<NS>/<KEY>
 * (ou plus joliment via la page stats.html du dépôt).
 * ========================================================================== */
(function () {
  'use strict';

  var NS  = 'jpapp2026-vh-k7m2q9';                 // espace de noms (obscur, partagé anims/jeunes)
  var KEY = (window.__jpStatsKey || 'installs');   // clé propre à CETTE app
  // Drapeau spécifique à la clé : anims et jeunes partagent la même origine
  // GitHub Pages, donc le localStorage est commun -> on distingue par la clé.
  var FLAG = 'jpapp_install_counted_' + KEY;

  function standalone() {
    return (window.matchMedia && matchMedia('(display-mode: standalone)').matches) ||
           window.navigator.standalone === true;
  }

  try {
    if (!standalone()) return;              // en navigateur (non installée) : on ne compte pas
    if (localStorage.getItem(FLAG)) return; // déjà comptée sur cet appareil
  } catch (e) { return; }

  // Incrémente ; le drapeau n'est posé qu'en cas de succès réseau (sinon on
  // réessaiera au prochain lancement — utile si le 1er lancement est hors ligne).
  fetch('https://abacus.jasoncameron.dev/hit/' + NS + '/' + KEY, { cache: 'no-store' })
    .then(function (r) {
      if (r && (r.ok || r.type === 'opaque')) {
        try { localStorage.setItem(FLAG, '1'); } catch (e) {}
      }
    })
    .catch(function () { /* hors ligne : réessai au prochain lancement */ });
})();
