var GameBlockType = {
    EMPTY:  {value: 0, char: '.', image: ''},
    AQUA:   {value: 1, char: 'A', image: 'aqua_block'},
    BLUE:   {value: 2, char: 'B', image: 'blue_block'},
    GREEN:  {value: 3, char: 'G', image: 'green_block'},
    PURPLE: {value: 4, char: 'P', image: 'purple_block'},
    RED:    {value: 5, char: 'R', image: 'red_block'},
    WHITE:  {value: 6, char: 'W', image: 'white_block'},
    YELLOW: {value: 7, char: 'Y', image: 'yellow_block'},

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
    this.sprite = game.add.image(0, 0, type.image);
    this.sprite.anchor.setTo(0, 0);
    this.updateSpritePosition();
  }

  getLogicalPosition() {
    return {
      x: this.x,
      y: this.y
    }
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
    this.sprite.x = this.x * 32 + (game.width/2 - (32 * 9)/2);
    this.sprite.y = this.y * 32 + 22;
  }

};
