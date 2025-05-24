const socket = io();

const nameForm = document.querySelector('#name-form')
const nameInput = document.querySelector('#name-input')
const gameDiv = document.querySelector('#game')
const welcomeText = document.querySelector('#welcome')
const totalText = document.querySelector('#total')
const rollButton = document.querySelector('#roll')
const diceLog = document.querySelector('#log')

const messageForm = document.querySelector('#message-form')
const messageInput = document.querySelector('#message-input')
const messageLog = document.querySelector('#message-log')

let username = null
let total = 0

nameForm.addEventListener('submit', function(e) {
  e.preventDefault()

  if (nameInput.value) {
    username = nameInput.value
    nameForm.style.display = 'none'
    gameDiv.style.display = 'flex'
    welcomeText.textContent = `Välkommen ${username}`
  }
})

rollButton.addEventListener('click', () => {
  let roll = Math.floor(Math.random()*6+1)
  total += roll

  socket.emit('diceRoll', {
    name: username,
    roll: roll,
    total: total
  })
})

socket.on('newDiceRoll', (data) => {
  let item = document.createElement('li')
  item.textContent = `${data.name}: ${data.roll} (Totalt: ${data.total})`
  diceLog.appendChild(item)
})

messageForm.addEventListener('submit', function(e) {
  e.preventDefault()

  if (messageInput.value) {
    socket.emit('chatMessage', {
      name: username,
      message: messageInput.value
    })

    messageInput.value = ''
  }
})

socket.on('newChatMessage', (data) => {
  let item = document.createElement('li')
  item.textContent = `${data.name}: ${data.message}`
  messageLog.appendChild(item)
})