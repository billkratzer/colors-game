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

    var authorLabel = game.add.text(game.width/2, game.height * .40,
      'By Bill Kratzer',
      FontBuilder.build('24', '#aaa')
    );
    authorLabel.anchor.setTo(0.5, 0.5);

    var highScoreLabel = game.add.text(game.width/2, game.height * .60,
      'High Score:  ' + HighScore.get(),
      FontBuilder.build('32', '#aaa')
    );
    highScoreLabel.anchor.setTo(0.5, 0.5);
    this.tweenTint(highScoreLabel, Phaser.Color.getColor(0,204,204), Phaser.Color.getColor(0,255,255), 2000);

    var startLabel = game.add.text(game.width/2, game.height - 100,
      'Press the Space Bar to Start!',
      FontBuilder.build('25', '#fff')
    );
    startLabel.anchor.setTo(0.5, 0.5);
    game.add.tween(startLabel).to({angle: -1}, 500).to({angle: 1}, 1000).to({angle: 0}, 500).loop().start();

    var versionLabel = game.add.text(game.width - 38, game.height - 36,
      'Version ' + game.VERSION,
      FontBuilder.build('16', '#aaa')
    );
    versionLabel.anchor.setTo(1, 1);

    var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.start, this);

  },

  tweenTint: function(obj, startColor, endColor, time) {
    // create an object to tween with our step value at 0
     var colorBlend = { step: 0 };
     // create the tween on this object and tween its step property to 100
     var colorTween = game.add.tween(colorBlend).to({step: 100}, time).to({step: 0}, time).loop();
     // run the interpolateColor function every time the tween updates, feeding it the
     // updated value of our tween each time, and set the result as our tint
     colorTween.onUpdateCallback(function() {
       obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);
     });
     // set the object to the start color straight away
     obj.tint = startColor;
     colorTween.start();

     return colorTween;
   },

  spawnNextBlock: function() {
    if (this.numberOfBlocks >= this.maxBlocks) {
      return;
    }
    var i = this.numberOfBlocks;
    var source = this.blockSource[i];
    var dest = this.blockDest[i];

    var sprite = game.add.sprite(source.x, source.y, game.rnd.pick(['aqua_block', 'blue_block', 'green_block', 'purple_block', 'red_block', 'orange_block', 'yellow_block']));
    sprite.anchor.setTo(0,0);
    sprite.data.dest = dest;
    sprite.data.deltaY = 50;

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
