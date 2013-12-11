(function(root) {
	var Minesweeper = root.Minesweeper = (root.Minesweeper || {});
	
	var Tile = Minesweeper.Tile = function() {
		this.isMine = false;
		this.flagged = false;
		this.closeMineCount = 0;
		this.revealed = false;
	};
})(this);