var Player = require('./player.js');
var Settings = require('./settings.js');

/**
 * BattleshipGame constructor
 * @param {type} id Game ID
 * @param {type} idPlayer1 Socket ID of player 1
 * @param {type} idPlayer2 Socket ID of player 2
 */
function BattleshipGame(id, idPlayer1, idPlayer2) {
  this.id = id;
  this.currentPlayer = 0;
  this.gameState = 1;

  this.players = [new Player(idPlayer1), new Player(idPlayer2)];
}

/**
 * ID of this game
 * @returns {Number} Game ID
 */
BattleshipGame.prototype.getId = function() {
  return this.id;
};

/**
 * Get socket ID of player
 * @param {type} player
 * @returns {undefined}
 */
BattleshipGame.prototype.getPlayerId = function(player) {
  return this.players[player].id;
};

/**
 * Check whose turn it is.
 * @returns {Number} Current player
 */
BattleshipGame.prototype.getCurrentPlayer = function() {
  return this.currentPlayer;
};

/**
 * Switch turns
 */
BattleshipGame.prototype.switchPlayer = function() {
  this.currentPlayer = this.currentPlayer === 0 ? 1 : 0;
};

/**
 * Fire shot for current player
 * @param {Object} position with x and y
 * @returns {boolean} True if shot was valid
 */
BattleshipGame.prototype.shoot = function(position) {
  var opponent = this.currentPlayer === 0 ? 1 : 0,
      gridIndex = position.y * Settings.gridCols + position.x;

  if(this.players[opponent].shots[gridIndex] === 0) {
    // Square has not been shot at yet. Check if hit
    this.players[opponent].shots[gridIndex] = 1;
    this.switchPlayer();
    
    return true;
  }

  return false;
};

/**
 * Get game state update (for one grid).
 * @param {Number} player Player who is getting this update
 * @param {Number} gridOwner Player whose grid state to update
 * @returns {BattleshipGame.prototype.getGameState.battleshipGameAnonym$0}
 */
BattleshipGame.prototype.getGameState = function(player, gridOwner) {
  return {
    turn: this.getCurrentPlayer() === player,            // is it this player's turn?
    gridIndex: player === gridOwner ? 0 : 1,             // which client grid to update (0 = own, 1 = opponent)
    grid: this.getGrid(gridOwner, player !== gridOwner)  // hide unsunk ships if this is not own grid
  };
};

/**
 * Get grid with ships for a player.
 * @param {type} player Which player's grid to get
 * @param {type} hideShips Hide unsunk ships
 * @returns {BattleshipGame.prototype.getGridState.battleshipGameAnonym$0}
 */
BattleshipGame.prototype.getGrid = function(player, hideShips) {
  return {
    shots: this.players[player].shots,
    ships: hideShips ? this.players[player].getSunkShips() : this.players[player].ships
  };
};

module.exports = BattleshipGame;