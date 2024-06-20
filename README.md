Battleship - Colle W2

Ce dépôt contient le travail réalisé durant une après-midi pour la colle W2 - Battleship. Le projet consiste à développer un jeu de bataille navale en JavaScript (ES6).
Description du Projet

Le but de ce projet est de déboguer et terminer un jeu de bataille navale existant en utilisant JS ES6, sans utiliser de plugins ou librairies externes. Le projet se compose de plusieurs exercices, chacun ajoutant de nouvelles fonctionnalités ou corrigeant des bugs dans l'application.
Exercices
Exercice 0

Objectif: Corriger l'erreur JS affichée dans la console du navigateur ("TypeError: player.setGame...").

    Restriction: Vous ne devez pas modifier le contenu du fichier game.js !

Exercice 1

Objectif: Faire en sorte que les bateaux, une fois placés, s'effacent correctement de la grande map.

    Restriction: Vous ne devez pas modifier le contenu du fichier game.js !

Exercice 2

Objectif: Implémenter la fonction renderMiniMap pour colorer les cases de la minimap en fonction de l'emplacement des bateaux choisis par le joueur.

    Détails:
        La fonction est déclarée dans le fichier game.js à la ligne 219.
        Les différentes cases doivent être colorées de la couleur du bateau qui occupe la case.

Exercice 3

Objectif: Empêcher que l'utilisateur puisse placer deux bateaux sur une même case ou qu'un de ces bateaux sorte du terrain.
Exercice 4

Objectif: Permettre à l'utilisateur de placer ses bateaux verticalement en utilisant un clic droit pour changer l'orientation du bateau.
Exercice 5

Objectif: Faire en sorte que l'ordinateur place ses bateaux de façon aléatoire, en respectant les règles de placement (pas de chevauchement, pas de sortie de la map).
Exercice 6

Objectif: Afficher les cases où l'utilisateur a déjà tiré (rouge si c'est touché, gris si c'est manqué).
Exercice 7

Objectif: Modifier le message affiché si le joueur choisit une case où il a déjà tiré, sans changer l'information (touché ou manqué) par rapport au premier tir.
Exercice 8

Objectif: Modifier le code pour que l'ordinateur joue de façon plus intelligente (actuellement, il tire toujours dans la première case en haut à gauche).
Exercice 9

Objectif: Mettre à jour la Mini Map après que l'ordinateur a joué, pour refléter la perte subie par le joueur, et attribuer la classe CSS "sunk" à l'icône du bateau correspondant si un bateau est complètement coulé.
Exercice 10

Objectif: Corriger le bug qui empêche de redonner la main au joueur après que l'ordinateur a joué.
Exercice 11

Objectif: Implémenter la détection de fin de partie (fonction gameIsOver).

    Détails:
        La fonction gameIsOver est déclarée dans le fichier game.js à la ligne 105 et appelée à la ligne 80.

Exercice 12

Objectif: Implémenter la possibilité de choisir qui commence (joueur humain, ordinateur, ou aléatoire).
Exercice 13

Objectif: Ajouter des sons pour chaque tir : un son indépendamment de la réussite du tir, un son en cas de tir réussi, et un autre en cas de tir raté.
Exercice 14

Objectif: Ajouter des animations dans les cases de la grille consécutivement à un tir du joueur : une animation d'explosion pour un tir réussi, et une autre en cas de tir raté.
Exercice 15

Objectif: Implémenter plusieurs niveaux de jeu pour l'IA.

    Niveaux:
        Niveau facile : tirs aléatoires
        Niveau difficile : tirs réfléchis

Exercice 16

Objectif: Implémenter une aide de jeu : si le joueur le désire, l'ordinateur lui suggère une case à jouer.
Bonnes Pratiques

    Faites des commits atomiques pour faciliter le retour en arrière si besoin.
    Respectez les bonnes pratiques d'architecture et de code laissées par le précédent développeur.
    Tout le code rendu doit être valide JSLint sans changer les directives en en-tête des fichiers (à moins d'être capable de justifier les modifications en soutenance).
    Soyez capable d'expliquer n'importe quelle partie du code en soutenance, même si ce n'est pas vous qui l'avez écrit à l'origine.
