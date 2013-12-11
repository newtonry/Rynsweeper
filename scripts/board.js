(function(root) {
	var Minesweeper = root.Minesweeper = (root.Minesweeper || {});
	
	var Board = Minesweeper.Board = function(size, numMines) {
		this.size = size || 8;
	  this.numMines = numMines || 10;
		this.coordMods = [[1, 1], [0, 1], [1, -1], [-1, 0], [-1, -1], [0, -1], [-1, 1], [1, 0]];
	};
	
	Board.prototype.generateBoard = function() {
		this.grid = [];

		//fills the grid with empty Tiles
		for(var x = 0; x < this.size; x++) {
			this.grid.push([]);
			for(var y = 0; y < this.size; y++) {
				this.grid[x].push(new Minesweeper.Tile());
			}
		}
		
		this.minePositions = this.getMinePositions();

		//plants the mines
		for(var i = 0; i < this.minePositions.length; i++) {			
			var x = this.minePositions[i][0];
			var y = this.minePositions[i][1];
			this.grid[x][y].isMine = true;
		}

		//fills in the nearby mine count
		for(var x = 0; x < this.size; x++) {
			for(var y = 0; y < this.size; y++) {
				this.grid[x][y].closeMineCount = this.getSurroundingBombCount(x, y);
			}
		}
	};
	
	Board.prototype.getMinePositions = function() {
		var mines = [];
		while (mines.length < this.numMines) {
			var minePos = this.getRandomSquare();
			
			while (this.containsPosition(mines, minePos)) {
				minePos = this.getRandomSquare();
			}

			mines.push(minePos);
		}
		return mines;
	};
	
	Board.prototype.getRandomSquare = function() {
		return [Math.floor(Math.random() * this.size), Math.floor(Math.random() * this.size)];
	};
	
	//checks to make sure positions aren't duplicated
	Board.prototype.containsPosition = function(positions, pos) {
		for(var i = 0; i < positions.length; i++) {
			if (pos[0] === positions[i][0] && pos[1] === positions[i][1])
			return true;
		}
		return false;
	};
	
	Board.prototype.isTileMine = function(x,y) {
		return this.grid[x][y].isMine;
	};

	Board.prototype.revealTile = function(x,y) {
		this.grid[x][y].revealed = true;
		if (this.grid[x][y].closeMineCount === 0 && !this.grid[x][y].isMine) {
			for (var i = 0; i < this.coordMods.length; i++) {
				var xPos = x + this.coordMods[i][0];
				var yPos = y + this.coordMods[i][1];
								
				if (this.grid[xPos] && this.grid[xPos][yPos] && !this.grid[xPos][yPos].revealed) {
					this.revealTile(xPos, yPos);
				}
			}
		}
	};
	
	Board.prototype.flagTile = function(x,y) {
		if ((!this.grid[x][y].revealed || this.grid[x][y].isMine) && this.getFlagsLeft() > 0) { //the isMine allows the user to win if cheating
			this.grid[x][y].flagged = !this.grid[x][y].flagged; //flags & unflags
		}
		
		
	};
	
	
	Board.prototype.showMines = function(revealed) {
		for(var i = 0; i < this.minePositions.length; i++) {
			this.grid[this.minePositions[i][0]][this.minePositions[i][1]].revealed = revealed;
		}
	};
	
	Board.prototype.getSurroundingBombCount = function(x,y) {
		var mineCount = 0;

		for (var i = 0; i < this.coordMods.length; i++) {
			var xPos = x + this.coordMods[i][0];
			var yPos = y + this.coordMods[i][1];
		
			if (this.grid[xPos] && this.grid[xPos][yPos] && this.grid[xPos][yPos].isMine) {
				mineCount += 1;
			}
		}
		return mineCount;
	};
	
	Board.prototype.getFlagsUsed = function() {
		var flagsCount = 0;
		for(var x = 0; x < this.size; x++) {
			for(var y = 0; y < this.size; y++) {
				if (this.grid[x][y].flagged) {
					flagsCount +=1;
				}
			}
		}
		return flagsCount;
	};
	
	Board.prototype.getFlagsLeft = function() {
		return this.numMines - this.getFlagsUsed();
	}
	
	//checks to see if all the mines are flagged
	Board.prototype.isGameWon = function() {
		for(var i = 0; i < this.minePositions.length; i++) {
			var x = this.minePositions[i][0];
			var y = this.minePositions[i][1];
			if (!this.grid[x][y].flagged) {
				return false;
			}
		}
		return true
	};
	
})(this);