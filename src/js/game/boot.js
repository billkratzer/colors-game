var bootState = {

  preload: function() {
    game.load.image('progress_bar', 'assets/progress_bar.png');
  },

  create: function() {
    game.stage.backgroundColor = '#000000';
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.renderer.renderSession.roundPixels = false;

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.setMinMax(game.width/2, game.height/2, game.width, game.height);
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    document.body.style.backgroundColor = '#000';
  },

  update: function() {
    game.state.start('load');
  }

}
