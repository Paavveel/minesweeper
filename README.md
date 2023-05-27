<div align="center">
 <img src="https://img.shields.io/badge/JavaScript-202124?style=flat-square&logo=javascript&logoColor=F7DF1E" />
 <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" />
 <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" />
</div>

<h3 align="center">
  <a href="#about">О проекте</a>
  •
  <a href="#techs">Технологии</a>
  •
  <a href="#functionality">Функциональность</a>
</h3>

<h4 align=center>Проект выполнен в процессе прохождения курса RS School - JavaScript/Front-end 2023Q1</h4>

<h3 align="center">
  <a href="https://paavveel.github.io/minesweeper/minesweeper" title="Link">Demo</a> 
  •
  <a href="https://github.com/rolling-scopes-school/tasks/blob/master/tasks/minesweeper/README.md">Ссылка на задание</a>
</h3>

<h1 id="about">О проекте</h1>

<table>
  <tbody>
    <tr>
      <td>
        <p align="center"><b>Выполнен <br>в процессе прохождения курса RS School - JavaScript/Front-end 2023Q1</b><p>
        <p align="center">Базовая игра Minesweeper, реализован основной функционал игры (открытие ячеек, установка флогов, рекурсивное открытие пустых ячеек, колор кодинг для ячеек с цифрами). Дополнительный функционал: сохранение игры в LocalStorage, dark/ligth theme, три размера поля с пользовательским выбором количества мин. Список последних 10 побед, с сохранением в LocalStorage. Сохранение состояния игры при перезагрузке.</p>
      </td>
      <td width="70%"><img src="https://github.com/Paavveel/minesweeper/assets/65166970/0abe95c3-cba7-4421-8669-62361d96fce2"/></td>
  </tbody>
</table>

<h1 id="techs">Технологии</h1>

<table>
  <thead>
    <tr>
      <th width="200px">Frontend</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <ul>
          <li>JavaScript</li>
          <li>HTML5</li>
          <li>CSS3</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

<h1 id="functionality">Функциональность</h1>

<h3>Frontend</h3>

<ol>
    <li>Адаптивен под (500px <= width)</li>
    <li>Все элементы сгенерированы с помощью JavaScript</li>
    <li>Возможеость выбрать размер поля (easy - 10x10, medium - 15x15, hard - 25x25) и количество мин для каждого поля,</li>
    <li>Мины размещаются после 1 клина, пользователь не может проиграть при первом клике.</li>
    <li>У пользователя есть возможность ставить флаги, чтобы случайно не открыть потонциальные мины.</li>
    <li>Отображается таймер и количество ходов.</li>
    <li>Звуки: открытие, флаги, порожение и победа.</li>
    <li>Последние 10 побед сохраняются в таблецу результатов (сохранение в LocalStorage)</li>
    <li>Реализовано сохранение состояния игры при перезагрузке (сохранение в LocalStorage)</li>
    <li>Смена темной/светлой темы.</li>
</ol>
