var modal = false;

var playState = {

  initNewGame: function() {
    game.global = {
      level: 1,
      score: 0,

      blocksUntilNextLevel: 20,
      totalBlocksCleared: 0,

      pieceTimer: null,
      collapseTimer: null,
      collapseCycle: 0,

      marquee: {
        visible: false,
        graphics: null
      },

      showNextPiece: true,

      board: new GameBoard(9, 19),
      currentPiece: new GamePiece(true),
      nextPiece: new GamePiece(false)
    }

    this.initPieceTimer();
    game.global.board.print();
  },

  initPieceTimer: function() {
    if (game.global.pieceTimer) {
      game.global.pieceTimer.delay = GameSpeed.getSpeedForLevel(game.global.level);
    }
    else {
      game.global.pieceTimer = game.time.events.loop(GameSpeed.getSpeedForLevel(game.global.level), this.fallPiece, this);
    }
  },

  initKeyboard: function() {
    game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(this.keyLeft, this);
    game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(this.keyRight, this);
    game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(this.keyUp, this);
    game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(this.keyDown, this);

    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.keySpace, this);

    game.input.keyboard.addKey(Phaser.Keyboard.TAB).onDown.add(this.keyTab, this);
    game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.keyEscape, this);
    game.input.keyboard.addKey(Phaser.Keyboard.Q).onDown.add(this.keyQ, this);
    game.input.keyboard.addKey(Phaser.Keyboard.T).onDown.add(this.keyT, this);
  },

  createKeyHelp: function() {
    var y = 445;

    game.add.text(10, y, 'Keys', FontBuilder.build('22', '#eee'));
    y = y + 30;

    this.creatKeyHelpLabel(y, 'LEFT', 'Move piece left');
    y = y + 20;

    this.creatKeyHelpLabel(y, 'RIGHT', 'Move piece right');
    y = y + 20;

    this.creatKeyHelpLabel(y, 'DOWN', 'Move piece down');
    y = y + 20;

    this.creatKeyHelpLabel(y, 'UP', 'Rotate colors');
    y = y + 20;

    this.creatKeyHelpLabel(y, 'SPACE', 'Drop Piece');
    y = y + 40;

    this.creatKeyHelpLabel(y, 'ESC', 'Pause');
    y = y + 20;

    this.creatKeyHelpLabel(y, 'Q', 'Quit');
    y = y + 20;
  },

  creatKeyHelpLabel(y, key, message) {
    var keyLabel = game.add.text(55, y, key, FontBuilder.build('14', '#aaa'));
    keyLabel.anchor.setTo(1.0, 0.0);

    var messageLabel = game.add.text(65, y, message, FontBuilder.build('14', '#aaa'));
    messageLabel.anchor.setTo(0.0, 0.0);
  },

  createScoreBox: function() {
    console.log("Creating the score box!");
    this.scoreLabel = game.add.text(10, 10, '', FontBuilder.build('22', '#eee'));
    this.scoreLabel.anchor.setTo(0.0, 0.0);

    this.levelLabel = game.add.text(10, 50, '', FontBuilder.build('18', '#ccc'));
    this.levelLabel.anchor.setTo(0.0, 0.0);

    this.nextLevelLabel = game.add.text(10, 75, '', FontBuilder.build('18', '#ccc'));
    this.nextLevelLabel.anchor.setTo(0.0, 0.0);
  },

  createNextPieceBox: function() {
    this.nextPieceLabel = game.add.text(game.width * 5/6, 10, 'Next Piece', FontBuilder.build('22', '#eee'));
    this.nextPieceLabel.anchor.setTo(0.5, 0.0);
  },

  updateScoreBox: function() {
    this.scoreLabel.text = 'Score: ' + game.global.score;
    this.levelLabel.text = 'Level: ' + game.global.level;
    this.nextLevelLabel.text = 'Next Level in ' + game.global.blocksUntilNextLevel + ' Blocks';
  },

  create: function() {
    game.add.image(0, 0, 'game_background');

    this.createScoreBox();
    this.createNextPieceBox();
    this.createKeyHelp();

    this.initNewGame();
    this.initKeyboard();

    this.music = game.add.audio('music');
    this.music.loop = true;
    this.music.play();

    this.updateScoreBox();
    this.showMarquee(Marquees.START);
  },

  showMarquee: function(config) {
    m = game.global.marquee;
    m.visible = true;

    m.graphics = game.add.graphics(0, 0);
    m.graphics.beginFill(0x000000, 0.85);
    m.graphics.drawRect(0, 0, game.width, game.height);
    m.graphics.endFill();

    m.title = game.add.image(0 - game.width, game.height * .10, config.title_image_name);
    m.title.anchor.x = 0.5;
    m.title.anchor.y = 0;

    m.titleTween = game.add.tween(m.title).to({x: game.width/2}, 2000).easing(Phaser.Easing.Bounce.Out).start();

    m.helpLabel = game.add.text(game.width / 2, game.height * .40, config.help_text, FontBuilder.build('25', '#bbb'));
    m.helpLabel.anchor.setTo(0.5, 0.5);

    m.helpImage = game.add.image(game.width / 2, game.height * .60, config.help_image_name);
    m.helpImage.anchor.setTo(0.5, 0.5);
    m.helpImage.scale.setTo(0.5, 0.5);
    m.helpImage.alpha = 0;

    m.helpTween = game.add.tween(m.helpImage).to({alpha: 1.0}, 1000).start();

    m.startLabel = game.add.text(game.width / 2, game.height * .90, 'Press the Space Bar to Start!', { font: '32px Exo 2', fill: '#eee' });
    m.startLabel.anchor.setTo(0.5, 0.5);

    game.paused = true;
    game.input.keyboard.reset(true);
    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.hideMarquee, this);
  },

  pauseUpdate: function() {
    var m = game.global.marquee;
    if (m && m.visible) {
      m.titleTween.update();
      m.helpTween.update();
    }
  },

  hideMarquee: function() {
    var m = game.global.marquee;
    m.visible = false;

    if (m.title)  {
      m.title.destroy();
      m.title = null;
    }

    m.titleTween = null;

    if (m.helpLabel) {
      m.helpLabel.destroy();
      m.helpLabel = null;
    }

    if (m.helpImage) {
      m.helpImage.destroy();
      m.helpImage = null;
    }

    if (m.startLabel) {
      m.startLabel.destroy();
      m.startLabel = null;
    }

    if (m.graphics) {
      m.graphics.destroy();
      m.graphics = null;
    }

    game.paused = false;
    game.input.keyboard.reset(true);
    this.initKeyboard();
  },

  growBoard: function() {
    var board = game.global.board;
    if (!board.isTopRowEmpty()) {
      this.playerDie();
    }
    board.grow();
    this.lookForMatches();
    return;
  },

// The "T" key is simiply used to test things right now
  keyT: function() {
    this.levelUp();
    return;
    // game.camera.shake(0.08, 3000);


    var leftEmitter = game.add.emitter(500, 500);
    //leftEmitter.bounce.setTo(0.5, 0.5);
    leftEmitter.setXSpeed(-100, 100);
    leftEmitter.setYSpeed(-100, 100);
    leftEmitter.gravity = {x: 0, y:0};
    leftEmitter.makeParticles('red_particle', 0, 120, true, true);
    leftEmitter.setAlpha(1, .2, 500);
    leftEmitter.autoAlpha = true;
    leftEmitter.start(true, 1000, 0, 100);
    return;
  },

  keyQ: function() {
    if (game.paused) {
      return;
    }

    game.paused = true;

    var w = game.width;
    var h = game.height;

    var panel = game.add.sprite(w / 2, h / 4, 'popup_panel');
    panel.anchor.setTo(0.5, 0.5);

    var label = game.add.text(w / 2, h / 4, 'Quit Game?  (Y/N)', FontBuilder.build('32', '#eee'));
    label.anchor.setTo(0.5, 0.5);

    game.input.keyboard.reset(true);
    game.input.keyboard.addKey(Phaser.Keyboard.Y).onDown.add(this.keyY, this);
    game.input.keyboard.addKey(Phaser.Keyboard.N).onDown.add(this.keyN, this);

    this.quitPanel = {
     panel: panel,
     label: label
    }

  },

  keyY: function() {
    if (this.quitPanel) {
      game.paused = false;
      this.destroyQuitPanel();
      this.playerDie();
    }
  },

  keyN: function() {
    if (this.quitPanel) {
      game.paused = false;
      this.destroyQuitPanel();
      this.initKeyboard();
    }
  },

  keyTab: function() {
    game.global.showNextPiece = !game.global.showNextPiece;
    if (game.global.showNextPiece) {
      game.global.nextPiece.show();
    }
    else {
      game.global.nextPiece.hide();
    };
  },

  destroyQuitPanel: function() {
    var p = this.quitPanel;
    p.panel.destroy();
    p.label.destroy();
    this.quitPanel = null;
  },

  keyEscape: function() {
    game.paused = !game.paused;

    var w = game.width;
    var h = game.height;

    if (game.paused) {
       var panel = game.add.sprite(w / 2, h / 4, 'popup_panel');
       panel.anchor.setTo(0.5, 0.5);

       var label1 = game.add.text(w / 2, h / 4 - 10, 'Game Paused', FontBuilder.build('25', '#eee'));
       label1.anchor.setTo(0.5, 1.0);

       var label2 = game.add.text(w / 2, h / 4 + 10, 'Press ESC to resume.', FontBuilder.build('25', '#eee'));
       label2.anchor.setTo(0.5, 0.0);

       this.pausePanel = {
         panel: panel,
         label1: label1,
         label2: label2
       };

       game.input.keyboard.reset(true);
       game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.keyEscape, this);
    }
    else {
      this.pausePanel.panel.destroy();
      this.pausePanel.label1.destroy();
      this.pausePanel.label2.destroy();
      this.pausePanel = null;

      game.input.keyboard.reset(true);
      this.initKeyboard();
    }

  },

  keyLeft: function() {
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

  keyRight: function() {
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

  keyUp: function() {
    console.log("Up");
    var piece = game.global.currentPiece;
    piece.rotate();
  },

  keyDown: function() {
    console.log("Down");
    this.fallPiece();
  },

  keySpace: function() {
    console.log("Space");
    var piece = game.global.currentPiece;
    var board = game.global.board;

    while (true) {
      if (board.outOfBounds(piece, 0, 1) || board.collides(piece, 0, 1)) {
        board.addPiece(piece);
        this.newPiece();
        this.lookForMatches();
        return;
      }
      piece.moveDown();
    }
  },

  lookForMatches: function() {
    var board = game.global.board;
    var matches = board.findMatches();
    if ((!matches) || (matches.length == 0)) {
      game.global.collapseCycle = 0;
      return;
    }

    for (var block of matches) {
      block.sprite.destroy();
    }

    var count = matches.length;
    game.global.score = game.global.score + this.calcPoints(count, game.global.collapseCycle);
    game.global.blocksUntilNextLevel = game.global.blocksUntilNextLevel - count;
    game.global.totalBlocksCleared = game.global.totalBlocksCleared + count;

    if (game.global.blocksUntilNextLevel <= 0) {
      this.levelUp();
    }

    this.updateScoreBox();

    game.global.collapseCycle++;

    game.time.events.add(400, this.collapse, this);
  },

  collapse: function() {
    var board = game.global.board;
    var blocks = board.clearExploding();
    for (var block of blocks) {
      block.sprite.destroy();
    }
    board.collapse();

    this.lookForMatches();
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
      this.newPiece();
      this.lookForMatches();
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

  levelUp: function() {
    game.global.blocksUntilNextLevel = 20;
    game.global.level = game.global.level + 1;
    this.updateScoreBox();

    this.initPieceTimer();

    if (game.global.level == 2) {
      this.showMarquee(Marquees.BUCKLE_UP);
    }

    if (game.global.level == 5) {
      this.showMarquee(Marquees.BEWARE);
    }
  },

  newPiece: function() {
    var newPiece = game.global.nextPiece;
    if (game.global.board.collides(newPiece, 0,0)) {
      this.playerDie();
    }
    else {
      game.global.currentPiece = newPiece;
      game.global.currentPiece.setCurrent(true);
      game.global.currentPiece.show();
      game.global.nextPiece = new GamePiece(false);
      if (game.global.showNextPiece) {
        game.global.nextPiece.show();
      }
      else {
        game.global.nextPiece.hide();
      }
    }
  },

  calcPoints: function(numberOfBlocks, collapseCycle) {
      return game.global.level * numberOfBlocks * collapseCycle;
  }
}
