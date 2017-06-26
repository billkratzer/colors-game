var playState = {

  initNewGame: function() {
    game.global = {
      level: 1,
      score: 0,

      pieceTimer: null,

      board: new GameBoard(9, 19),
      currentPiece: new GamePiece()
    }

    game.global.pieceTimer = game.time.events.loop(1000, this.fallPiece, this);
    game.global.board.print();
  },

  initKeyboard: function() {
    var leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    leftKey.onDown.add(this.goLeft, this);

    var rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    rightKey.onDown.add(this.goRight, this);

    var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    upKey.onDown.add(this.goUp, this);

    var downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    downKey.onDown.add(this.goDown, this);

    var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.goSpace, this);
  },

  createScoreBox: function() {
    this.scoreLabel = game.add.text(game.width - 10, 10,
      'Score: 0',
      { font: '18px Helvetica', fill: '#aaa' }
    );
    this.scoreLabel.anchor.setTo(1.0, 0.0);
  },

  updateScoreBox: function() {
    this.scoreLabel.text = 'Score: ' + game.global.score;
  },

  create: function() {
    game.add.image(0, 0, 'game_background');

    this.createScoreBox();

    this.initNewGame();
    this.initKeyboard();

    this.music = game.add.audio('music');
    this.music.loop = true;
    this.music.play();
  },

  goLeft: function() {
    console.log("Left");
    var piece = game.global.currentPiece;
    var board = game.global.board;
    if (board.outOfBounds(piece, -1, 0)) {
      return;
    }

    if (board.collides(piece, -1, 0)) {
      return;
    }

    piece.moveLeft();
  },

  goRight: function() {
    console.log("Right");
    var piece = game.global.currentPiece;
    var board = game.global.board;
    if (board.outOfBounds(piece, 1, 0)) {
      return;
    }

    if (board.collides(piece, 1, 0)) {
      return;
    }
    piece.moveRight();
  },

  goUp: function() {
    console.log("Up");
    var piece = game.global.currentPiece;
    piece.rotate();
  },

  goDown: function() {
    console.log("Down");
    this.fallPiece();
  },

  goSpace: function() {
    console.log("Space");
    var piece = game.global.currentPiece;
    var board = game.global.board;

    while (true) {
      if (board.outOfBounds(piece, 0, 1) || board.collides(piece, 0, 1)) {
        board.addPiece(piece);
        this.lookForMatches();
        this.newPiece();
        return;
      }
      piece.moveDown();
    }
  },

  lookForMatches: function() {
    var board = game.global.board;
    var matches = board.findMatches();

    var cycle = 1;
    while (matches && matches.length > 0) {
      for (var block of matches) {
        block.sprite.destroy();
      }
      board.collapse();

      game.global.score = game.global.score + this.calcPoints(matches.length, cycle);
      this.updateScoreBox();

      matches = board.findMatches();
      cycle++;
    }
  },

  fallPiece: function() {
    var piece = game.global.currentPiece;
    var board = game.global.board;
    if (board.outOfBounds(piece, 0, 1)) {
      board.addPiece(piece);
      this.newPiece();
      return;
    }

    if (board.collides(piece, 0, 1)) {
      board.addPiece(piece);
      this.lookForMatches();
      this.newPiece();
      return;
    }
    piece.moveDown();
  },

  update: function() {
  },

  playerDie: function() {
    this.music.stop();
    game.state.start('menu');
  },

  newPiece: function() {
    var newPiece = new GamePiece();
    if (game.global.board.collides(newPiece, 0,0)) {
      this.playerDie();
    }
    else {
      game.global.currentPiece = newPiece;
    }
  },

  calcPoints: function(numberOfBlocks, collapseCycle) {
      return game.global.level * numberOfBlocks * collapseCycle;
  }
}
