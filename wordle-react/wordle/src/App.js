
import './App.css';
import './index.css';
import { useState } from 'react';
import Square from './components/Square';
import Row from './components/Row';
import Grid from './components/Grid';
import Keyboard from './components/Keyboard';

function App() {
  const solution = 'REACT';
  const [guesses, setGuesses] = useState(['', '', '', '', '', '']);
  const [feedback, setFeedback] = useState(Array(6).fill(['', '', '', '', '']));
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [usedLetters, setUsedLetters] = useState({});

  const handleLetterClick = (letter) => {
    if (currentGuess.length < 5) {
      setCurrentGuess((prev) => prev + letter);
    }
  };

  const handleSubmit = () => {
    if (currentGuess.length === 5) {
      const newGuesses = [...guesses];
      newGuesses[currentRow] = currentGuess;

      const newFeedback = [...feedback];
      newFeedback[currentRow] = getFeedback(currentGuess, solution);

      const newUsedLetters = { ...usedLetters };
      updateUsedLetters(newUsedLetters, currentGuess, newFeedback[currentRow]);

      setGuesses(newGuesses);
      setFeedback(newFeedback);
      setUsedLetters(newUsedLetters);
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
      <button onClick={handleSubmit} disabled={currentGuess.length !== 5}>
        Submit Guess
      </button>
      <Keyboard onLetterClick={handleLetterClick} usedLetters={usedLetters} />
    </div>
  );
}

export default App;


