import React from 'react';
import Square from './Square';


function Row({ word, feedback }) {
  return (
    <div className="flex">
      {word.split('').map((char, index) => (
        <Square key={index} char={char} status={feedback[index]} />
      ))}
    </div>
  );
}

export default Row;
