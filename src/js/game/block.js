var GameBlockType = {
    EMPTY:     {value: 0,   char: '.', image: ''},
    AQUA:      {value: 1,   char: 'A', image: 'aqua_block'},
    AQUA2:      {value: 101,   char: 'AA', image: 'aqua2_block'},
    BLUE:      {value: 2,   char: 'B', image: 'blue_block'},
    BLUE2:      {value: 102,   char: 'BB', image: 'blue2_block'},
    GREEN:     {value: 3,   char: 'G', image: 'green_block'},
    GREEN2:     {value: 103,   char: 'GG', image: 'green2_block'},
    PURPLE:    {value: 4,   char: 'P', image: 'purple_block'},
    PURPLE2:    {value: 104,   char: 'PP', image: 'purple2_block'},
    RED:       {value: 5,   char: 'R', image: 'red_block'},
    RED2:       {value: 105,   char: 'RR', image: 'red2_block'},
    ORANGE:    {value: 6,   char: 'O', image: 'orange_block'},
    ORANGE2:    {value: 106,   char: 'OO', image: 'orange2_block'},
    YELLOW:    {value: 7,   char: 'Y', image: 'yellow_block'},
    YELLOW2:    {value: 107,   char: 'YY', image: 'yellow2_block'},
    RAINBOW:   {value: 10,  char: 'r', image: 'rainbow_block'},
    BLACK:     {value: 11,  char: 'r', image: 'black_block'},
    DIAMOND:   {value: 12,  char: 'r', image: 'diamond'},
    EXPLODING: {value: 100, char: '*', image: 'exploding_block'},

    random: function() {
      var type = this.normalRandom();
      //Added in all these checks because global may not always 
      //exist at the start of the game.
      if (game!=undefined ) {
        if(game.global!=undefined){
          if(game.global.currentCurse!=null && game.global.currentCurse == CurseType.CURSED_COLORS){
            
            type = this.cursedRandom();
          }
        }
      }
      
      // Diamond Blocks start appearing at level 2
      if ((game.global) && (game.global.level >= 2)) {
        if (game.rnd.frac() < 0.10) {
          return this.DIAMOND;
        }
      }

      // Black Blocks start appearing at level 4
      if ((game.global) && (game.global.level >= 4)) {
        if (game.rnd.frac() < 0.10) {
          return this.BLACK;
        }
      }

      // Rainbox Blocks start appearing at level 6
      if ((game.global) && (game.global.level >= 6)) {
        if (game.rnd.frac() < 0.05) {
          return this.RAINBOW;
        }
      }
      
      return type;
    },

    normalRandom: function() {
      return game.rnd.pick([
        this.AQUA,
        this.BLUE,
        this.GREEN,
        this.PURPLE,
        this.RED
      ]);
    },
    cursedRandom: function() {
      return game.rnd.pick([
        // this.AQUA,
        // this.BLUE,
        // this.GREEN,
        // this.PURPLE,
        // this.RED,
        this.AQUA2,
        this.BLUE2,
        this.GREEN2,
        this.PURPLE2,
        this.RED2,
      ]);
    }
}

class GameBlock {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.offsetX = 0;
    this.offsetY = 0;
    this.sprite = game.add.image(0, 0, type.image);
    this.sprite.anchor.setTo(0, 0);
    this.updateSpritePosition();
  }

  cloneExploding() {
    var block = new GameBlock(GameBlockType.EXPLODING, this.x, this.y);
    block.setOffset(game.width/2 - (32 * 9)/2, 18);
    block.sprite.alpha = 0;

    var emitter = game.add.emitter(block.sprite.x + 16, block.sprite.y + 16);
    emitter.setXSpeed(-50, 50);
    emitter.setYSpeed(-50, 50);
    emitter.gravity = {x: 0, y:0};
    emitter.makeParticles('red_particle', 0, 24, true, true);
    emitter.makeParticles('orange_particle', 0, 24, true, true);
    emitter.makeParticles('yellow_particle', 0, 32, true, true);
    emitter.setAlpha(1.0, 0.1, 300, Phaser.Easing.Exponential.None);
    emitter.setScale(2.0, 1.0, 2.0, 1.0, 300);
    emitter.autoAlpha = true;
    emitter.start(true, 900, 0, 100);
    return block;
  }

  getLogicalPosition() {
    return {
      x: this.x,
      y: this.y
    }
  }

  setOffset(x, y) {
      this.offsetX = x;
      this.offsetY = y;
      this.updateSpritePosition();
  }

  setLogicalPosition(x, y) {
    this.x = x;
    this.y = y;
    this.updateSpritePosition();
  }

  setLogicalX(x) {
    this.x = x;
    this.updateSpritePosition();
  }

  setLogicalY(y) {
    this.y = y;
    this.updateSpritePosition();
  }

  show() {
    this.sprite.visible = true;
  }

  hide() {
    this.sprite.visible = false;
  }

  moveUp(delta) {
    this.y = this.y - delta;
    this.updateSpritePosition();
  }

  moveDown(delta) {
    console.log("Delta: %d, y: %d", delta, this.y);
    this.y = this.y + delta;
    this.updateSpritePosition();
    console.log("Moved block [" + this.type.char + "] down to %d, %d", this.x, this.y);
  }

  updateSpritePosition() {
    this.sprite.x = this.x * 32 + this.offsetX;
    this.sprite.y = this.y * 32 + this.offsetY;
  }

};
