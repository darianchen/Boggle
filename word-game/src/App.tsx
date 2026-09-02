import { useState } from 'react'
import './App.css'
import { WORD_LIST } from './wordList'
const GRID_SIZE = 4
const LETTER_POOL = 'EEEEEEEEEEEEAAAAAAAAAIIIIIIIIIOOOOOOOONNNNNNRRRRRRTTTTTTLLLLSSSSUUUUDDDDGGGBBCCMMPPFFHHVVWWYYKJXQZ'

function pickRandomLetter(): string {
  return LETTER_POOL[Math.floor(Math.random() * LETTER_POOL.length)]
}

function makeGrid(size: number): string[][] {
  const grid: string[][] = []
  for (let row = 0; row < size; row++) {
    const rowLetters: string[] = []
    for (let col = 0; col < size; col++) {
      rowLetters.push(pickRandomLetter())
    }
    grid.push(rowLetters)
  }
  return grid
}
function isWord(word: string): boolean {
  return WORD_LIST.has(word.toUpperCase())
}

type Cell = { row: number; col: number }

function App() {
  const [grid, setGrid] = useState<string[][]>(() => makeGrid(GRID_SIZE))
  const [selected, setSelected] = useState<Cell[]>([])
  const [foundWord, setFoundWord] = useState<string | null>(null)
  const [foundWords, setFoundWords] = useState<string[]>([])
  const [points, setPoints] = useState<number>(0)

  const isSelected = (row: number, col: number) =>
    selected.some((cell) => cell.row === row && cell.col === col)

  const isAdjacent = (row: number, col: number) => {
    if (selected.length === 0) return true // first click
    const last = selected[selected.length - 1]
    return Math.abs(last.row - row) <= 1 && Math.abs(last.col - col) <= 1
  }

  const handleClick = (row: number, col: number) => {
    setFoundWord(null)
    if (isSelected(row, col)) {
      setSelected([]);
      return;
    }
    if (!isAdjacent(row, col)) return
    const coordinates = [...selected, { row, col }]
    const possibleWord = coordinates.map((cell) => grid[cell.row][cell.col]).join('')
    if (isWord(possibleWord) && !foundWords.includes(possibleWord)) {
      setSelected([])
      setFoundWord(possibleWord)
      setFoundWords([...foundWords, possibleWord])
      possibleWord.length === 3 ? setPoints(points + 1) : setPoints(points + 2)
    } else {
      setSelected(coordinates)
    }
  }

  const handleClear = () => {
    setSelected([])
    setFoundWord(null)
  }

  const deleteLetters = (coordinates: []) => {
    // delete all the selected letters that make a word
    // starting from the bottom make the letters drop
    for(let i = 0; i < coordinates.length; i++) {
      
    }
  }

  const currentWord = selected.map(({ row, col }) => grid[row][col]).join('')
  const currentWordIsValid = currentWord.length > 0 && isWord(currentWord) && !foundWords.includes(currentWord)

  return (
    <div id="game">
      <h1>Boggle</h1>
      <p className="byline">by Darian Chen</p>

      <div className="score">Score: {points}</div>

      <div className="word-display">
        {foundWord ? (
          <span className="congrats">🎉 Congrats, you found "{foundWord}"!</span>
        ) : (
          <>
            {currentWord || 'Click letters to form a word'}
            {currentWordIsValid && <span className="valid-badge"> ✓ valid word</span>}
          </>
        )}
      </div>

      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
      >
        {grid.map((rowLetters, row) =>
          rowLetters.map((letter, col) => (
            <button
              key={`${row}-${col}`}
              className={`cell${isSelected(row, col) ? ' selected' : ''}`}
              onClick={() => handleClick(row, col)}
            >
              {letter}
            </button>
          )),
        )}
      </div>

      <button className="clear-button" onClick={handleClear}>
        Clear
      </button>
    </div>
  )
}

export default App
