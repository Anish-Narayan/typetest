import React from 'react';
import Word from './Word'; // Import the Word component
import styles from './WordDisplay.module.css'; // Import the CSS Module

const WordDisplay = React.memo(({ words, activeWordIndex, correctWordArray, userInput, typedCharState, wordContainerRef, wordCount, testMode }) => {
  return (
    <div className={styles.wordContainer} ref={wordContainerRef}> {/* Use styles.wordContainer */}
      {/* Slice the words array to only display the chosen word count in 'words' mode */}
      {words.slice(0, testMode === 'words' ? wordCount : words.length).map((word, wordIndex) => (
        <Word
          key={wordIndex}
          word={word}
          wordIndex={wordIndex}
          active={wordIndex === activeWordIndex}
          correctWordStatus={correctWordArray[wordIndex]}
          userInput={wordIndex === activeWordIndex ? userInput : ''}
          typedCharStatuses={typedCharState[wordIndex]}
        />
      ))}
    </div>
  );
});

export default WordDisplay;