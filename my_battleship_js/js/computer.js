/*jslint browser this */
/*global _, player */

(function (global) {
    "use strict";

    var computer = _.assign({}, player, {
        grid: [],
        tries: [],
        fleet: [],
        activeShip: 0,
        game: null,

        ////
        //// IA

        play: function () {
            var self = this;
            setTimeout(function () {
                var rdmX, rdmY, found = false;
                let whatLevel = localStorage.getItem("level");

                if (whatLevel === "hard") {
                    // Recherche d'une case proche d'un emplacement 'true'
                    for (var x = 0; x < 10 && !found; x++) {
                        for (var y = 0; y < 10 && !found; y++) {
                            if (self.tries[x][y] === true) {
                                var directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
                                for (var i = 0; i < directions.length && !found; i++) {
                                    var newX = x + directions[i][0];
                                    var newY = y + directions[i][1];
                                    if (newX >= 0 && newX < 10 && newY >= 0 && newY < 10 && self.tries[newX][newY] !== true && self.tries[newX][newY] !== false) {
                                        rdmX = newX;
                                        rdmY = newY;
                                        found = true;
                                    }
                                }
                            }
                        }
                    }

                    if (!found) {
                        do {
                            rdmX = Math.floor(Math.random() * 10);
                            rdmY = Math.floor(Math.random() * 10);
                        } while (self.tries[rdmX][rdmY] === true || self.tries[rdmX][rdmY] === false);
                    }
                }else {
                    // Tir aléatoire si aucun coup proche n'est possible
                    do {
                        rdmX = Math.floor(Math.random() * 10);
                        rdmY = Math.floor(Math.random() * 10);
                    } while (self.tries[rdmX][rdmY] === true || self.tries[rdmX][rdmY] === false);
                }


                self.game.fire(this, rdmY, rdmX, function (hasSucced) {
                    self.tries[rdmX][rdmY] = hasSucced;
                });

            }, 50);
        },



        isShipOk: function (callback) {
            this.fleet.forEach(function (ship) {
                var placed = false;
                while (!placed) {
                    var rdmAxe = Math.floor(Math.random() * 2);
                    var i = Math.floor(Math.random() * 10);
                    var j = Math.floor(Math.random() * 10);
                    var collision = false;

                    if (rdmAxe === 0) {
                        // Positionnement horizontal
                        if (j + ship.life <= 10) {
                            for (var count = 0; count < ship.life; count++) {
                                if (this.grid[i][j + count] !== 0) {
                                    collision = true;
                                    break;
                                }
                            }
                            if (!collision) {
                                for (let count = 0; count < ship.life; count++) {
                                    this.grid[i][j + count] = ship.getId();
                                }
                                placed = true;
                            }
                        }
                    } else {
                        // Positionnement vertical
                        if (i + ship.life <= 10) {
                            for (let count = 0; count < ship.life; count++) {
                                if (this.grid[i + count][j] !== 0) {
                                    collision = true;
                                    break;
                                }
                            }
                            if (!collision) {
                                for (let count = 0; count < ship.life; count++) {
                                    this.grid[i + count][j] = ship.getId();
                                }
                                placed = true;
                            }
                        }
                    }
                }
            }, this);

            setTimeout(function () {
                callback();
            }, 50);
        }


    });

    global.computer = computer;

}(this));