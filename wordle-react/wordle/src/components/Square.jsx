import React from 'react';


export default function Square({ char, status }) {
  return <div className={`square ${status}`}>{char}</div>;
}


