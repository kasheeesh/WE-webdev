import React from 'react';
import Row from './Row';

export default function Grid({ guesses, feedback }) {
  return (
    <div className="grid">
      {guesses.map((guess, index) => (
        <Row key={index} word={guess} feedback={feedback[index]} />
      ))}
    </div>
  );
}
