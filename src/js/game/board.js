
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

  // clearPiece(piece) {
  //   if (!piece) {
  //     return;
  //   }
  //
  //   for (block of piece.blocks) {
  //       clearBlock(block);
  //   }
  // }
  //
  // clearBlock(block) {
  //   if (!block) {
  //     return;
  //   }
  //   var pos = block.getLogicalPosition();
  //   board[pos.x][pos.y] = Game.BlockType.EMPTY;
  // }

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

  findMatches() {
    var matchingBlocks = [];

    var totalCount = 0;
    for (var x = 0; x < this.width; x++) {
      for (var y = 0; y < this.height; y++) {
        var count = this.countInARow(x, y, 0, 1);
        if (count >= 3) {
          totalCount = totalCount + count;
          var clearedBlocks = this.clearMatching(x, y, 0, 1);
          matchingBlocks.push.apply(matchingBlocks, clearedBlocks);
        }

        count = this.countInARow(x, y, 1, 0);
        if (count >= 3) {
          totalCount = totalCount + count;
          var clearedBlocks = this.clearMatching(x, y, 1, 0);
          matchingBlocks.push.apply(matchingBlocks, clearedBlocks);
        }

        count = this.countInARow(x, y, -1, 1);
        if (count >= 3) {
          totalCount = totalCount + count;
          var clearedBlocks = this.clearMatching(x, y, -1, 1);
          matchingBlocks.push.apply(matchingBlocks, clearedBlocks);
        }

        count = this.countInARow(x, y, 1, 1);
        if (count >= 3) {
          totalCount = totalCount + count;
          var clearedBlocks = this.clearMatching(x, y, 1, 1);
          matchingBlocks.push.apply(matchingBlocks, clearedBlocks);
        }
      }
    }

    return matchingBlocks;
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

      if (matchType == this.board[posX][posY]) {
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

      if (matchType == this.board[posX][posY]) {
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
