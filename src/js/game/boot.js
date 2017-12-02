var bootState = {

  preload: function() {
    game.load.image('progress_bar', 'assets/progress_bar.png');
  },

  create: function() {
    game.stage.backgroundColor = '#000000';
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.renderer.renderSession.roundPixels = false;

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
    game.scale.pageAlignVertically = true;
    game.scale.pageAlignHorizontally = true;

    document.body.style.backgroundColor = '#000';
  },

  update: function() {
    game.state.start('load');
  }

}
