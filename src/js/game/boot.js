var bootState = {

  preload: function() {
    game.load.image('progress_bar', 'assets/progress_bar.png');
  },

  create: function() {
    game.stage.backgroundColor = '#000000';
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.renderer.renderSession.roundPixels = false;

    document.body.style.backgroundColor = '#000';
  },

  update: function() {
    game.state.start('load');
  }

}
