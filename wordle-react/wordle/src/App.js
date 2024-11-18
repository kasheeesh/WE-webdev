


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
  const [guesses, setGuesses] = useState(['', '', '', '', '', '']);
  const [feedback, setFeedback] = useState(Array(6).fill(['', '', '', '', '']));
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [usedLetters, setUsedLetters] = useState({});
  const [gameOver, setGameOver] = useState(false);
  const [gameMessage, setGameMessage] = useState('');
  const [guessesLeft, setGuessesLeft] = useState(5);

  
  const registerGame = async () => {
    try {
      const response = await fetch('https://we6.talentsprint.com/wordle/game/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'wordle',
          name: 'kasheesh', // Name can be dynamic
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to register game:', errorData.message || 'Unknown error');
        return;
      }

      const data = await response.json();
      setGameId(data.id); // Save the game ID from the response
      console.log('Game registered successfully:', data);

      // Now, create the game
      createGame(data.id); // Call createGame with the ID from registration response
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  // Create game function
  const createGame = async (id) => {
    try {
      const response = await fetch('https://we6.talentsprint.com/wordle/game/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          overwrite: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to create game:', errorData.message || 'Unknown error');
        return;
      }

      const data = await response.json();
      console.log('Game created successfully:', data);
    } catch (error) {
      console.error('Error during game creation:', error);
    }
  };

  
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

  const handleSubmit = async () => {
    if (currentGuess.length === 5 && !gameOver && guessesLeft > 0) {
      const newFeedback = [...feedback];
      const response = await submitGuess(currentGuess, gameId);
      
      if (response) {
        const { feedback: feedbackStr, message } = response;
        newFeedback[currentRow] = feedbackStr.split('').map(status => getFeedbackStatus(status));
        
        setFeedback(newFeedback);
        setGuessesLeft((prev) => prev - 1); 
        setGameMessage(message);
        
        if (feedbackStr === 'GGGGG') {
          setGameOver(true);
          setGameMessage('Congratulations! You guessed the word!');
        } else if (guessesLeft === 0) {
          setGameOver(true);
          setGameMessage(`Game Over! The correct word was "${currentGuess}".`);
        } else {
          setCurrentGuess('');
          setCurrentRow(currentRow + 1);
        }
      }
    }
  };

  // Submit guess function
  const submitGuess = async (guess, id) => {
    try {
      const response = await fetch('https://we6.talentsprint.com/wordle/game/guess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guess: guess,
          id: id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to submit guess:', errorData.message || 'Unknown error');
        return null;
      }

      return await response.json(); // Return the response data
    } catch (error) {
      console.error('Error during guess submission:', error);
      return null;
    }
  };

  // Get feedback status from the server response
  const getFeedbackStatus = (status) => {
    switch (status) {
      case 'G':
        return 'correct'; // Correct letter and position
      case 'Y':
        return 'present'; // Correct letter, wrong position
      case 'R':
        return 'absent'; // Incorrect letter
      default:
        return ''; // Default case
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

  useEffect(() => {
    registerGame(); // Automatically register and create the game
  }, []);

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
