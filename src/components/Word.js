import React from 'react';
import styles from './Word.module.css'; // Import the CSS Module

const Word = React.memo(({ word, wordIndex, active, correctWordStatus, userInput, typedCharStatuses }) => {
  const wordClasses = [styles.word]; // Start with the base class
  if (active) {
    wordClasses.push(styles.active); // Add active class from module
  }
  if (!active && correctWordStatus === true) {
    wordClasses.push(styles.correctWord); // Add correctWord class from module
  } else if (!active && correctWordStatus === false) {
    wordClasses.push(styles.incorrectWord); // Add incorrectWord class from module
  }

  return (
    <span className={wordClasses.join(' ')}>
      {word.split('').map((char, charIndex) => {
        let charClassNames = [styles.char]; // Start with base char class
        const isTyped = active && charIndex < userInput.length;
        const isCursor = active && charIndex === userInput.length;

        if (isTyped) {
          if (char === userInput[charIndex]) {
            charClassNames.push(styles.correct); // Add correct char class from module
          } else {
            charClassNames.push(styles.incorrect); // Add incorrect char class from module
          }
        }
        if (!active && typedCharStatuses && typedCharStatuses[charIndex] !== null) {
          if (typedCharStatuses[charIndex] === true) {
            charClassNames.push(styles.correct);
          } else {
            charClassNames.push(styles.incorrect);
          }
        }
        if (isCursor) {
          charClassNames.push(styles.cursor); // Add cursor class from module
        }

        return (
          <span key={charIndex} className={charClassNames.join(' ')}>
            {char}
          </span>
        );
      })}
      {active && userInput.length > word.length && (
        <span className={`${styles.char} ${styles.incorrect} ${styles.extra}`}> {/* Combine classes */}
          {userInput.slice(word.length)}
          <span className={`${styles.cursor} ${styles.extraCursor}`}></span> {/* Combine classes */}
        </span>
      )}
      {active && userInput.length === word.length && <span className={`${styles.char} ${styles.cursor}`}> </span>} {/* Combine classes */}
    </span>
  );
});

export default Word;