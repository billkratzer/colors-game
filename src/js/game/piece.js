class GamePiece {
  constructor() {
    this.blocks = new Array();
    this.blocks.push(this.buildBlock(0));
    this.blocks.push(this.buildBlock(1));
    this.blocks.push(this.buildBlock(2));
  }

  buildBlock(index) {
    this.x = 4;
    this.y = 0;

    var block = new GameBlock(GameBlockType.random(), this.x, this.y + index);
    return block;
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

};
