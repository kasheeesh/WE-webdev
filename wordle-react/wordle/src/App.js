// import './App.css';
// import './index.css';
// import { useState } from 'react';
// import Grid from './components/Grid';
// import Keyboard from './components/Keyboard';

// function App() {
//   const solution = 'REACT';
//   const [guesses, setGuesses] = useState(['', '', '', '', '', '']);
//   const [feedback, setFeedback] = useState(Array(6).fill(['', '', '', '', '']));
//   const [currentGuess, setCurrentGuess] = useState('');
//   const [currentRow, setCurrentRow] = useState(0);
//   const [usedLetters, setUsedLetters] = useState({});
//   const [gameOver, setGameOver] = useState(false);
//   const [gameMessage, setGameMessage] = useState('');

//   const handleLetterClick = (letter) => {
//     if (currentGuess.length < 5 && !gameOver) {
//       const updatedGuess = currentGuess + letter;
//       setCurrentGuess(updatedGuess);

//       setGuesses((prev) => {
//         const newGuesses = [...prev];
//         newGuesses[currentRow] = updatedGuess;
//         return newGuesses;
//       });
//     }
//   };

//   const handleSubmit = () => {
//     if (currentGuess.length === 5 && !gameOver) {
//       const newFeedback = [...feedback];
//       const currentFeedback = getFeedback(currentGuess, solution);
//       newFeedback[currentRow] = currentFeedback;

//       const newUsedLetters = { ...usedLetters };
//       updateUsedLetters(newUsedLetters, currentGuess, currentFeedback);

//       setFeedback(newFeedback);
//       setUsedLetters(newUsedLetters);

//       if (currentGuess === solution) {
//         setGameOver(true);
//         setGameMessage('Congratulations! You guessed the word!');
//         return;
//       }

//       if (currentRow === 5) {
//         setGameOver(true);
//         setGameMessage(`Game Over! The correct word was "${solution}".`);
//         return;
//       }

//       setCurrentGuess('');
//       setCurrentRow(currentRow + 1);
//     }
//   };

//   const getFeedback = (guess, solution) => {
//     return guess.split('').map((char, index) => {
//       if (char === solution[index]) return 'correct';
//       if (solution.includes(char)) return 'present';
//       return 'absent';
//     });
//   };

//   const updateUsedLetters = (usedLetters, guess, feedback) => {
//     guess.split('').forEach((char, index) => {
//       usedLetters[char] = feedback[index];
//     });
//   };

//   return (
//     <div className="App">
//       <h1>Wordle Clone</h1>
//       <Grid guesses={guesses} feedback={feedback} />
//       <button onClick={handleSubmit} disabled={currentGuess.length !== 5 || gameOver}>
//         Submit Guess
//       </button>
//       <Keyboard onLetterClick={handleLetterClick} usedLetters={usedLetters} />
//       {gameOver && <div className="game-over">{gameMessage}</div>}
//     </div>
//   );
// }

// export default App;


import './App.css';
import './index.css';
import { useState, useEffect } from 'react';
import Grid from './components/Grid';
import Keyboard from './components/Keyboard';
import guessResponse from './guess_respone.json'; // Import mock responses

function App() {
  const [guesses, setGuesses] = useState(['', '', '', '', '', '']);
  const [feedback, setFeedback] = useState(Array(6).fill(['', '', '', '', '']));
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [usedLetters, setUsedLetters] = useState({});
  const [gameOver, setGameOver] = useState(false);
  const [gameMessage, setGameMessage] = useState('');

  // Handle letter clicks
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

  // Handle submission of a guess
  const handleSubmit = () => {
    if (currentGuess.length === 5 && !gameOver) {
      const newFeedback = [...feedback];
      const currentFeedback = getFeedback(currentGuess, currentRow);
      newFeedback[currentRow] = currentFeedback;

      const newUsedLetters = { ...usedLetters };
      updateUsedLetters(newUsedLetters, currentGuess, currentFeedback);

      setFeedback(newFeedback);
      setUsedLetters(newUsedLetters);

      // Check if game is over
      if (currentGuess === guessResponse[currentRow].guess) {
        setGameOver(true);
        setGameMessage('Congratulations! You guessed the word!');
        return;
      }

      if (currentRow === 5) {
        setGameOver(true);
        setGameMessage(`Game Over! The correct word was "${guessResponse[currentRow].guess}".`);
        return;
      }

      setCurrentGuess('');
      setCurrentRow(currentRow + 1);
    }
  };

  // Generate feedback based on the mock response
  const getFeedback = (guess, row) => {
    const responseFeedback = guessResponse[row]?.feedback || [];
    return guess.split('').map((char, index) => {
      const feedbackStatus = responseFeedback[index] || 'B'; // Default to 'B' if no feedback
      return feedbackStatus === 'G' ? 'correct' :
             feedbackStatus === 'Y' ? 'present' :
             'absent'; // Map G -> correct, Y -> present, B -> absent
    });
  };

  // Update used letters based on feedback
  const updateUsedLetters = (usedLetters, guess, feedback) => {
    guess.split('').forEach((char, index) => {
      usedLetters[char] = feedback[index];
    });
  };

  // Function to handle dynamic letter color based on feedback
  const getLetterColor = (letter, row, col) => {
    const feedbackStatus = feedback[row] && feedback[row][col];
    switch (feedbackStatus) {
      case 'correct':
        return 'green'; // Green for correct letters
      case 'present':
        return 'yellow'; // Yellow for present letters
      case 'absent':
        return 'gray'; // Gray for absent letters
      default:
        return 'black'; // Default color for uncolored letters
    }
  };

  return (
    <div className="App">
      <h1>Wordle Clone</h1>
      <Grid guesses={guesses} feedback={feedback} getLetterColor={getLetterColor} />
      <button onClick={handleSubmit} disabled={currentGuess.length !== 5 || gameOver}>
        Submit Guess
      </button>
      <Keyboard onLetterClick={handleLetterClick} usedLetters={usedLetters} />
      {gameOver && <div className="game-over">{gameMessage}</div>}
    </div>
  );
}

export default App;
