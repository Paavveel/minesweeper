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
