var game = new Phaser.Game(800, 640, 'AUTO', 'game');

game.VERSION = '0.9.0';

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);

game.state.start('boot');
