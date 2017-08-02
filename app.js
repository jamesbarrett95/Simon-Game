const checkbox = document.querySelector(`input[type='checkbox']`)
const options = document.querySelector('.options')
const startButton = document.getElementById('start')
const strictButton = document.getElementById('strict')
const counter = document.querySelector('.counter')
const toggled = document.querySelector('.toggled')
const pods = document.querySelectorAll('.pod')
const winPromptContainer = document.querySelector('.win-prompt')
const playAgainButton = document.getElementById('play-again')

let sequence = []
let playerIndex = 0
let level = 1
// A set flag that, once set to true, will halt the execution of getPattern()
let cancelled = false

function enableStrict () {
  toggled.classList.toggle('enabled')
}

function resetValues () {
  sequence = []
  playerIndex = 0
  level = 1
}

function playAgain () {
  winPromptContainer.style.display = 'none'
  startButton.pointerEvents = 'auto'
  startButton.click()
}

function alterPods (action) {
  if (action) {
    pods.forEach(function (pod) {
      pod.style.pointerEvents = 'auto'
      pod.style.cursor = 'pointer'
    })
  } else {
    pods.forEach(function (pod) {
      pod.style.pointerEvents = 'none'
      pod.style.cursor = 'default'
    })
  }
}

function removePlaying (e) {
  e.target.classList.remove('playing')
}

function checkUserSequence () {
  const audio = this.firstElementChild
  audio.play()

  if (sequence[playerIndex] === this) {
    playerIndex++
    console.log('selection correct!')
  } else {
    console.log('incorrect!')
    alterPods(false)
    showPattern(sequence)
    playerIndex = 0
  }

  if (playerIndex === sequence.length) {
    if (level === 2) {
      alterPods(false)
      console.log('you win!')
      winPromptContainer.style.display = 'block'
    } else {
      alterPods(false)
      console.log('level up!')
      counter.textContent++
      level++
      playerIndex = 0
      getRandomPod()
    }
  }

  this.classList.add('playing')
}

function showPattern (sequence) {
  let localSequence = [...sequence]

  function addClassAfterTwoSeconds (el) {
    if (cancelled) return
    return new Promise(resolve => {
      setTimeout(_ => {
        const audio = el.firstElementChild
        el.classList.add('playing')
        audio.play()
        resolve()
      }, 1500)
    })
  }

  function addClassesSequentially (localSequence) {
    let item = localSequence.shift()
    return item ? addClassAfterTwoSeconds(item).then(addClassesSequentially.bind(null, localSequence)) : Promise.resolve()
  }

  addClassesSequentially(localSequence).then(_ => {
    alterPods(true)
  })
}

function getRandomPod () {
  const indexOfPod = Math.floor(Math.random() * pods.length)
  const randomPod = pods[indexOfPod]
  sequence.push(randomPod)
  showPattern(sequence)
}

function startGame () {
  resetValues()
  counter.textContent = level
  this.style.pointerEvents = 'none'
  alterPods(false)
  getRandomPod()
}

function power () {
  if (this.checked) {
    options.classList.add('visible')
    options.classList.remove('hidden')
    startButton.style.pointerEvents = 'auto'
    cancelled = false
  } else {
    winPromptContainer.style.display = 'none'
    options.classList.remove('visible')
    options.classList.add('hidden')
    startButton.style.pointerEvents = 'none'
    counter.textContent = '-'
    cancelled = true
    resetValues()
  }
}

checkbox.addEventListener('click', power)
startButton.addEventListener('click', startGame)
strictButton.addEventListener('click', enableStrict)
playAgainButton.addEventListener('click', playAgain)
pods.forEach(pod => pod.addEventListener('transitionend', removePlaying))
pods.forEach(pod => pod.addEventListener('click', checkUserSequence))
