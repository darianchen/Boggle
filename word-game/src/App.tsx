import { useState } from 'react'
import './App.css'

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
const WORD_LIST = new Set([
  'CAT', 'DOG', 'RAT', 'BAT', 'HAT', 'CAR', 'CARE', 'RACE', 'DEAR',
  'READ', 'DATE', 'GATE', 'LATE', 'TIRE', 'RIDE', 'SIDE', 'TIDE',
  'NOTE', 'TONE', 'DONE', 'GONE', 'LONE', 'BONE', 'NINE', 'LINE',
  'MINE', 'WINE', 'VINE', 'FIRE', 'HIRE', 'WIRE', 'RISE', 'WISE',
  'NOSE', 'ROSE', 'HOSE', 'HOLE', 'MOLE', 'SOLE', 'SOLD', 'GOLD',
  'BOLD', 'TOLD', 'HOLD',
])

function isWord(word: string): boolean {
  return WORD_LIST.has(word.toUpperCase())
}

type Cell = { row: number; col: number }

function App() {
  const [grid] = useState<string[][]>(() => makeGrid(GRID_SIZE))
  const [selected, setSelected] = useState<Cell[]>([])

  const isSelected = (row: number, col: number) =>
    selected.some((cell) => cell.row === row && cell.col === col)

  const handleClick = (row: number, col: number) => {
    if (isSelected(row, col)) return
    setSelected([...selected, { row, col }])
  }

  const handleClear = () => {
    setSelected([])
  }

  const currentWord = selected.map(({ row, col }) => grid[row][col]).join('')
  const currentWordIsValid = currentWord.length > 0 && isWord(currentWord)

  return (
    <div id="game">
      <h1>Word Game</h1>

      <div className="word-display">
        {currentWord || 'Click letters to form a word'}
        {currentWordIsValid && <span className="valid-badge"> ✓ valid word</span>}
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
