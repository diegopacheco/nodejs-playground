import { useState, useEffect, useCallback } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import confetti from 'canvas-confetti'
import questions from './questions'
import './App.css'

const QUESTIONS_PER_GAME = 10
const TIME_PER_QUESTION = 30

function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function App() {
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem('jsTrivia')
    if (saved) {
      return JSON.parse(saved)
    }
    return {
      status: 'menu',
      score: 0,
      currentQuestion: 0,
      selectedQuestions: [],
      highScore: 0,
      gamesPlayed: 0
    }
  })

  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    localStorage.setItem('jsTrivia', JSON.stringify(gameState))
  }, [gameState])

  useEffect(() => {
    if (gameState.status !== 'playing' || showResult) return
    if (timeLeft <= 0) {
      handleTimeout()
      return
    }
    const timer = setInterval(() => {
      setTimeLeft(t => t - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft, gameState.status, showResult])

  const handleTimeout = useCallback(() => {
    setShowResult(true)
    setTimeout(() => {
      nextQuestion()
    }, 2000)
  }, [gameState.currentQuestion])

  const fireConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
    })
  }

  const startGame = () => {
    const shuffled = shuffleArray(questions).slice(0, QUESTIONS_PER_GAME)
    setGameState(prev => ({
      ...prev,
      status: 'playing',
      score: 0,
      currentQuestion: 0,
      selectedQuestions: shuffled,
      gamesPlayed: prev.gamesPlayed + 1
    }))
    setTimeLeft(TIME_PER_QUESTION)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const handleAnswer = (index) => {
    if (showResult) return
    setSelectedAnswer(index)
    setShowResult(true)
    const currentQ = gameState.selectedQuestions[gameState.currentQuestion]
    const isCorrect = index === currentQ.correct
    if (isCorrect) {
      fireConfetti()
      setGameState(prev => ({
        ...prev,
        score: prev.score + 1
      }))
    }
    setTimeout(() => {
      nextQuestion()
    }, 2000)
  }

  const nextQuestion = () => {
    if (gameState.currentQuestion >= QUESTIONS_PER_GAME - 1) {
      setGameState(prev => ({
        ...prev,
        status: 'finished',
        highScore: Math.max(prev.highScore, prev.score + (selectedAnswer === gameState.selectedQuestions[gameState.currentQuestion]?.correct ? 1 : 0))
      }))
    } else {
      setGameState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1
      }))
      setTimeLeft(TIME_PER_QUESTION)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const goToMenu = () => {
    setGameState(prev => ({
      ...prev,
      status: 'menu'
    }))
  }

  const currentQuestion = gameState.selectedQuestions[gameState.currentQuestion]

  if (gameState.status === 'menu') {
    return (
      <div className="app">
        <div className="menu-container">
          <h1 className="title">Nasty JS Trivia</h1>
          <p className="subtitle">Think you know JavaScript? Think again!</p>
          <div className="stats-box">
            <div className="stat">
              <span className="stat-label">High Score</span>
              <span className="stat-value">{gameState.highScore}/{QUESTIONS_PER_GAME}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Games Played</span>
              <span className="stat-value">{gameState.gamesPlayed}</span>
            </div>
          </div>
          <button className="start-button" onClick={startGame}>
            Start Game
          </button>
        </div>
      </div>
    )
  }

  if (gameState.status === 'finished') {
    const percentage = (gameState.score / QUESTIONS_PER_GAME) * 100
    let message = ''
    if (percentage === 100) message = 'Perfect! You are a JS wizard!'
    else if (percentage >= 80) message = 'Excellent! You really know your JS quirks!'
    else if (percentage >= 60) message = 'Good job! But JS still has surprises for you!'
    else if (percentage >= 40) message = 'Not bad! Keep learning those JS gotchas!'
    else message = 'JavaScript is weird, right? Keep practicing!'

    return (
      <div className="app">
        <div className="result-container">
          <h1 className="title">Game Over!</h1>
          <div className="final-score">
            <span className="score-number">{gameState.score}</span>
            <span className="score-total">/ {QUESTIONS_PER_GAME}</span>
          </div>
          <p className="result-message">{message}</p>
          <div className="button-group">
            <button className="start-button" onClick={startGame}>
              Play Again
            </button>
            <button className="menu-button" onClick={goToMenu}>
              Main Menu
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="game-header">
        <div className="score-display">
          <span className="score-label">Score</span>
          <span className="score-value">{gameState.score}/{QUESTIONS_PER_GAME}</span>
        </div>
        <div className="question-counter">
          Question {gameState.currentQuestion + 1} of {QUESTIONS_PER_GAME}
        </div>
        <div className={`timer ${timeLeft <= 10 ? 'timer-warning' : ''} ${timeLeft <= 5 ? 'timer-danger' : ''}`}>
          <span className="timer-value">{timeLeft}s</span>
        </div>
      </div>

      <div className="timer-bar">
        <div
          className="timer-bar-fill"
          style={{ width: `${(timeLeft / TIME_PER_QUESTION) * 100}%` }}
        />
      </div>

      <div className="question-container">
        <h2 className="question-title">What will this code output?</h2>
        <div className="code-block">
          <SyntaxHighlighter
            language="javascript"
            style={vscDarkPlus}
            customStyle={{
              borderRadius: '12px',
              fontSize: '2rem',
              padding: '2rem',
              margin: 0,
              lineHeight: '1.5'
            }}
          >
            {currentQuestion?.code || ''}
          </SyntaxHighlighter>
        </div>

        <div className="options-grid">
          {currentQuestion?.options.map((option, index) => {
            let optionClass = 'option-button'
            if (showResult) {
              if (index === currentQuestion.correct) {
                optionClass += ' correct'
              } else if (index === selectedAnswer && index !== currentQuestion.correct) {
                optionClass += ' incorrect'
              }
            }
            return (
              <button
                key={index}
                className={optionClass}
                onClick={() => handleAnswer(index)}
                disabled={showResult}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default App
