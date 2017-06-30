
class GameBoard {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    console.log("New Game Board: %d x %d", width, height);
    this.clear();
  }

  clear() {
    this.board = new Array(this.width);
    this.blocks = new Array(this.height);

    for (var x = 0; x < this.width; x++) {
      this.board[x] = new Array(this.height);
      this.blocks[x] = new Array(this.height);

      for (var y = 0; y < this.height; y++) {
        this.board[x][y] = GameBlockType.EMPTY;
        this.blocks[x][y] = null;
      }
    }
  }

  grow() {
    // copy the rows up
    for (var y = 1; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        this.board[x][y - 1] = this.board[x][y];
        this.blocks[x][y - 1] = this.blocks[x][y];
        var movedBlocked = this.blocks[x][y - 1];
        if (movedBlocked) {
          movedBlocked.setLogicalPosition(x, y - 1);
        }
      }
    }

    // fill in the bottom row
    var y = this.height - 1;
    for (var x = 0; x < this.width; x++) {
      var type = GameBlockType.normalRandom();
      this.board[x][y] = type;
      var block = new GameBlock(type, x, y);
      block.setOffset((game.width/2 - (32 * 9)/2), 18);
      this.blocks[x][y] = block;
    }
  }

  isTopRowEmpty() {
    for (var x = 0; x < this.width; x++) {
      if (!this.isEmpty(x, 0)) {
        return false;
      }
    }
    return true;
  }

  isEmpty(x, y) {
    return (this.board[x][y] == GameBlockType.EMPTY);
  }

  markEmpty(x, y) {
    this.board[x][y] = GameBlockType.EMPTY;
  }

  outOfBounds(piece, deltaX, deltaY) {
    for (var block of piece.blocks) {
      var pos = block.getLogicalPosition();
      pos.x = pos.x + deltaX;
      pos.y = pos.y + deltaY;
      if (pos.x < 0) {
        return true;
      }
      if (pos.x >= this.width) {
        return true;
      }
      if (pos.y < 0) {
        return true;
      }
      if (pos.y >= this.height) {
        return true;
      }
    }
    return false;
  }

  collides(piece, deltaX, deltaY) {
    for (var block of piece.blocks) {
      var pos = block.getLogicalPosition();
      pos.x = pos.x + deltaX;
      pos.y = pos.y + deltaY;
      if (!this.isEmpty(pos.x, pos.y)) {
        return true;
      }
    }
    return false;
  }

  addPiece(piece) {
    if (!piece) {
      return;
    }

    for (var block of piece.blocks) {
      this.addBlock(block);
    }
  }

  addBlock(block) {
    if (!block) {
      return;
    }

    var pos = block.getLogicalPosition();
    this.board[pos.x][pos.y] = block.type;
    this.blocks[pos.x][pos.y] = block;
  }

  isEmptyInDirection(x, y, deltaX, deltaY) {
    var posX = x + deltaX;
    var posY = y + deltaY;
    if (posX < 0) {
      return false;
    }
    else if (posX >= this.width) {
      return false;
    }
    else if (posY < 0) {
      return false;
    }
    else if (posY >= this.height) {
      return false;
    }
    else {
      return this.isEmpty(posX, posY);
    }
  }

  clearExploding() {
    var exploding = [];

    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        if (this.board[x][y] == GameBlockType.EXPLODING) {
          this.markEmpty(x, y);
          exploding.push(this.blocks[x][y]);
        }
      }
    }

    return exploding;
}

  collapse() {
    var totalCount = 0;
    var count = 0;
    do {
      count = 0;
      for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
          if (!this.isEmpty(x, y)) {
            if (this.isEmptyInDirection(x, y, 0, 1)) {
              this.board[x][y + 1] = this.board[x][y];
              this.markEmpty(x, y);
              this.blocks[x][y].moveDown(1);
              this.blocks[x][y + 1] = this.blocks[x][y];
              this.blocks[x][y] = null;
              this.print();
              totalCount++;
              count++;
            }  // end if
          } // end if
        }  // end for
      } // end for
    }
    while (count > 0);

    return totalCount;
  }

  getRunOfBlocks(x, y, deltaX, deltaY, length) {
    var list = [];

    var blockX = x;
    var blockY = y;
    for (var i = 0; i < length; i++) {
      list.push(this.blocks[blockX][blockY]);
      blockX = blockX + deltaX;
      blockY = blockY + deltaY;
    }

    return list;
  }

  findBlocksOfType(type) {
    var matchingBlocks = [];

    for (var x = 0; x < this.width; x++) {
      for (var y = 0; y < this.height; y++) {
        if (this.board[x][y] == type) {
          matchingBlocks.push(this.blocks[x][y]);
        }
      }
    }

    return matchingBlocks;
  }

  findMatches() {
    var matchingBlocks = [];

    // Are there any rainbox pieces?  (if so, consider anything beneath a rainbow block a match)
    var rainbowBlocks = this.findBlocksOfType(GameBlockType.RAINBOW);
    for (var block of rainbowBlocks) {
      if (block.y < this.height - 1) {
        var type = this.board[block.x][block.y + 1];
        matchingBlocks.push.apply(matchingBlocks, this.findBlocksOfType(type));
      }
      matchingBlocks.push(block);
    }

    var totalCount = 0;
    for (var x = 0; x < this.width; x++) {
      for (var y = 0; y < this.height; y++) {
        // Diamonds don't participate in normal match finding
        if (this.board[x][y] == GameBlockType.DIAMOND) {
          continue;
        }
        // Search Down
        var count = this.countInARow(x, y, 0, 1);
        if (count >= 3) {
          matchingBlocks.push.apply(matchingBlocks, this.getRunOfBlocks(x, y, 0, 1, count));
        }

        // Search Right
        count = this.countInARow(x, y, 1, 0);
        if (count >= 3) {
          matchingBlocks.push.apply(matchingBlocks, this.getRunOfBlocks(x, y, 1, 0, count));
        }

        // Search Right/Down
        count = this.countInARow(x, y, 1, -1);
        if (count >= 3) {
          matchingBlocks.push.apply(matchingBlocks, this.getRunOfBlocks(x, y, 1, -1, count));
        }

        // Search Right/Up
        count = this.countInARow(x, y, 1, 1);
        if (count >= 3) {
          matchingBlocks.push.apply(matchingBlocks, this.getRunOfBlocks(x, y, 1, 1, count));
        }
      }
    }

    // Check to see if any of the matching blocks are black.
    // If so, set a curse!
    for (var block of matchingBlocks) {
      if (block.type == GameBlockType.BLACK) {
        game.global.newCurse = CurseType.random();
        game.global.cursePieceCount = 0;
        break;
      }
    }

    return this.explodeMatchingBlocks(matchingBlocks);
  }

  explodeMatchingBlocks(listOfBlocks) {
    var uniqueListOfBlocks = [];

    for (var block of listOfBlocks) {
      if (block.type == GameBlockType.EMPTY) {
        continue;
      }
      if (block.type == GameBlockType.EXPLODING) {
        continue;
      }
      if (this.board[block.x][block.y] == GameBlockType.EMPTY) {
        continue;
      }
      if (this.board[block.x][block.y] == GameBlockType.EXPLODING) {
        continue;
      }

      uniqueListOfBlocks.push(block);

      this.board[block.x][block.y] = GameBlockType.EXPLODING;
      this.blocks[block.x][block.y] = block.cloneExploding();
    }

    return uniqueListOfBlocks;
  }

  clearMatching(x, y, deltaX, deltaY) {
    var matchingBlocks = [];
    var matchType = this.board[x][y];
    if (matchType == GameBlockType.EMPTY) {
      return matchingBlocks;
    }
    if (matchType == GameBlockType.EXPLODING) {
      return 0;
    }
    var posX = x;
    var posY = y;
    while (true) {
      if (posX < 0) {
        return matchingBlocks;
      }
      else if (posX >= this.width) {
        return matchingBlocks;
      }
      else if (posY < 0) {
        return matchingBlocks;
      }
      else if (posY >= this.height) {
        return matchingBlocks;
      }

      if ((matchType == this.board[posX][posY]) || (this.board[posX][posY] == GameBlockType.EXPLODING)) {
        this.board[posX][posY] = GameBlockType.EXPLODING;
        var oldBlock = this.blocks[posX][posY];
        matchingBlocks.push(oldBlock);
        this.blocks[posX][posY] = oldBlock.cloneExploding();
      }
      else {
        return matchingBlocks;
      }

      posX = posX + deltaX;
      posY = posY + deltaY;
    }
  }

  countInARow(x, y, deltaX, deltaY) {
    var matchType = this.board[x][y];
    if (matchType == GameBlockType.EMPTY) {
      return 0;
    }
    if (matchType == GameBlockType.EXPLODING) {
      return 0;
    }

    var count = 1;
    var posX = x;
    var posY = y;
    while (true) {
      posX = posX + deltaX;
      posY = posY + deltaY;
      if (posX < 0) {
        return count;
      }
      else if (posX >= this.width) {
        return count;
      }
      else if (posY < 0) {
        return count;
      }
      else if (posY >= this.height) {
        return count;
      }

      if ((matchType == this.board[posX][posY]) || (this.board[posX][posY] == GameBlockType.EXPLODING)) {
        count++;
      }
      else {
        return count;
      }
    }
  }

  print() {
    for (var y = 0; y < this.height; y++) {
      var s = y + ": ";
      for (var x = 0; x < this.width; x++) {
        var piece = this.board[x][y];
        if (piece) {
          s = s + piece.char + ' ';
        }
        else {
          s = s + '! ';
        }
      }
      console.log(s);
    }
  }
};
