/*jslint browser this */
/*global _, player, computer, utils */

(function () {
    "use strict";

    var game = {
        PHASE_INIT_PLAYER: "PHASE_INIT_PLAYER",
        PHASE_INIT_OPPONENT: "PHASE_INIT_OPPONENT",
        PHASE_PLAY_PLAYER: "PHASE_PLAY_PLAYER",
        PHASE_PLAY_OPPONENT: "PHASE_PLAY_OPPONENT",
        PHASE_GAME_OVER: "PHASE_GAME_OVER",
        PHASE_WAITING: "waiting",

        currentPhase: "",
        phaseOrder: [],
        // garde une référence vers l'indice du tableau phaseOrder qui correspond à la phase de jeu pour le joueur humain
        playerTurnPhaseIndex: 2,

        // l'interface utilisateur doit-elle être bloquée ?
        waiting: false,

        // garde une référence vers les noeuds correspondant du dom
        grid: null,
        miniGrid: null,

        // liste des joueurs
        players: [],

        // lancement du jeu
        init: function () {

            // initialisation
            this.grid = document.querySelector('.board .main-grid');
            this.miniGrid = document.querySelector('.mini-grid');

            // défini l'ordre des phase de jeu
            this.phaseOrder = [
                this.PHASE_INIT_PLAYER,
                this.PHASE_INIT_OPPONENT,
                this.PHASE_PLAY_PLAYER,
                this.PHASE_PLAY_OPPONENT,
                this.PHASE_GAME_OVER
            ];
            // initialise les joueurs
            this.setupPlayers();

            // ajoute les écouteur d'événement sur la grille
            this.addListeners();

            this.addListenersLevel();

            // c'est parti !
            this.goNextPhase();
        },
        setupPlayers: function () {
            // donne aux objets player et computer une réference vers l'objet game
            player.setGame(this);
            computer.setGame(this);

            // todo : implémenter le jeu en réseaux
            this.players = [player, computer];

            this.players[0].init();
            this.players[1].init();
        },
        goNextPhase: function () {
            // récupération du numéro d'index de la phase courante
            var ci = this.phaseOrder.indexOf(this.currentPhase);
            var self = this;

            if (ci !== this.phaseOrder.length - 1) {
                this.currentPhase = this.phaseOrder[ci + 1];
            } else {
                this.currentPhase = this.phaseOrder[0];
            }

            switch (this.currentPhase) {
            case this.PHASE_GAME_OVER:
                // detection de la fin de partie
                if (!this.gameIsOver()) {
                    // le jeu n'est pas terminé on recommence un tour de jeu
                    this.currentPhase = this.phaseOrder[this.playerTurnPhaseIndex - 1];
                    this.goNextPhase();
                    break;
                }
                break;
            case this.PHASE_INIT_PLAYER:
                utils.info("Placez vos bateaux");
                break;
            case this.PHASE_INIT_OPPONENT:
                this.wait();
                utils.info("En attente de votre adversaire");
                this.players[1].isShipOk(function () {
                    self.stopWaiting();
                    self.showStartOptions();
                });
                break;
            case this.PHASE_PLAY_PLAYER:
                utils.info("A vous de jouer, choisissez une case !");
                break;
            case this.PHASE_PLAY_OPPONENT:
                utils.info("A votre adversaire de jouer...");
                this.players[1].play();
                break;
            }
        },
        gameIsOver: function () {
            var isPlayerKo = 0;
            var isComputerKo = 0;

            for(let i = 0; i<this.players[0].fleet.length;i++){
                if(this.players[0].fleet[i].life===0){
                    isPlayerKo +=1;
                }
            }
            for(let i = 0; i<this.players[1].fleet.length;i++){
                if(this.players[1].fleet[i].life===0){
                    isComputerKo +=1;
                }
            }
            if(isPlayerKo===4){
                 if(confirm("You loose ❌  Do you wan't to retry ?")){
                     window.location.reload();
                 }
                return true;
            }
            if(isComputerKo===4){
                if(confirm("You win ! ✅  Do you wan't to retry ?")){
                    window.location.reload();
                }
                return true;
            }
            return false;
        },
        getPhase: function () {
            if (this.waiting) {
                return this.PHASE_WAITING;
            }
            return this.currentPhase;
        },
        // met le jeu en mode "attente" (les actions joueurs ne doivent pas être pris en compte si le jeu est dans ce mode)
        wait: function () {
            this.waiting = true;
        },
        // met fin au mode mode "attente"
        stopWaiting: function () {
            this.waiting = false;
        },
        addListeners: function () {
            // on ajoute des acouteur uniquement sur la grid (délégation d'événement)
            this.grid.addEventListener('mousemove', _.bind(this.handleMouseMove, this));
            this.grid.addEventListener('click', _.bind(this.handleClick, this));
            this.grid.addEventListener('contextmenu', function (e) {
                e.preventDefault(); // Empêcher le menu contextuel
                var ship = this.players[0].fleet[this.players[0].activeShip];
               ship.isVertical = !ship.isVertical;

                var height = ship.dom.style.height;
                var width = ship.dom.style.width;
                if (ship.isVertical) {
                    ship.dom.style.height=width;
                    ship.dom.style.width=height;
                } else {
                    ship.dom.style.height=width;
                    ship.dom.style.width=height;
                }
            }.bind(this));

        },

        addListenersLevel: function () {
            document.getElementById('easy').addEventListener('click', this.whatLevel.bind("easy"));
            document.getElementById('hard').addEventListener('click', this.whatLevel.bind("hard"));
        },

        whatLevel: function(input) {
            if(input.srcElement.id === "easy"){
                localStorage.setItem("level", "easy");
            } else if(input.srcElement.id === "hard"){
                localStorage.setItem("level", "hard");
            }

            if(input.srcElement.id ==="easy"){
                document.getElementById("easy").style.backgroundColor="seagreen"
                document.getElementById("hard").style.backgroundColor="white"
            }else if(input.srcElement.id ==="hard"){
                document.getElementById("easy").style.backgroundColor="white"
                document.getElementById("hard").style.backgroundColor="indianred"
            }
        },

        showStartOptions: function() {
            document.getElementsByClassName('popup')[0].style.display = 'flex';

            document.getElementById('startPlayer').addEventListener('click', this.whoStartFunction.bind(this));
            document.getElementById('startOpponent').addEventListener('click', this.whoStartFunction.bind(this));
            document.getElementById('startRandom').addEventListener('click', this.whoStartFunction.bind(this));
        },

        whoStartFunction: function(e) {
            var clickedElement = e.target;

            if(clickedElement.id === 'startPlayer') {
                this.currentPhase = this.phaseOrder[3];
            } else if(clickedElement.id === 'startOpponent') {
                this.currentPhase = this.phaseOrder[2];
            } else if(clickedElement.id === 'startRandom') {
                var rdmNb =  Math.floor(Math.random() * 2);
                this.currentPhase = this.phaseOrder[rdmNb+2];
            }

            document.getElementsByClassName('popup')[0].style.display = 'none';
            this.players[0].clearPreview();
            this.goNextPhase();
        },
        handleMouseMove: function (e) {
            // on est dans la phase de placement des bateau
            if (this.getPhase() === this.PHASE_INIT_PLAYER && e.target.classList.contains('cell')) {
                var ship = this.players[0].fleet[this.players[0].activeShip];

                // si on a pas encore affiché (ajouté aux DOM) ce bateau
                if (!ship.dom.parentNode) {
                    this.grid.appendChild(ship.dom);
                    // passage en arrière plan pour ne pas empêcher la capture des événements sur les cellules de la grille
                    ship.dom.style.zIndex = -1;
                }

                // décalage visuelle, le point d'ancrage du curseur est au milieu du bateau
                ship.dom.style.top = "" + (utils.eq(e.target.parentNode) * utils.CELL_SIZE ) + "px";
                ship.dom.style.left = "" + utils.eq(e.target)   * utils.CELL_SIZE + "px";
            }
        },
        handleClick: function (e) {
            // self garde une référence vers "this" en cas de changement de scope
            var self = this;

            // si on a cliqué sur une cellule (délégation d'événement)
            if (e.target.classList.contains('cell')) {
                // si on est dans la phase de placement des bateau
                if (this.getPhase() === this.PHASE_INIT_PLAYER) {
                    // on enregistre la position du bateau, si cela se passe bien (la fonction renvoie true) on continue
                    if (this.players[0].setActiveShipPosition(utils.eq(e.target), utils.eq(e.target.parentNode))) {
                        // et on passe au bateau suivant (si il n'y en plus la fonction retournera false)
                        if (!this.players[0].activateNextShip()) {
                            this.wait();
                            utils.confirm("Confirmez le placement ?", function () {
                                // si le placement est confirmé
                                self.stopWaiting();
                                self.renderMiniMap();
                                self.players[0].clearPreview();
                                self.goNextPhase();
                            }, function () {
                                self.stopWaiting();
                                // sinon, on efface les bateaux (les positions enregistrées), et on recommence
                                self.players[0].resetShipPlacement();
                            });
                        }
                    }
                // si on est dans la phase de jeu (du joueur humain)
                } else if (this.getPhase() === this.PHASE_PLAY_PLAYER) {
                    this.players[0].play(utils.eq(e.target), utils.eq(e.target.parentNode));
                }
            }
        },

        // fonction utlisée par les objets représentant les joueurs (ordinateur ou non)
        // pour placer un tir et obtenir de l'adversaire l'information de réusssite ou non du tir
        fire: function (from, col, line, callback) {

            this.wait();
            var self = this;

            var msg = "";
            var isShot=self.grid.querySelector('.row:nth-child(' + (line + 1) + ') .cell:nth-child(' + (col + 1) + ')');
            var boatIdIsShotOrdi =this.players[0].grid[line][col];
            var boatIdIsShotPlayer =this.players[1].grid[line][col];
            // determine qui est l'attaquant et qui est attaqué
            var target = this.players.indexOf(from) === 0 ?
                this.players[1] :
                this.players[0];

            if (this.currentPhase === this.PHASE_PLAY_OPPONENT) {
                msg += "Votre adversaire vous a... ";
            }


            // on demande à l'attaqué si il a un bateaux à la position visée
            // le résultat devra être passé en paramètre à la fonction de callback (3e paramètre)
            target.receiveAttack(col, line, function (hasSucceed) {

                var cell;
                var touch = new Audio('../my_battleship_sources/asset/explosion.mp3');
                var miss = new Audio('../my_battleship_sources/asset/plouf.wav');
                if( isShot.style.backgroundColor !== "grey" && isShot.style.backgroundColor !== "red"){
                    if (hasSucceed) {
                        msg += "Touché !";
                        touch.play();

                        if(self.currentPhase === "PHASE_PLAY_OPPONENT"){
                            cell=self.miniGrid.querySelector('.row:nth-child(' + (line + 1) + ') .cell:nth-child(' + (col + 1) + ')');
                            cell.classList.add('explosion-effect');
                            cell.innerText = "X";

                            for(let i =0;i<self.players[0].fleet.length;i++){
                                if(self.players[0].fleet[i].id===boatIdIsShotOrdi){
                                    self.players[0].fleet[i].setLife(self.players[0].fleet[i].life-1);
                                    if(self.players[0].fleet[i].life===0){
                                        document.getElementsByClassName(self.players[1].fleet[i].name.toLowerCase())[0].classList.add('sunk');
                                    }
                                }
                            }

                        }else{
                            cell=self.grid.querySelector('.row:nth-child(' + (line + 1) + ') .cell:nth-child(' + (col + 1) + ')');
                            cell.classList.add('explosion2-effect');
                            cell.style.backgroundColor = "red";

                            for(let i =0;i<self.players[1].fleet.length;i++){
                                if(self.players[1].fleet[i].id===boatIdIsShotPlayer){
                                    self.players[1].fleet[i].setLife(self.players[1].fleet[i].life-1);
                                }
                            }
                        }

                    } else {
                        miss.play();
                        msg += "Manqué...";
                        if(self.currentPhase === "PHASE_PLAY_OPPONENT"){
                            cell=self.miniGrid.querySelector('.row:nth-child(' + (line + 1) + ') .cell:nth-child(' + (col + 1) + ')');
                            cell.classList.add('water-splash-effect');
                            if(cell.innerText!=="X"){
                                cell.innerText = "O";
                            }
                        }else{
                            cell=self.grid.querySelector('.row:nth-child(' + (line + 1) + ') .cell:nth-child(' + (col + 1) + ')');
                            cell.classList.add('water-splash-effect');
                            cell.style.backgroundColor = "grey";
                        }
                    }


                }else{
                        msg += "Dommage, vous avez déjà tiré à cet endroit... Faites attention la prochaine fois !";
                }


                utils.info(msg);

                // on invoque la fonction callback (4e paramètre passé à la méthode fire)
                // pour transmettre à l'attaquant le résultat de l'attaque
                callback(hasSucceed);

                // on fait une petite pause avant de continuer...
                // histoire de laisser le temps au joueur de lire les message affiché
                setTimeout(function () {
                    self.stopWaiting();
                    self.goNextPhase();
                }, 50);
            });

        },
        renderMap: function () {
            this.players[0].renderTries(this.grid);
        },
            renderMiniMap: function () {
                if (!this.miniGrid) {
                    return;
                }
                var miniCells = this.miniGrid.querySelectorAll('.cell');
                miniCells.forEach(function (cell) {
                    cell.style.backgroundColor = '';
                });

                console.log(this.players[1].grid);

                this.players[0].fleet.forEach(function (ship) {
                    ship.position.forEach(function (pos) {

                        var cellIndex;
                        if (ship.isVertical) {
                            cellIndex = pos[1] * 10 + pos[0];
                        } else {
                            cellIndex = (pos[1] * 10 + pos[0]) ;
                        }

                        var cell = miniCells[cellIndex];
                        if (cell) {
                            cell.style.backgroundColor = ship.color;
                        }
                    });
                });
            },





    };

    // point d'entrée
    document.addEventListener('DOMContentLoaded', function () {
        game.init();
    });

}());