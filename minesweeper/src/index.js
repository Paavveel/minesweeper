import {
  TILE_STATUSES,
  createBoard,
  getMinePositions,
  positionMatch,
  markTile,
  revealTile,
  checkWin,
  checkLose,
} from './minesweeper.js';

const lsPrefix = 'paavveel';

const THEMES = ['dark', 'light'];
const currentTheme = localStorage.getItem(`${lsPrefix}-theme`) ?? 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);

const BOARD_SIZES = [10, 15, 25];
let boardSize =
  JSON.parse(localStorage.getItem(`${lsPrefix}-size`)) ?? BOARD_SIZES[0];

const MINES_MIN = 10;
const MINES_MAX = 99;
let numberOfMines =
  JSON.parse(localStorage.getItem(`${lsPrefix}-mines`)) ?? MINES_MIN;

let steps = JSON.parse(localStorage.getItem(`${lsPrefix}-steps`)) ?? 0;

let timer = JSON.parse(localStorage.getItem(`${lsPrefix}-timer`)) ?? 0;
let timerId;

let isSoundOn = JSON.parse(localStorage.getItem(`${lsPrefix}-sound`) ?? true);
let isPlay = false;
let music = new Audio();

let board;
let prevGameState = JSON.parse(localStorage.getItem(`${lsPrefix}-save`));
let isGameStarted = !!prevGameState;

const results =
  JSON.parse(localStorage.getItem(`${lsPrefix}-results`)) ??
  Array(10).fill(Array(4).fill('empty'));

function createElement(elementName, className) {
  const element = document.createElement(elementName);
  element.className = className;
  return element;
}

function playMusic(src) {
  if (!isSoundOn) return;

  if (isPlay) {
    music.pause();
    isPlay = false;
  }

  music = new Audio(src);
  music.volume = 0.5;

  music.play().then(() => {
    isPlay = true;
  });
}

function renderDom() {
  function handleSize() {
    boardSize = Number(this.value);

    const selectSize = document.querySelector('select[name="mines"]');
    const options = selectSize.childNodes;
    for (let i = 0; i < options.length; i += 1) {
      const option = options[i];
      if (numberOfMines === Number(option.value)) {
        option.selected = true;
      }
    }

    startNewGame();
  }

  function handleMines() {
    numberOfMines = Number(this.value);
    startNewGame();
  }

  function renderSoundButton(button) {
    const element = button;

    if (isSoundOn) {
      element.innerHTML = `<svg width="25" height="25" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <path d="m403.966 426.944-33.285-26.629c74.193-81.076 74.193-205.016-.001-286.091l33.285-26.628c86.612 96.713 86.61 242.636.001 339.348ZM319.58 155.105l-33.325 26.66c39.796 42.567 39.795 108.443.002 151.01l33.324 26.66c52.204-58.222 52.204-146.11-.001-204.33Zm-85.163-69.772-110.855 87.23H42.667v170.666h81.02l110.73 85.459V85.333Z" fill-rule="evenodd"/>
</svg>`;
    } else {
      element.innerHTML = `<svg width="25" height="25" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <path d="m89.752 59.582 251.583 251.583 5.433 5.432 49.472 49.474v-.001l30.862 30.86h-.001l25.317 25.318-30.17 30.17-187.832-187.833v164.103l-110.729-85.459h-81.02V172.563h80.895l10.538-8.293-74.518-74.518 30.17-30.17Zm314.213 28.014c67.74 75.64 82.499 181.38 44.28 270.137l-32.95-32.95c23.87-71.004 8.998-151.973-44.615-210.559l33.285-26.628Zm-84.385 67.51c28.626 31.924 41.555 72.769 38.788 112.752l-49.237-49.236c-4.823-12.915-12.148-25.121-21.976-35.884l-.9-.974 33.325-26.659Zm-85.163-69.773-.001 58.574-32.78-32.78 32.78-25.794Z" fill-rule="evenodd"/>
</svg>`;
    }
  }

  function handleMute() {
    isSoundOn = !isSoundOn;
    renderSoundButton(this);
    localStorage.setItem(`${lsPrefix}-sound`, isSoundOn);
  }

  function handleTheme() {
    if (this.value === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    localStorage.setItem(`${lsPrefix}-theme`, this.value);
  }

  document.body.classList.add('body');

  const containerElement = createElement('div', 'container');

  const controlsElement = createElement('div', 'controls');

  const controlsSettingsElement = createElement('div', 'controls__settings');

  const selectSizeElement = createElement('select', 'controls__select');
  selectSizeElement.setAttribute('name', 'size');
  selectSizeElement.addEventListener('change', handleSize);

  for (let i = 0; i < BOARD_SIZES.length; i += 1) {
    const size = BOARD_SIZES[i];
    const option = createElement('option', '');
    option.value = size;
    option.textContent = `${size}x${size}`;

    if (boardSize === size) {
      option.selected = true;
    }

    selectSizeElement.append(option);
  }

  const selectMinesElement = createElement('select', 'controls__select');
  selectMinesElement.setAttribute('name', 'mines');
  selectMinesElement.addEventListener('change', handleMines);

  for (let i = MINES_MIN; i <= MINES_MAX; i += 1) {
    const option = createElement('option', '');
    option.value = i;
    option.textContent = i;

    if (numberOfMines === i) {
      option.selected = true;
    }

    selectMinesElement.append(option);
  }

  const selectThemeElement = createElement('select', 'controls__select');
  selectThemeElement.setAttribute('name', 'theme');
  selectThemeElement.addEventListener('change', handleTheme);

  for (let i = 0; i < THEMES.length; i += 1) {
    const theme = THEMES[i];
    const option = createElement('option', '');
    option.value = theme;
    option.textContent = theme;

    if (currentTheme === theme) {
      option.selected = true;
    }

    selectThemeElement.append(option);
  }

  const soundButtonElement = createElement('button', 'controls__button');
  renderSoundButton(soundButtonElement);
  soundButtonElement.addEventListener('click', handleMute);

  const scoreButtonElement = createElement('button', 'controls__score-button');
  scoreButtonElement.textContent = 'Score';

  controlsSettingsElement.append(
    selectSizeElement,
    selectMinesElement,
    soundButtonElement,
    selectThemeElement
  );

  const controlsStatElement = createElement('div', 'controls__stat');

  const stepsContainerDivElement = createElement('div', 'steps');
  const stepsTitleDivElement = createElement('div', 'steps__title');
  stepsTitleDivElement.textContent = 'Clicks';
  const stepsContentDivElement = createElement('div', 'steps__content');
  stepsContentDivElement.textContent = steps;
  stepsContainerDivElement.append(stepsTitleDivElement, stepsContentDivElement);

  const flagsAndMinesContainerDivElement = createElement('div', 'flags-mines');
  const flagsAndMinesTitleDivElement = createElement(
    'div',
    'flags-mines__title'
  );
  flagsAndMinesTitleDivElement.textContent = 'Flags | Mines';
  const flagsAndMinesContentDivElement = createElement(
    'div',
    'flags-mines__content'
  );
  const flagsContentDivElement = createElement(
    'div',
    'flags-mines__content-flags'
  );
  const minesContentDivElement = createElement(
    'div',
    'flags-mines__content-mines'
  );
  flagsAndMinesContentDivElement.append(
    flagsContentDivElement,
    minesContentDivElement
  );

  flagsAndMinesContainerDivElement.append(
    flagsAndMinesTitleDivElement,
    flagsAndMinesContentDivElement
  );

  const timerContainerDivElement = createElement('div', 'timer');
  const timerTitleDivElement = createElement('div', 'timer__title');
  timerTitleDivElement.textContent = 'Time';
  const timerContentDivElement = createElement('div', 'timer__content');
  timerContentDivElement.textContent = timer;
  timerContainerDivElement.append(timerTitleDivElement, timerContentDivElement);

  controlsStatElement.append(
    stepsContainerDivElement,
    flagsAndMinesContainerDivElement,
    timerContainerDivElement
  );

  controlsElement.append(
    controlsSettingsElement,
    scoreButtonElement,
    controlsStatElement
  );

  const minesweeperElement = createElement('div', 'minesweeper');

  const headerElement = createElement('div', 'header');

  const newGameButtonElement = createElement('button', 'new-game');
  newGameButtonElement.addEventListener('click', startNewGame);
  const newGameSpanElement = createElement('span', 'new-game__title');
  newGameSpanElement.textContent = 'New Game';
  newGameButtonElement.append(newGameSpanElement);

  headerElement.append(newGameButtonElement);

  const boardDivElement = createElement('div', 'board');

  minesweeperElement.append(headerElement, boardDivElement);

  const modal = createElement('dialog', 'modal');

  containerElement.append(controlsElement, minesweeperElement, modal);

  document.body.insertAdjacentElement('afterbegin', containerElement);
}

renderDom();

const stepsElement = document.querySelector('.steps__content');
const minesLeftElement = document.querySelector('.flags-mines__content-mines');
const flagsLeftElement = document.querySelector('.flags-mines__content-flags');
const timerElement = document.querySelector('.timer__content');
const boardElement = document.querySelector('.board');
const modalElement = document.querySelector('.modal');

function startTimer() {
  timerId = setInterval(() => {
    timer += 1;
    timerElement.textContent = timer;
  }, 1000);
}

function stopProp(e) {
  e.stopImmediatePropagation();
}

function handleMinesAndFlags() {
  const markedTilesCount = board.reduce(
    (count, row) =>
      count + row.filter((tile) => tile.status === TILE_STATUSES.MARKED).length,
    0
  );
  flagsLeftElement.textContent = markedTilesCount;

  const minesRemaining = numberOfMines - markedTilesCount;

  if (minesRemaining > 0) {
    minesLeftElement.textContent = minesRemaining;
  } else {
    minesLeftElement.textContent = 0;
  }
}

function checkGameEnd(e) {
  const win = checkWin(board);
  const lose = checkLose(board);

  if (!win && !lose) {
    playMusic('../minesweeper/src/assets/sounds/click.wav');
  }

  if (win) {
    results.unshift([boardSize, numberOfMines, steps, timer]);
    results.length = 10;
    playMusic('../minesweeper/src/assets/sounds/win.wav');
  }

  if (lose) {
    e.target.classList.add('tile__lose');
    board.forEach((row) => {
      row.forEach((tile) => {
        if (tile.status === TILE_STATUSES.MARKED) markTile(tile);
        if (tile.mine) revealTile(board, tile);
      });
    });
    playMusic('../minesweeper/src/assets/sounds/lose.wav');
  }

  if (win || lose) {
    boardElement.addEventListener('click', stopProp, { capture: true });
    boardElement.addEventListener('contextmenu', stopProp, { capture: true });
    boardElement.removeEventListener('click', startTimer, { once: true });

    clearInterval(timerId);
    isGameStarted = false;
    timer = 0;
    steps = 0;
  }
}

function renderBoard() {
  boardElement.style.setProperty('--size', boardSize);

  if (prevGameState) {
    board = createBoard(boardSize, prevGameState);
    boardElement.addEventListener('click', startTimer, { once: true });
  } else {
    board = createBoard(boardSize);
  }

  handleMinesAndFlags();

  board.forEach((boardRow) => {
    boardRow.forEach((boardTile) => {
      boardElement.append(boardTile.element);

      boardTile.element.addEventListener('click', (e) => {
        if (!isGameStarted) {
          const minePositions = getMinePositions(
            boardSize,
            numberOfMines,
            boardTile
          );
          board.forEach((row) => {
            row.forEach((tile) => {
              tile.mine = minePositions.some(
                positionMatch.bind(null, { x: tile.x, y: tile.y })
              );
            });
          });
          isGameStarted = true;
          startTimer();
        }

        if (boardTile.status === TILE_STATUSES.HIDDEN) {
          steps += 1;
        }
        revealTile(board, boardTile);
        stepsElement.textContent = steps;
        checkGameEnd(e);
      });
      boardTile.element.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        markTile(boardTile);

        if (
          boardTile.status === TILE_STATUSES.HIDDEN ||
          boardTile.status === TILE_STATUSES.MARKED
        ) {
          playMusic('../minesweeper/src/assets/sounds/flag.wav');
        }

        handleMinesAndFlags();
      });
    });
  });
}

function startNewGame() {
  isGameStarted = false;
  prevGameState = null;
  timer = 0;
  steps = 0;
  clearInterval(timerId);

  timerElement.textContent = timer;
  stepsElement.textContent = steps;

  boardElement.removeEventListener('click', stopProp, { capture: true });
  boardElement.removeEventListener('contextmenu', stopProp, {
    capture: true,
  });

  boardElement.innerHTML = '';
  renderBoard();
}

renderBoard();
