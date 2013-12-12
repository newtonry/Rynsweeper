(function(root) {
	var Minesweeper = root.Minesweeper = (root.Minesweeper || {});

	//add options
	var Game = Minesweeper.Game = function() {};
	
	Game.prototype.start = function(canvas) {
		this.board = new Minesweeper.Board();
		this.board.generateBoard();
		this.canvas = canvas;
		this.setupCanvas();
	};
	
	Game.prototype.setupCanvas = function() {
		for(var x = 0; x < this.board.size; x++) {
		  this.canvas.find("#board").append("<div id='row-" + x + "' class='row'></div>");
			for(var y = 0; y < this.board.size; y++) {
			  this.canvas.find("#row-" + x).append("<div id='tile-" + x + "-" + y + "' class='tile' data-x='" + x + "' data-y='" + y + "'></div>");
			}
		}

		var borderWidthTotal = 2 * parseInt($(".tile").css('border-width'));
		var blockSize = this.canvas.find("#board").width() / this.board.size;
		this.canvas.find(".row").height(blockSize);


		this.canvas.find(".tile").width(blockSize - borderWidthTotal);
		this.canvas.find(".tile").height(blockSize - borderWidthTotal);
		
		this.printGame();
		
		this.setupButtons();
	};

	Game.prototype.setupButtons = function() {
		var that = this;
		
		this.canvas.bind("contextmenu", function(e) {
		    return false;
		});

		this.canvas.find(".tile").mousedown(function(e) {
			switch (e.which) {
        case 1:
						that.leftClickTile(e.target);
            break;
        case 3:
            that.rightClickTile(e.target);
            break;
			 }
		});
		
		this.canvas.delegate('.reveal-mines', 'click', function() {
			$(this).removeClass('reveal-mines').addClass('hide-mines');
			$(this).html("Hide Mines");
			that.board.showMines(true);
			that.printGame();
		});
		
		this.canvas.delegate('.hide-mines', 'click', function() {
			$(this).removeClass('hide-mines').addClass('reveal-mines');
			$(this).html("Reveal Mines");
			that.board.showMines(false);
			that.printGame();
		});
				
		this.canvas.find("#smiley-button").click(function() {			
			if (that.board.isGameWon()) {
				that.endGame("success", "You win!");
			} else {
				that.endGame("fail", "You lose!");
			}
		});
	};
	
	Game.prototype.leftClickTile = function(uiTile) {
		var x = this.canvas.find(uiTile).data('x');
		var y = this.canvas.find(uiTile).data('y');
		
		if (!this.board.grid[x][y].flagged) {
			this.board.revealTile(x, y);
			
			if (this.board.isTileMine(x,y)) {
				$(uiTile).addClass('hit-mine');
				this.endGame("fail", "You've exploded!");
			}
		
			this.printGame();
		}
	};

	Game.prototype.rightClickTile = function(uiTile) {
		var x = this.canvas.find(uiTile).data('x');
		var y = this.canvas.find(uiTile).data('y');
		
		this.board.flagTile(x,y);		
		this.printGame();
	}
	
	Game.prototype.endGame = function(outcome, message) {		
		if (outcome === "success") {
			this.canvas.find("#top-nav").addClass("success");
		} else if (outcome === "fail") {
			this.canvas.find('.face').css("background-position", "center -50px");
			this.canvas.find("#top-nav").addClass("fail");
		}
		this.canvas.find("#alert-message").html(message);
		
	};
	
	Game.prototype.printGame = function() {
		this.printBoard();
		this.printTopNav();
	};
	
	Game.prototype.printBoard = function() {
		for(var x = 0; x < this.board.size; x++) {
			for(var y = 0; y < this.board.size; y++) {
				var tile = this.board.grid[x][y];
				var tileDiv = $("#tile-" + x + "-" + y);
			 	tileDiv.removeClass('revealed mine flagged');
			 
			  if (tile.revealed) {
					tileDiv.addClass('revealed');
					if (tile.isMine) {
						tileDiv.addClass('mine');
					} else {
						var closeMineCount = tile.closeMineCount;
						tileDiv.addClass('nearMines-' + closeMineCount);
						tileDiv.html("<p class='cell'>" + closeMineCount + "</p>");
					}
				}
				
				if (tile.flagged) {
					tileDiv.addClass('flagged');						
				}
			}
		}
	};
	
	Game.prototype.printTopNav = function() {
		this.canvas.find('.flags-left').html(this.board.getFlagsLeft());
	};
	
})(this);