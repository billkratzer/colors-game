var loadState = {

  preload: function() {
    var loadingLabel = game.add.text(game.width/2, 150, 'Loading...',
      { font: '30px Helvetica', fill: '#ffffff' }
    );
    loadingLabel.anchor.setTo(0.5, 0.5);

    var progressBar = game.add.sprite(game.width/2, 200, 'progress_bar');
    progressBar.anchor.setTo(0.5, 0.5);
    game.load.setPreloadSprite(progressBar);

    // Logos
    game.load.image('colors_logo', 'assets/colors_logo.png');

    // Blocks
    game.load.image('aqua_block', 'assets/aqua_block.png');
    game.load.image('blue_block', 'assets/blue_block.png');
    game.load.image('green_block', 'assets/green_block.png');
    game.load.image('purple_block', 'assets/purple_block.png');
    game.load.image('red_block', 'assets/red_block.png');
    game.load.image('orange_block', 'assets/orange_block.png');
    game.load.image('yellow_block', 'assets/yellow_block.png');
    game.load.image('black_block', 'assets/black_block.png');
    game.load.image('rainbow_block', 'assets/rainbow_block.png');
    game.load.image('diamond', 'assets/diamond.png');
    game.load.image('exploding_block', 'assets/exploding_block.png');

    // Particles
    game.load.image('red_particle', 'assets/red_particle.png');
    game.load.image('orange_particle', 'assets/orange_particle.png');
    game.load.image('yellow_particle', 'assets/yellow_particle.png');

    // Panels, Backgrounds
    game.load.image('menu_background', 'assets/menu_background.png');
    game.load.image('game_background', 'assets/game_background.png');
    game.load.image('popup_panel', 'assets/panel_640x120.png');

    // Marquees
    game.load.image('marquee_easy_peasy_title', 'assets/marquee_easy_peasy_title.png');
    game.load.image('marquee_easy_peasy_help', 'assets/marquee_easy_peasy_help.png');
    game.load.image('marquee_buckle_up_title', 'assets/marquee_buckle_up_title.png');
    game.load.image('marquee_beware_title', 'assets/marquee_beware_title.png');
    game.load.image('marquee_beware_help', 'assets/marquee_beware_help.png');
    game.load.image('marquee_cursed_title', 'assets/marquee_cursed_title.png');
    game.load.image('marquee_rainbow_title', 'assets/marquee_rainbow_title.png');
    game.load.image('marquee_rainbow_help', 'assets/marquee_rainbow_help.png');
    game.load.image('marquee_diamonds_title', 'assets/marquee_diamonds_title.png');
    game.load.image('marquee_diamonds_help', 'assets/diamond.png');


    // Music
    game.load.audio('intro-music', ['assets/Hypnotic-Puzzle.mp3']);
    game.load.audio('music', ['assets/Action-Rhythm8.mp3']);

    // Sound Effects
  },

  create: function() {
    game.state.start('menu');
  },

  update: function() {

  }

}
