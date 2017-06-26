var menuState = {

  preload: function() {
    this.numberOfBlocks = 0;
    this.maxBlocks = 0;

    this.blockSource = [];
    this.blockDest = [];

    this.currentBlock = null;

    for (i = 0; i < game.height / 32; i++) {
      this.blockSource.push({
        x: 0,
        y: 0 - 32
      });
      this.blockDest.push({
        x: 0,
        y: game.height - (i + 1) * 32
      });
      this.maxBlocks++;
    }

    for (i = 1; i < game.width / 32 - 1; i++) {
      this.blockSource.push({
        x: i * 32,
        y: 0 - 32
      });
      this.blockDest.push({
        x: i * 32,
        y: game.height - 32
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

    for (i = 0; i < game.height / 32; i++) {
      this.blockSource.push({
        x: game.width - 32,
        y: 0 - 32
      });
      this.blockDest.push({
        x: game.width - 32,
        y: game.height - (i + 1) * 32
      });
      this.maxBlocks++;
    }


  },

  createTitleText: function() {
    var title = game.add.image(game.width/2, game.height / 6, 'colors_logo');
    title.anchor.x = 0.5;
    title.anchor.y = 0;
    title.scale.x = 0.5;
    title.scale.y = 0.5;

    var authorLabel = game.add.text(game.width/2, game.height * 2/5,
      'By Bill Kratzer',
      { font: '24px Exo 2', fill: '#aaa' }
    );
    authorLabel.anchor.setTo(0.5, 0.5);

    // var scoreLabel = game.add.text(game.width/2, game.height/2,
    //   'Score: ' + game.global.score,
    //   { font: '25px Helvetica', fill: '#ffffff' }
    // );
    // scoreLabel.anchor.setTo(0.5, 0.5);

    var startLabel = game.add.text(game.width/2, game.height - 80,
      'Press the Space Bar to Start!',
      { font: '25px Exo 2', fill: '#eee' }
    );
    startLabel.anchor.setTo(0.5, 0.5);
    game.add.tween(startLabel).to({angle: -2}, 500).to({angle: 2}, 1000).to({angle: 0}, 500).loop().start();

    var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.start, this);
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

    this.music = game.add.audio('intro-music');
    this.music.loop = true;
    this.music.play();
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
    this.music.stop();
    game.state.start('play');
  }

}
