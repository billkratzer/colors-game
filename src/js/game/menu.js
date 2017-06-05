var menuState = {

  preload: function() {
    this.numberOfBlocks = 0;
    this.maxBlocks = 0;

    this.blockSource = [];
    this.blockDest = [];

    this.currentBlock = null;

    for (i = 0; i < 480 / 32; i++) {
      this.blockSource.push({
        x: 0,
        y: 0 - 32
      });
      this.blockDest.push({
        x: 0,
        y: 480 - (i + 1) * 32
      });
      this.maxBlocks++;
    }

    for (i = 1; i < 640 / 32 - 1; i++) {
      this.blockSource.push({
        x: i * 32,
        y: 0 - 32
      });
      this.blockDest.push({
        x: i * 32,
        y: 480 - 32
      });
      this.maxBlocks++;

      this.blockSource.push({
        x: i * 32,
        y: 0 - 32
      });
      this.blockDest.push({
        x: i * 32,
        y: 0
      });
      this.maxBlocks++;
    }

    for (i = 0; i < 480 / 32; i++) {
      this.blockSource.push({
        x: 640 - 32,
        y: 0 - 32
      });
      this.blockDest.push({
        x: 640 - 32,
        y: 480 - (i + 1) * 32
      });
      this.maxBlocks++;
    }


  },

  createTitleText: function() {
    var nameLabel = game.add.text(game.width/2, 80,
      'Colors',
      { font: '50px Helvetica', fill: '#ffffff' }
    );
    nameLabel.anchor.setTo(0.5, 0.5);

    var scoreLabel = game.add.text(game.width/2, game.height/2,
      'Score: ' + game.global.score,
      { font: '25px Helvetica', fill: '#ffffff' }
    );
    scoreLabel.anchor.setTo(0.5, 0.5);

    var startLabel = game.add.text(game.width/2, game.height - 80,
      'Press the UP Arrow Key to Start!',
      { font: '25px Helvetica', fill: '#ffffff' }
    );
    startLabel.anchor.setTo(0.5, 0.5);

    var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    upKey.onDown.add(this.start, this);
  },

  spawnNextBlock: function() {
    if (this.numberOfBlocks >= this.maxBlocks) {
      return;
    }
    var i = this.numberOfBlocks;
    var source = this.blockSource[i];
    var dest = this.blockDest[i];

    var sprite = game.add.sprite(source.x, source.y, game.rnd.pick(['aqua_block', 'blue_block', 'green_block', 'purple_block', 'red_block', 'white_block', 'yellow_block']));
    sprite.anchor.setTo(0,0);
    sprite.data.dest = dest;
    sprite.data.deltaY = 50;

    game.physics.arcade.enable(sprite);

    this.currentBlock = sprite;
    this.numberOfBlocks++;
  },

  create: function() {
    game.add.image(0, 0, 'menu_background');

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.renderer.renderSession.roundPixels = true;

    this.spawnNextBlock();

    this.createTitleText();
  },

  update: function() {
    var sprite = this.currentBlock;
    if (sprite) {
      sprite.y = sprite.y + sprite.data.deltaY;
      if (sprite.y > sprite.data.dest.y) {
        sprite.y = sprite.data.dest.y;
        this.spawnNextBlock();
      }
    }
  },

  start: function() {
    game.state.start('play');
  }

}
