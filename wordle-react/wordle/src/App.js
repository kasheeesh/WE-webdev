import './App.css';
import './index.css';
import { useState } from 'react';
import Grid from './components/Grid';
import Keyboard from './components/Keyboard';

function App() {
  const solution = 'REACT';
  const [guesses, setGuesses] = useState(['', '', '', '', '', '']);
  const [feedback, setFeedback] = useState(Array(6).fill(['', '', '', '', '']));
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [usedLetters, setUsedLetters] = useState({});
  const [gameOver, setGameOver] = useState(false);
  const [gameMessage, setGameMessage] = useState('');

  const handleLetterClick = (letter) => {
    if (currentGuess.length < 5 && !gameOver) {
      const updatedGuess = currentGuess + letter;
      setCurrentGuess(updatedGuess);

      setGuesses((prev) => {
        const newGuesses = [...prev];
        newGuesses[currentRow] = updatedGuess;
        return newGuesses;
      });
    }
  };

  const handleSubmit = () => {
    if (currentGuess.length === 5 && !gameOver) {
      const newFeedback = [...feedback];
      const currentFeedback = getFeedback(currentGuess, solution);
      newFeedback[currentRow] = currentFeedback;

      const newUsedLetters = { ...usedLetters };
      updateUsedLetters(newUsedLetters, currentGuess, currentFeedback);

      setFeedback(newFeedback);
      setUsedLetters(newUsedLetters);

      if (currentGuess === solution) {
        setGameOver(true);
        setGameMessage('Congratulations! You guessed the word!');
        return;
      }

      if (currentRow === 5) {
        setGameOver(true);
        setGameMessage(`Game Over! The correct word was "${solution}".`);
        return;
      }

      setCurrentGuess('');
      setCurrentRow(currentRow + 1);
    }
  };

  const getFeedback = (guess, solution) => {
    return guess.split('').map((char, index) => {
      if (char === solution[index]) return 'correct';
      if (solution.includes(char)) return 'present';
      return 'absent';
    });
  };

  const updateUsedLetters = (usedLetters, guess, feedback) => {
    guess.split('').forEach((char, index) => {
      usedLetters[char] = feedback[index];
    });
  };

  return (
    <div className="App">
      <h1>Wordle Clone</h1>
      <Grid guesses={guesses} feedback={feedback} />
      <button onClick={handleSubmit} disabled={currentGuess.length !== 5 || gameOver}>
        Submit Guess
      </button>
      <Keyboard onLetterClick={handleLetterClick} usedLetters={usedLetters} />
      {gameOver && <div className="game-over">{gameMessage}</div>}
    </div>
  );
}

export default App;
