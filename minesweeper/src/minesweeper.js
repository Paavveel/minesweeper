export const TILE_STATUSES = {
  HIDDEN: 'hidden',
  MINE: 'mine',
  NUMBER: 'number',
  MARKED: 'marked',
};

function setTileNumberClass(number, element) {
  switch (number) {
    case 1:
      element.classList.add('tile__one');
      break;
    case 2:
      element.classList.add('tile__two');
      break;
    case 3:
      element.classList.add('tile__three');
      break;
    case 4:
      element.classList.add('tile__four');
      break;
    case 5:
      element.classList.add('tile__five');
      break;
    case 6:
      element.classList.add('tile__six');
      break;
    case 7:
      element.classList.add('tile__seven');
      break;
    case 8:
      element.classList.add('tile__eight');
      break;
    default:
      break;
  }
}

export function positionMatch(a, b) {
  return a.x === b.x && a.y === b.y;
}

function randomNumber(size) {
  return Math.floor(Math.random() * size);
}

function nearbyTiles(board, { x, y }) {
  const tiles = [];

  for (let xOffset = -1; xOffset <= 1; xOffset += 1) {
    for (let yOffset = -1; yOffset <= 1; yOffset += 1) {
      const tile = board[x + xOffset]?.[y + yOffset];
      if (tile) tiles.push(tile);
    }
  }

  return tiles;
}

export function createBoard(boardSize, savedBoard) {
  const board = [];
  for (let x = 0; x < boardSize; x += 1) {
    const row = [];
    for (let y = 0; y < boardSize; y += 1) {
      const element = document.createElement('div');
      element.classList.add('tile');
      const tile = {
        element,
        x,
        y,
        mine: null,
        get status() {
          return this.element.dataset.status;
        },
        set status(value) {
          this.element.dataset.status = value;
        },
      };
      if (savedBoard) {
        const savedTile = savedBoard[x][y];
        element.dataset.status = savedTile.status;
        element.innerText = savedTile.content;
        setTileNumberClass(Number(savedTile.content), element);

        tile.mine = savedTile.mine;
      } else {
        element.dataset.status = TILE_STATUSES.HIDDEN;
      }
      row.push(tile);
    }
    board.push(row);
  }
  return board;
}

export function markTile(tile) {
  if (
    tile.status !== TILE_STATUSES.HIDDEN &&
    tile.status !== TILE_STATUSES.MARKED
  ) {
    return;
  }

  if (tile.status === TILE_STATUSES.MARKED) {
    tile.status = TILE_STATUSES.HIDDEN;
    tile.element.textContent = '';
  } else {
    tile.status = TILE_STATUSES.MARKED;
    tile.element.textContent = '🚩';
  }
}

export function revealTile(board, tile) {
  if (tile.status !== TILE_STATUSES.HIDDEN) {
    return;
  }

  if (tile.mine) {
    tile.status = TILE_STATUSES.MINE;
    tile.element.textContent = '💣';
    return;
  }

  tile.status = TILE_STATUSES.NUMBER;
  const adjacentTiles = nearbyTiles(board, tile);
  const mines = adjacentTiles.filter((t) => t.mine);

  if (mines.length === 0) {
    adjacentTiles.forEach(revealTile.bind(null, board));
  } else {
    tile.element.textContent = mines.length;
    setTileNumberClass(mines.length, tile.element);
  }
}

export function getMinePositions(boardSize, numberOfMines, tile) {
  const { x, y } = tile;
  const positions = [];

  while (positions.length < numberOfMines) {
    const position = {
      x: randomNumber(boardSize),
      y: randomNumber(boardSize),
    };

    if (
      !positions.some(positionMatch.bind(null, position)) &&
      !positionMatch.call(null, position, { x, y })
    ) {
      positions.push(position);
    }
  }
  return positions;
}
