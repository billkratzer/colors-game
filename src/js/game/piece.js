class GamePiece {

  constructor(current) {
    this.blocks = new Array();
    this.rainbowCount = 0;
    this.blocks.push(this.buildBlock(0));
    this.blocks.push(this.buildBlock(1));
    this.blocks.push(this.buildBlock(2));
    this.setCurrent(current);
  }

  buildBlock(index) {
    this.x = 4;
    this.y = 0;

    var blockType = GameBlockType.random();

    // Make sure that we only have ONE rainbow block per piece!
    if (blockType == GameBlockType.RAINBOW) {
      this.rainbowCount++;
      if (this.rainbowCount > 1) {
        while (blockType == GameBlockType.RAINBOW) {
          blockType = GameBlockType.random();
        }
      }
    }

    return new GameBlock(blockType, this.x, this.y + index);
  }

  moveLeft() {
    this.x = this.x - 1;
    for (var block of this.blocks) {
        block.setLogicalX(this.x);
    }
  }

  moveRight() {
    this.x = this.x + 1;
    for (var block of this.blocks) {
      block.setLogicalX(this.x);
    }
  }

  moveDown() {
    for (var block of this.blocks) {
      var pos = block.getLogicalPosition();
      block.setLogicalY(pos.y + 1);
    }
  }

  rotate() {
    var firstBlock = this.blocks[0];
    for (var i = 0; i < this.blocks.length - 1; i++) {
      this.blocks[i] = this.blocks[i + 1];
      this.blocks[i].moveUp(1);
    }
    this.blocks[this.blocks.length - 1] = firstBlock;
    this.blocks[this.blocks.length - 1].moveDown(this.blocks.length - 1);
  }

  hide() {
    for (var block of this.blocks) {
      block.hide();
    }
  }

  show() {
    for (var block of this.blocks) {
      block.show();
    }
  }

  setCurrent(current) {
    var offX;
    var offY;
    if (current) {
      offX = (game.width/2 - (32 * 9)/2);
      offY = 18;
    }
    else {
      offX = (game.width/2 + (32 * 9)/2) - 20;
      offY = 50;
    }
    for (var block of this.blocks) {
      block.setOffset(offX, offY);
    }
  }

};
