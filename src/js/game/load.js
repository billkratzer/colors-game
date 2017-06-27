var loadState = {

  preload: function() {
    var loadingLabel = game.add.text(game.width/2, 150, 'Loading...',
      { font: '30px Helvetica', fill: '#ffffff' }
    );
    loadingLabel.anchor.setTo(0.5, 0.5);

    var progressBar = game.add.sprite(game.width/2, 200, 'progress_bar');
    progressBar.anchor.setTo(0.5, 0.5);
    game.load.setPreloadSprite(progressBar);

    game.load.image('colors_logo', 'assets/colors_logo.png');

    game.load.image('aqua_block', 'assets/aqua_block.png');
    game.load.image('blue_block', 'assets/blue_block.png');
    game.load.image('green_block', 'assets/green_block.png');
    game.load.image('purple_block', 'assets/purple_block.png');
    game.load.image('red_block', 'assets/red_block.png');
    game.load.image('white_block', 'assets/white_block.png');
    game.load.image('yellow_block', 'assets/yellow_block.png');
    game.load.image('exploding_block', 'assets/exploding_block.png');

    game.load.image('menu_background', 'assets/menu_background.png');
    game.load.image('game_background', 'assets/game_background.png');
    game.load.image('popup_panel', 'assets/panel_640x120.png');

    game.load.audio('intro-music', ['assets/Hypnotic-Puzzle.mp3']);
    game.load.audio('music', ['assets/Action-Rhythm8.mp3']);
  },

  create: function() {
    game.state.start('menu');
  },

  update: function() {

  }

}
