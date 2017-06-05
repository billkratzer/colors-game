var playState = {

  createWorld: function() {
    this.walls = game.add.group();
    this.walls.enableBody = true;

    game.add.sprite(0, 0, 'wallV', 0, this.walls);  // Left
    game.add.sprite(480, 0, 'wallV', 0, this.walls); // Right

    game.add.sprite(0, 0, 'wallH', 0, this.walls); // Top left
    game.add.sprite(300, 0, 'wallH', 0, this.walls); // Top right
    game.add.sprite(0, 320, 'wallH', 0, this.walls); // Bottom left
    game.add.sprite(300, 320, 'wallH', 0, this.walls); // Bottom right
    game.add.sprite(-100, 160, 'wallH', 0, this.walls); // Middle left
    game.add.sprite(400, 160, 'wallH', 0, this.walls); // Middle right

    var middleTop = game.add.sprite(100, 80, 'wallH', 0, this.walls); middleTop.scale.setTo(1.5, 1);
    var middleBottom = game.add.sprite(100, 240, 'wallH', 0, this.walls); middleBottom.scale.setTo(1.5, 1);

    // Set all the walls to be immovable
    this.walls.setAll('body.immovable', true);
  },

  create: function() {
    game.global.score = 0;

    game.stage.backgroundColor="#3498db";
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.renderer.renderSession.roundPixels = true;

    this.player = game.add.sprite(game.width/2, game.height/2, 'player');
    this.player.anchor.setTo(0.5, 0.5);

    game.physics.arcade.enable(this.player);
    this.player.body.gravity.y = 500;

    this.cursor = game.input.keyboard.createCursorKeys();

    this.createWorld();

    this.coin = game.add.sprite(60, 140, 'coin');
    this.coin.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(this.coin);

    this.enemies = game.add.group();
    this.enemies.enableBody = true;
    this.enemies.createMultiple(10, 'enemy');
    game.time.events.loop(2200, this.addEnemy, this);

    this.scoreLabel = game.add.text(30, 30, 'score: 0',
      {
        font: '18px Helvetica',
        fill: '#ffffff'
      }
    );
  },

  addEnemy: function() {
    var enemy = this.enemies.getFirstDead();
    if (!enemy) {
      return;
    }

    enemy.anchor.setTo(0.5, 1);
    enemy.reset(game.width/2, 0);
    enemy.body.gravity.y = 500;
    enemy.body.velocity.x = 100 * game.rnd.pick([-1,1]);
    enemy.body.bounce.x = 1;
    enemy.checkWorldBounds = true;
    enemy.outOfBoundsKill = true;
  },

  update: function() {
    game.physics.arcade.collide(this.player, this.walls);
    game.physics.arcade.collide(this.enemies, this.walls);
    game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
    game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);
    this.movePlayer();
    if (!this.player.inWorld) {
      this.playerDie();
    }
  },

  takeCoin: function(player, coin) {
    game.global.score += 5;
    this.scoreLabel.text = 'score: ' + game.global.score;

    var newX = game.rnd.integerInRange(0, game.width);
    var newY = game.rnd.integerInRange(0, game.height);

    this.coin.reset(newX, newY);
    this.coin.reset(newX, newY);
  },
  movePlayer: function() {
    if (this.cursor.left.isDown) {
      this.player.body.velocity.x = -200;
    }
    else if (this.cursor.right.isDown) {
      this.player.body.velocity.x = 200;
    }
    else {
      this.player.body.velocity.x = 0;
    }

    if (this.cursor.up.isDown && this.player.body.touching.down) {
      this.player.body.velocity.y = -320;
    }
  },
  playerDie: function() {
    game.state.start('menu');
  }

}
