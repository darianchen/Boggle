import { useState } from 'react'
import './App.css'
import { WORD_LIST } from './wordList'
const GRID_SIZE = 4
const LETTER_POOL = 'EEEEEEEEEEEEAAAAAAAAAIIIIIIIIIOOOOOOOONNNNNNRRRRRRTTTTTTLLLLSSSSUUUUDDDDGGGBBCCMMPPFFHHVVWWYYKJXQZ'

function pickRandomLetter(): string {
  return LETTER_POOL[Math.floor(Math.random() * LETTER_POOL.length)]
}

// grid[col][row] — each inner array is one column, top row first, so
// dropping letters is just an operation on a single column array
function makeGrid(size: number): string[][] {
  const grid: string[][] = []
  for (let col = 0; col < size; col++) {
    const colLetters: string[] = []
    for (let row = 0; row < size; row++) {
      colLetters.push(pickRandomLetter())
    }
    grid.push(colLetters)
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
    setSelected((prev) => [...prev, {row, col}])
  }

  const handleClear = () => {
    setSelected([])
    setFoundWord(null)
  }

  const handleSubmit = () => {
    if (isWord(currentWord) && !foundWords.includes(currentWord)) {
      setFoundWord(currentWord)
      setFoundWords([...foundWords, currentWord])
      setPoints((prev) => prev + currentWord.length)
      deleteLetters()
      setSelected([])
    }
  }

  const deleteLetters = () => {
    const deletedRowsByCol = new Map<number, Set<number>>()
    for (const { row, col } of selected) {
      if (!deletedRowsByCol.has(col)) deletedRowsByCol.set(col, new Set())
      deletedRowsByCol.get(col)!.add(row)
    }

    setGrid((prevGrid) =>
      prevGrid.map((colLetters, col) => {
        const deletedRows = deletedRowsByCol.get(col)
        if (!deletedRows) return colLetters
        const remaining = colLetters.filter((_, row) => !deletedRows.has(row))
        const newLetters = Array.from({ length: colLetters.length - remaining.length }, pickRandomLetter)
        return [...newLetters, ...remaining]
      }),
    )
  }

  const currentWord = selected.map(({ row, col }) => grid[col][row]).join('')
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
        {Array.from({ length: GRID_SIZE }, (_, row) =>
          grid.map((colLetters, col) => (
            <button
              key={`${row}-${col}`}
              className={`cell${isSelected(row, col) ? ' selected' : ''}`}
              onClick={() => handleClick(row, col)}
            >
              {colLetters[row]}
            </button>
          )),
        )}
      </div>

      <button className="submit-button" onClick={handleSubmit}>
        Submit
      </button>

      <button className="clear-button" onClick={handleClear}>
        Clear
      </button>
    </div>
  )
}

export default App
