// DOM elements
const word = document.getElementById('word')
const playBtn = document.getElementById('play-btn')
const text = document.getElementById('text')
const scoreEl = document.getElementById('score')
const timeEl = document.getElementById('time')
const endgameEl = document.getElementById('end-game-modal')
const restartBtn = document.getElementById('restart-btn');
const settingsBtn = document.getElementById('settings-btn')
const settings = document.getElementById('settings')
const settingsForm = document.getElementById('settings-form')
const difficultySelect = document.getElementById('difficulty')
const languageSelect = document.getElementById('language')  

// Init
let randomWord
let score = 0
let time = 10
let timeInterval

// Load saved preferences
let difficulty = localStorage.getItem('difficulty') ?? 'medium'
let selectedLanguage = localStorage.getItem('language') ?? 'en'

// Apply saved preferences to selects
difficultySelect.value = difficulty
languageSelect.value = selectedLanguage

// Language options map
const languages = {
    en: "English",
    es: "Spanish",
    fr: "French",
    zh: "Chinese",
    it: "Italian",
    ro: "Romanian",
    de: "German",
    "pt-br": "Portuguese (Brazil)"
}


function choose_language() {
    Object.entries(languages).forEach(([code, name]) => {
        const option = document.createElement("option")
        option.value = code
        option.textContent = name
        languageSelect.appendChild(option)
    })
    // Restore saved language selection AFTER options are added
    languageSelect.value = selectedLanguage
}

choose_language() 

// Game start
function startGame() {
    playBtn.style.display = 'none';
    score = 0
    time = 10

    scoreEl.innerHTML = score
    timeEl.innerHTML = time + 's'
    

    text.disabled = false
    text.value = ''
    text.focus()

    addWordToDOM()
    timeInterval = setInterval(updateTime, 1000)
}

playBtn.addEventListener('click', startGame)


async function addWordToDOM() {
    const res = await fetch(`https://random-word-api.herokuapp.com/word?lang=${languageSelect.value}`)
    const data = await res.json()
    randomWord = data[0].normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    word.innerHTML = randomWord
}

function updateScore() {
    score++
    scoreEl.innerHTML = score
}

function updateTime() {
    time--
    timeEl.innerHTML = time + 's'
    if (time <= 0) {
        clearInterval(timeInterval)
        gameOver()
    }
}

function gameOver() {
    console.log("Game over");
    clearInterval(timeInterval)
    timeEl.innerHTML = '0s'
    text.disabled = true
    document.getElementById('final-score').textContent = score
    endgameEl.style.display = 'flex';


}

restartBtn.addEventListener("click", () => {
    endgameEl.style.display = 'none'
    playBtn.style.display = 'inline-block'
    word.innerHTML = ''
    scoreEl.innerHTML = '0'
    timeEl.innerHTML = '10s'
})



// Typing input handler
text.addEventListener('input', e => {
    const insertedText = e.target.value

    if (insertedText === randomWord) {
        addWordToDOM()
        updateScore()
        e.target.value = ''

        if (difficulty === 'hard') {
            time += 2
        } else if (difficulty === 'medium') {
            time += 3
        } else {
            time += 5
        }
    }
})

// Settings toggle
settingsBtn.addEventListener('click', () => settings.classList.toggle('hide'))

settingsForm.addEventListener('change', () => {
    difficulty = difficultySelect.value
    selectedLanguage = languageSelect.value
    localStorage.setItem('difficulty', difficulty)
    localStorage.setItem('language', selectedLanguage)
})