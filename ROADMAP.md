# ⚽ Manager Career — Roadmap

Cette feuille de route définit les priorités de développement. On avance par petites étapes, on teste chaque changement et on préserve les fonctionnalités déjà opérationnelles.

## Étape 1A — Valider les améliorations mobiles déjà réalisées (terminée)

### Déjà réalisé
- [x] Interface assombrie et allégée, dans un style manager de football
- [x] Navigation inférieure entre les principales catégories
- [x] Indicateur vert animé entre les catégories
- [x] Menu « Plus » qui se ferme au défilement ou lors du changement de catégorie
- [x] Retour en haut de page lors du changement de catégorie
- [x] Bouton de retour collant en haut de l’écran
- [x] Désactivation du zoom sur l’interface
- [x] Correction du terrain tactique sur mobile

### Validation restante
- [x] Tester sur iPhone Safari les menus, la navigation et le défilement
- [x] Vérifier toutes les entrées du menu « Plus »
- [x] Vérifier les écrans Effectif, Matchs, Compétitions et Tactiques
- [x] Vérifier les éventuels défauts visuels ou problèmes tactiles restants
- [x] Confirmer que la dernière version déployée fonctionne correctement

## Étape 1B — Continuer l’amélioration de l’interface (en cours)

La validation des changements mobiles est faite, mais le chantier visuel et ergonomique n’est pas terminé.

- [ ] Faire un audit écran par écran avec l’utilisateur
- [ ] Recenser les défauts visuels, espacements, tailles de texte et hiérarchie de l’information
- [ ] Harmoniser les cartes, boutons, tableaux et panneaux dans le style Football Manager sombre et professionnel
- [ ] Améliorer la densité et la lisibilité des statistiques sur iPhone
- [ ] Vérifier la cohérence visuelle entre Accueil, Effectif, Matchs, Compétitions, Tactiques et les écrans du menu « Plus »
- [ ] Tester chaque amélioration sur iPhone et confirmer le déploiement

## Étape 2 — Terminer la gestion de l’effectif

### Déjà réalisé
- [x] Séparer titulaires, remplaçants et réservistes dans les tactiques
- [x] Glisser-déposer des joueurs dans la composition
- [x] Bloquer le match si un joueur blessé est sélectionné
- [x] Utiliser le onze choisi pour les contributions de match
- [x] Afficher disponibilité, fatigue, forme et condition physique sur les cartes de l’effectif

### À vérifier
- [ ] Vérifier la sauvegarde et la restauration de la composition
- [ ] Tester le cycle complet : composition → match → fatigue/blessures → récupération → match suivant
- [ ] Vérifier les données des joueurs et les liens club-joueur

## Étape 3 — Approfondir le mercato et les transferts

### Base existante
- [x] Marché des transferts avec négociations
- [x] Budget de carrière

### À développer
- [ ] Finaliser la date courante de carrière et la progression du temps
- [ ] Définir les dates de début et de fin de saison
- [ ] Ajouter les fenêtres de transferts d’été et d’hiver
- [ ] Autoriser ou bloquer les transferts selon les dates du mercato
- [ ] Vérifier la cohérence des transferts : club vendeur, club acheteur, effectifs et budgets
- [ ] Ajouter ou compléter contrats, salaires et fins de contrat

## Étape 4 — Donner plus de profondeur à la carrière

- [ ] Faire évoluer forme, fatigue et moral après les matchs
- [ ] Compléter les blessures et suspensions avec durée et date de retour
- [ ] Ajouter les trêves internationales et les convocations
- [ ] Ajouter le centre de formation et la progression des jeunes
- [ ] Ajouter les échéances des objectifs du manager et les événements de fin de saison
- [ ] Améliorer les statistiques et l’historique des saisons

## Étape 5 — Calendrier et compétitions avancées

- [x] Première base du calendrier daté : dates par journée et structure d’événements persistante
- [ ] Faire progresser la date de carrière de façon cohérente après les matchs et événements
- [ ] Adapter les dates des matchs et éviter un espacement fixe systématique d’une semaine
- [ ] Afficher les événements dans les calendriers du club et de la ligue
- [ ] Ajouter les tirages au sort, les coupes, les finales et les compétitions européennes
- [ ] Vérifier la sauvegarde et la restauration de la date courante et des événements

## Étape 6 — Fonctions immersives, plus tard

- [ ] Actualités et rumeurs de transferts
- [ ] Conférences de presse
- [ ] Palmarès et historique détaillé des saisons

## Règles de développement

- Traiter une modification ciblée à la fois.
- Examiner le code existant avant de le modifier.
- Mettre à jour `index.html` lorsqu’un nouveau script ou une nouvelle ressource l’exige.
- Tester les changements et vérifier le résultat GitHub Actions avant de déclarer le déploiement terminé.
- Ne pas modifier la logique du jeu simplement pour faire passer un test incorrect.
