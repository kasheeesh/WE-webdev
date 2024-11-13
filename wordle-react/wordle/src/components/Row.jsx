import React from 'react';
import Square from './Square';

function Row({ word, feedback }) {
  // Ensure the row always has 5 squares, even if the word is empty or shorter
  const paddedWord = (word + ' '.repeat(5)).slice(0, 5); 
  const paddedFeedback = (feedback || Array(5).fill('')).slice(0, 5);

  return (
    <div className="flex">
      {paddedWord.split('').map((char, index) => (
        <Square key={index} char={char} status={paddedFeedback[index]} />
      ))}
    </div>
  );
}

export default Row;
