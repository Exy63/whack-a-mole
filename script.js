/** Неизменные переменные */
// Все кроты
const aMole = document.querySelectorAll(".mole");
// Новая игра
const newGameButton = document.getElementById("new-game-button");
// Название уровня сложности в рекорде
const recordNameLevel = document.getElementById("record-name-level");
// Счёт в рекорде
const recordScore = document.getElementById("record-score");
// Множитель для уровня сложности -> Уровни с 1 по 7
const aMultiplier = [1, 0.9, 0.8, 0.7, 0.5, 0.4, 0.3];
const level = document.getElementById("level");
// Названия уровней сложности
const levelName = [
  "Newbie",
  "Beginner",
  "Skilled",
  "Advanced",
  "Expert",
  "GOD",
  "Cheater",
];

// Обработчики событий
aMole.forEach((mole) => mole.addEventListener("click", catchMole));

/** Звуки */
// Старт
const startSound = new Audio("assets/sound/start.ogg");
// Стоп
const endSound = new Audio("assets/sound/timeIsUp.wav");
// Удар
const bonkSound = new Audio("assets/sound/bonk.mp3");
// Новый рекорд
const newRecordSound = new Audio("assets/sound/newRecord.mp3");
// Набрали ноль
const zeroScore = new Audio("assets/sound/zeroScore.wav");

/** Изменяемые переменные */
// Продолжительность игры
const gameDuration = 15000; // 15 сек
// Уровень игры
let gameLevel = level.options.selectedIndex;
// Счёт
let score = 0;
document.getElementById("score").textContent = score;
// Процесс игры
let gameInProcess = false;
// Последняя нора
let lastHole;
// Статус рекорда
let isNewRecord = false;

/** local storage */
// Локальное хранилище
const recordStorage = window.localStorage;

/**
 *
 * Обнулить все рекорды
 *
 */
function dropRecords() {
  recordStorage.setItem(levelName[0], 0);
  recordStorage.setItem(levelName[1], 0);
  recordStorage.setItem(levelName[2], 0);
  recordStorage.setItem(levelName[3], 0);
  recordStorage.setItem(levelName[4], 0);
  recordStorage.setItem(levelName[5], 0);
  recordStorage.setItem(levelName[6], 0);
  console.log("recordStorage :>> ", recordStorage);
}

/**
 *
 *  Запуск новой игры
 *
 */
function newGame() {
  let thisGameLevel = level.options.selectedIndex;
  // Запись о рекорде
  recordNameLevel.textContent = `TOP ${
    levelName[level.selectedIndex]
  }: ${recordStorage.getItem(levelName[level.selectedIndex])}`;
  // Обновляем последнюю нору
  lastHole = null;
  // Обнуляем счёт
  score = 0;
  document.getElementById("score").textContent = score;
  // Меняем статус запуска
  gameInProcess = true;
  // Звук
  startSound.play();
  // Меняем кнопку
  newGameButton.classList.add("disabled");
  newGameButton.textContent = "Whack `em All!";

  // Запуск игры
  run(thisGameLevel);
  // Выключение игры
  setTimeout(() => {
    gameInProcess = false;
    // Звук
    if (!isNewRecord) {
      if (score === 0) {
        zeroScore.play();
      } else {
        endSound.play();
      }
    }
    if (isNewRecord) {
      newRecordSound.play();
      setTimeout(() => {
        alert("🎉Unbelievable! You`ve set a new record! Congratulations🎉");
        isNewRecord = false;
      }, 100);
    }
    // Обновляем кнопку
    newGameButton.classList.remove("disabled");
    newGameButton.textContent = "New Game";
  }, gameDuration);
}

/**
 *
 * запуск одного раунда по уровню
 *
 */
function run(gameLevel) {
  const multiplier = aMultiplier[gameLevel];

  // Выбор случаной норы
  const iRandomHole = Math.floor(Math.random() * 6);

  // Предохранение от двух одинаковых нор подряд
  if (iRandomHole === lastHole) {
    return run(gameLevel);
  }
  lastHole = iRandomHole;

  // Определение крота
  const vMole = aMole[iRandomHole];

  // Определение времени появления крота
  const iRandomTime = Math.floor(
    (Math.random() * (1000 - 600) + 600) * multiplier
  );

  // Появление
  vMole.classList.add("up");

  setTimeout(() => {
    // Исчезание
    vMole.classList.remove("up");
    // Запуск следующего
    if (gameInProcess) {
      run(gameLevel);
    }
  }, iRandomTime);
}

/**
 *
 * Поймать крота
 *
 */
function catchMole() {
  bonkSound.play();
  score++;
  this.classList.remove("up");
  document.getElementById("score").textContent = score;

  // Записываем рекорд
  if (localStorage.getItem(levelName[gameLevel]) <= score) {
    // Меняем состояние рекорда
    isNewRecord = true;

    // Обновляем запись о рекорде
    localStorage.setItem(levelName[gameLevel], score);
    recordNameLevel.textContent = `TOP ${
      levelName[gameLevel]
    }: ${recordStorage.getItem(levelName[gameLevel])}`;
  }
}

/**
 *
 * Сменить уровень игры
 *
 */
function changeLevel() {
  // Записываем рекорд
  if (localStorage.getItem(levelName[gameLevel]) < score) {
    localStorage.setItem(levelName[gameLevel], score);
  }
  // Проигрываем звук если шла игра
  if (gameInProcess) {
    if (!isNewRecord) {
      endSound.play();
    }
    if (isNewRecord) {
      newRecordSound.play();
      setTimeout(() => {
        alert("🎉Unbelievable! You`ve set a new record! Congratulations🎉");
        isNewRecord = false;
      }, 100);
    }
    gameInProcess = false;
  }

  // Обнуляем счёт
  score = 0;
  document.getElementById("score").textContent = score;
  // Обновляем текст кнопки
  newGameButton.classList.remove("disabled");
  newGameButton.textContent = "New Game";
  // Останавливаем игру
  gameInProcess = false;

  // Меняем уровень
  gameLevel = level.options.selectedIndex;
  // Обновляем запись о рекорде
  recordNameLevel.textContent = `TOP ${
    levelName[gameLevel]
  }: ${recordStorage.getItem(levelName[gameLevel])}`;
}
