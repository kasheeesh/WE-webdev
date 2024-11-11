import React from 'react';
import '../Keyboard.css';

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function Keyboard({ onLetterClick, usedLetters }) {
  return (
    <div className="keyboard">
      {letters.map((letter) => (
        <button
          key={letter}
          onClick={() => onLetterClick(letter)}
          className={`key ${usedLetters[letter] || ''}`}
        >
          {letter}
        </button>
      ))}
    </div>
  );
}

export default Keyboard;
