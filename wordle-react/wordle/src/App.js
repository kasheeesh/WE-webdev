


// import './App.css';
// import './index.css';
// import { useState } from 'react';
// import Grid from './components/Grid';
// import Keyboard from './components/Keyboard';
// import guessResponse from './guess_respone.json'; 

// function App() {
//   const [guesses, setGuesses] = useState(['', '', '', '', '', '']);
//   const [feedback, setFeedback] = useState(Array(6).fill(['', '', '', '', '']));
//   const [currentGuess, setCurrentGuess] = useState('');
//   const [currentRow, setCurrentRow] = useState(0);
//   const [usedLetters, setUsedLetters] = useState({});
//   const [gameOver, setGameOver] = useState(false);
//   const [gameMessage, setGameMessage] = useState('');

//   // Handle letter clicks
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

//   // Handle submission of a guess
//   const handleSubmit = () => {
//     if (currentGuess.length === 5 && !gameOver) {
//       const newFeedback = [...feedback];
//       const currentFeedback = getFeedback(currentGuess, currentRow);
//       newFeedback[currentRow] = currentFeedback;

//       const newUsedLetters = { ...usedLetters };
//       updateUsedLetters(newUsedLetters, currentGuess, currentFeedback);

//       setFeedback(newFeedback);
//       setUsedLetters(newUsedLetters);

//       // Check if game is over
//       if (currentGuess === guessResponse[currentRow].guess) {
//         setGameOver(true);
//         setGameMessage('Congratulations! You guessed the word!');
//         return;
//       }

//       if (currentRow === 5) {
//         setGameOver(true);
//         setGameMessage(`Game Over! The correct word was "${guessResponse[currentRow].guess}".`);
//         return;
//       }

//       setCurrentGuess('');
//       setCurrentRow(currentRow + 1);
//     }
//   };

  
//   const getFeedback = (guess, row) => {
//     const responseFeedback = guessResponse[row]?.feedback || [];
//     return guess.split('').map((char, index) => {
//       const feedbackStatus = responseFeedback[index] || 'B'; 
//       return feedbackStatus === 'G' ? 'correct' :
//              feedbackStatus === 'Y' ? 'present' :
//              'absent'; 
//     });
//   };

  
//   const updateUsedLetters = (usedLetters, guess, feedback) => {
//     guess.split('').forEach((char, index) => {
//       usedLetters[char] = feedback[index];
//     });
//   };

//   const getLetterColor = (letter, row, col) => {
//     const feedbackStatus = feedback[row] && feedback[row][col];
//     switch (feedbackStatus) {
//       case 'correct':
//         return 'green';
//       case 'present':
//         return 'yellow';
//       case 'absent':
//         return 'gray';
//       default:
//         return 'black';
//     }
//   };

//   return (
//     <div className="App">
//       <h1>Wordle Clone</h1>
//       <Grid guesses={guesses} feedback={feedback} getLetterColor={getLetterColor} />
//       <button onClick={handleSubmit} disabled={currentGuess.length !== 5 || gameOver}>
//         Submit Guess
//       </button>
//       <Keyboard onLetterClick={handleLetterClick} usedLetters={usedLetters} />
//       {gameOver && <div className="game-over">{gameMessage}</div>}
//     </div>
//   );
// }

// export default App;
import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css';
import Grid from './components/Grid';
import Keyboard from './components/Keyboard';

function App() {
  const [gameId, setGameId] = useState('');
  const [guesses, setGuesses] = useState(['', '', '', '', '']);
  const [feedback, setFeedback] = useState(Array(6).fill(['', '', '', '', '']));
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [usedLetters, setUsedLetters] = useState({});
  const [gameOver, setGameOver] = useState(false);
  const [gameMessage, setGameMessage] = useState('');
  const [guessesLeft, setGuessesLeft] = useState(5);

  // Utility function to make API calls
  const apiCall = async (url, method, body = null) => {
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies in the request
      };
      if (body) options.body = JSON.stringify(body);

      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Unknown error');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error during API call to ${url}:`, error);
      return null;
    }
  };

  // Register and create the game
  useEffect(() => {
    const initializeGame = async () => {
      try {
        console.log('Registering and creating game...');
        // Register the game
        const registerData = await apiCall(
          'https://we6.talentsprint.com/wordle/game/register',
          'POST',
          { mode: 'wordle', name: 'kasheesh' }
        );

        if (!registerData) return;

        const { id } = registerData;
        setGameId(id);

        // Create the game
        const createData = await apiCall(
          'https://we6.talentsprint.com/wordle/game/create',
          'POST',
          { id, overwrite: true }
        );

        if (createData) {
          console.log('Game initialized successfully:', createData);
        }
      } catch (error) {
        console.error('Error during game initialization:', error);
      }
    };

    initializeGame();
  }, []);

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
  const handleSubmit = async () => {
    if (currentGuess.length === 5 && !gameOver && guessesLeft > 0) {
      const newFeedback = [...feedback];
      const response = await apiCall(
        'https://we6.talentsprint.com/wordle/game/guess',
        'POST',
        { guess: currentGuess, id: gameId }
      );

      if (response) {
        const { feedback: feedbackStr, message } = response;
        newFeedback[currentRow] = feedbackStr.split('').map(getFeedbackStatus);

        setFeedback(newFeedback);
        setGuessesLeft((prev) => prev - 1);
        setGameMessage(message);

        if (feedbackStr === 'GGGGG') {
          setGameOver(true);
          setGameMessage('Congratulations! You guessed the word!');
        } else if (guessesLeft === 1) {
          setGameOver(true);
          setGameMessage(`Game Over! The correct word was "${currentGuess}".`);
        } else {
          setCurrentGuess('');
          setCurrentRow(currentRow + 1);
        }
      }
    }
  };

  // Get feedback status
  const getFeedbackStatus = (status) => {
    switch (status) {
      case 'G':
        return 'correct';
      case 'Y':
        return 'present';
      case 'R':
        return 'absent';
      default:
        return '';
    }
  };

  const getLetterColor = (letter, row, col) => {
    const feedbackStatus = feedback[row] && feedback[row][col];
    switch (feedbackStatus) {
      case 'correct':
        return 'green';
      case 'present':
        return 'yellow';
      case 'absent':
        return 'gray';
      default:
        return 'black';
    }
  };

  return (
    <div className="App">
      <h1>Wordle Game</h1>
      <Grid guesses={guesses} feedback={feedback} getLetterColor={getLetterColor} />
      <button onClick={handleSubmit} disabled={currentGuess.length !== 5 || gameOver || guessesLeft <= 0}>
        Submit Guess
      </button>
      <Keyboard onLetterClick={handleLetterClick} usedLetters={usedLetters} />
      {gameOver && <div className="game-over">{gameMessage}</div>}
      <div>Guesses Left: {guessesLeft}</div>
    </div>
  );
}

export default App;
