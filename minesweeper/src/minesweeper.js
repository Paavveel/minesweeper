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
