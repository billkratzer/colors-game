var GameBlockType = {
    EMPTY:  {value: 0, char: '.', image: ''},
    AQUA:   {value: 1, char: 'A', image: 'aqua_block'},
    BLUE:   {value: 2, char: 'B', image: 'blue_block'},
    GREEN:  {value: 3, char: 'G', image: 'green_block'},
    PURPLE: {value: 4, char: 'P', image: 'purple_block'},
    RED:    {value: 5, char: 'R', image: 'red_block'},
    WHITE:  {value: 6, char: 'W', image: 'white_block'},
    YELLOW: {value: 7, char: 'Y', image: 'yellow_block'},
    EXPLODING: {value: 100, char: '*', image: 'exploding_block'},

    random: function() {
      return game.rnd.pick([
        this.AQUA,
        this.BLUE,
        this.GREEN,
        this.PURPLE,
        this.RED
      ])
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
