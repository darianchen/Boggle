import { useState } from 'react'
import './App.css'

const GRID_SIZE = 4
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function makeGrid(size: number): string[][] {
  const grid: string[][] = []
  for (let row = 0; row < size; row++) {
    const rowLetters: string[] = []
    for (let col = 0; col < size; col++) {
      rowLetters.push(LETTERS[Math.floor(Math.random() * LETTERS.length)])
    }
    grid.push(rowLetters)
  }
  return grid
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

  return (
    <div id="game">
      <h1>Word Game</h1>

      <div className="word-display">{currentWord || 'Click letters to form a word'}</div>

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
