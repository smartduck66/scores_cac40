# Tooling
---

Pour formater un document rapidement via l'extension prettier, la commande de touches ALT + F est configurée

Pour mettre à jour les modules NPM (npm uninstall 'module' pour la désinstallation) :
- npm install npm@latest -g (dernière version NPM)
- npm -g upgrade typescript (update typescript)
- npx npm-check-updates -u (vérification des modules à migrer)
- npm install (migration)
- npm list vue (check dernière version de vue, par exemple)

Pour créer son squelette d'application TS :
- npm create vite@latest bel_vue -- --template vue-ts

Pour développer et tester en local :
- npm run dev
- http://localhost:5173 lance le vite dev server (on bénéficie immédiatement du HMR, Hot Module Reload)

Pour construire le site statique (->dist) qui sera publié sur Netlify :
- npm run build
- npm run preview
- http://localhost:4173 pour tester en local
- git add -A
- git commit -m "new fonctions"
- git push
- Netlify le publie automatiquement en production sur https://reliable-flan-d69078.netlify.app/
- ATTENTION : _redirects doit être ajouté dans /public pour éviter les 404 en prod sur une actualisation de page
  (https://medium.com/@ishoshot/page-not-found-on-reload-vuejs-netlify-c71716e97e6)

---

Recommandation : passer le site en production au "checker" HTML régulièrement -> https://validator.w3.org/

---


