"use strict"

/* game control  */

const game = document.querySelector(".main-game-fields")
const gameInGame = document.querySelectorAll(".hidden-item")
const newGame = document.querySelector(".start")
const restart = document.querySelector(".restart")
const multiplayer = document.querySelector(".multi")
const playerVsPc = document.querySelector(".pc")
const winnerCombination = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

let cells = game.children
cells.forEach = Array.prototype.forEach

/* records variables */

const records = document.querySelectorAll(".record-item")
const info = document.querySelectorAll(".result")
let results = []
let localResult = JSON.parse(localStorage.getItem("results"))
let arr = localResult
let result = ""

/* counters */

let count = 0
let egg = 0

/* flags */

let perem = false
let isMode = false
let isPlay = false
let isFlag = false

/* game styles */

const cross = `<img
class="cross"
src="./assets/logo/cross.png"
alt="cross_logo"
/>`
const zero = `<img
class="cross"
src="./assets/logo/zero.png"
alt="zero_logo"
/>`

/* song variables */

const clickSong = "./assets/audio/click.mp3"
const errorSong = "./assets/audio/EndGame.mp3"
const winSong = "./assets/audio/strikethrough.mp3"
const error = "Поле уже занято. Кликните в свободное поле"

/* menu buttons */

const settings = document.querySelector(".settings")
const moves = document.querySelectorAll(".move")
const hiddenTable = document.querySelector(".hide-table")
const table = document.querySelector(".main-client-table")
const clear = document.querySelector(".clear")

/* secondary functions */

function changeMode() {
  isPlay = true
  if (!isMode) {
    step(event)
  } else {
    computerStep(event)
  }
}

multiplayer.addEventListener("click", () => {
  if (!isPlay) {
    info[0].textContent = `Против игрока`
    return (isMode = false)
  }
})
playerVsPc.addEventListener("click", () => {
  if (!isPlay) {
    info[0].textContent = `Против компьютера`
    return (isMode = true)
  }
})

function audio(song) {
  let audio = new Audio(song)
  audio.play()
}

function winLine(i) {
  if (i < 3) {
    cells[winnerCombination[i][0]].classList.add("win-modify")
    cells[winnerCombination[i][1]].classList.add("win-modify")
    cells[winnerCombination[i][2]].classList.add("win-modify")
  }
  if (i >= 3 && i < 6) {
    cells[winnerCombination[i][0]].classList.add("win-column-modify")
    cells[winnerCombination[i][1]].classList.add("win-column-modify")
    cells[winnerCombination[i][2]].classList.add("win-column-modify")
  }
  if (i == 6) {
    cells[winnerCombination[i][0]].classList.add("win-diog-modify")
    cells[winnerCombination[i][1]].classList.add("win-diog-modify")
    cells[winnerCombination[i][2]].classList.add("win-diog-modify")
  }
  if (i == 7) {
    cells[winnerCombination[i][0]].classList.add("win-diog-r-modify")
    cells[winnerCombination[i][1]].classList.add("win-diog-r-modify")
    cells[winnerCombination[i][2]].classList.add("win-diog-r-modify")
  }
}

function getError() {
  audio(errorSong)
  setTimeout(() => {
    alert(error)
  }, 500)
  throw new Error(error)
}

function getRandom(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/* main function */

function checkWinner(f) {
  let trigger = false
  for (let i = 0; i <= winnerCombination.length - 1; i++) {
    if (
      cells[winnerCombination[i][0]].classList.contains("x") &&
      cells[winnerCombination[i][1]].classList.contains("x") &&
      cells[winnerCombination[i][2]].classList.contains("x")
    ) {
      audio(winSong)
      winLine(i)
      result = `Победа X`
      info[3].textContent = `${result}`
      setLocalStorage()
      egg++
      gameInGame[egg - 1].classList.add("visible-item")
      game.removeEventListener("click", f)
      trigger = true
      perem = true
      break
    } else if (
      cells[winnerCombination[i][0]].classList.contains("z") &&
      cells[winnerCombination[i][1]].classList.contains("z") &&
      cells[winnerCombination[i][2]].classList.contains("z")
    ) {
      audio(winSong)
      winLine(i)
      result = `Победа 0`
      info[3].textContent = `${result}`
      setLocalStorage()
      game.removeEventListener("click", f)
      trigger = true
      break
    }
  }
  if (count == 9 && !trigger) {
    result = `Ничья`
    console.log(result)
    info[3].textContent = `${result}`
    game.removeEventListener("click", f)
    setLocalStorage()
  }
}

game.addEventListener("click", changeMode)

newGame.addEventListener("click", () => {
  for (let i = 0; i <= results.length - 1; i++) {
    records[i].textContent = `${results[i]}`
  }
  info[1].textContent = `Игрок Х`
  isPlay = false
  count = 0
  cells.forEach((item) => {
    item.classList.remove(
      "x",
      "z",
      "win-modify",
      "win-column-modify",
      "win-diog-modify",
      "win-diog-r-modify"
    )
    item.innerHTML = ""
  })

  game.addEventListener("click", changeMode)
})

restart.addEventListener("click", () => {
  location.reload()
})

window.addEventListener("load", () => {
  if (results.length == 0) {
    info[3].textContent = `Необходимо сыграть`
  } else info[3].textContent = `${results[0]}`
})

function step(event) {
  if (!event.target.innerHTML) {
    if (count % 2 === 0) {
      if (event.target.classList.contains("main-game__field")) {
        info[1].textContent = `Игрок 0`
        event.target.innerHTML = cross
        event.target.classList.add("x")
        audio(clickSong)
        count++
        info[2].textContent = `${count}`
      }
    } else if (count % 2) {
      if (event.target.classList.contains("main-game__field")) {
        info[1].textContent = `Игрок X`
        event.target.innerHTML = zero
        event.target.classList.add("z")
        audio(clickSong)
        count++
        info[2].textContent = `${count}`
      }
    }
  } else {
    getError()
  }
  checkWinner(changeMode)
}

function computerStep(event) {
  if (!event.target.innerHTML) {
    if (event.target.classList.contains("main-game__field")) {
      info[1].textContent = `Компьютер`
      event.target.innerHTML = cross
      event.target.classList.add("x")
      audio(clickSong)
      count++
      game.removeEventListener("click", changeMode)
      info[2].textContent = `${count}`
      let interval = setInterval(function func() {
        let random = getRandom(0, cells.length - 1)
        if (perem) {
          location.reload()
          return
        }
        if (
          cells[random].classList.contains("x") ||
          cells[random].classList.contains("z")
        ) {
          return func()
        } else {
          game.addEventListener("click", changeMode)
          cells[random].classList.remove("z")
          info[1].textContent = `Игрок X`
          clearInterval(interval)
          cells[random].innerHTML = zero
          cells[random].classList.add("z")
          audio(clickSong)
          count++
          info[2].textContent = `${count}`
        }
      }, 500)
    }
  } else {
    getError()
  }

  checkWinner(changeMode)
}

/* local storage */

if (localResult) {
  results = arr
  for (let i = 0; i <= results.length - 1; i++) {
    records[i].textContent = `${results[i]}`
  }
} else {
  results = []
  info[3].textContent = `Необходимо сыграть`
}

function setLocalStorage() {
  if (results.length < 10) {
    results.unshift(result)
    localStorage.setItem("results", JSON.stringify(results))
  } else {
    results = results.slice(0, 9)
    results.unshift(result)
    localStorage.setItem("results", JSON.stringify(results))
  }
}

/* menu buttons */

clear.addEventListener("click", () => {
  localStorage.removeItem("results")
  info[3].textContent = `Необходимо сыграть`
  for (let i = 0; i <= results.length - 1; i++) {
    records[i].textContent = `Нет игр`
  }
})

hiddenTable.addEventListener("click", () => {
  table.classList.toggle("visible-item")
})

settings.addEventListener("click", () => {
  if (!isFlag) {
    for (let i = 0; i <= moves.length - 1; i++) {
      moves[i].style.left = `${300 * (i + 1)}px`

      isFlag = true
    }
  } else {
    for (let i = 0; i <= moves.length - 1; i++) {
      moves[i].style.left = `0`

      isFlag = false
    }
  }
})
