import React from 'react';
import styles from './TestOptions.module.css'; // Import the CSS Module

const TestOptions = React.memo(({ testMode, TIME_OPTIONS, WORD_COUNT_OPTIONS, testDuration, setTestDuration, wordCount, setWordCount, status, resetGame }) => {
  return (
    <div className={styles.options}> {/* Use styles.options */}
      {testMode === 'time' && (
        <div className={styles.optionGroup}> {/* Use styles.optionGroup */}
          <span className={styles.optionLabel}>Time:</span> {/* Use styles.optionLabel */}
          {TIME_OPTIONS.map(option => (
            <button
              key={option}
              className={`${styles.optionButton} ${testDuration === option ? styles.activeOption : ''}`} 
              onClick={() => { setTestDuration(option); resetGame(); }}
              disabled={status === 'started'}
            >
              {option}s
            </button>
          ))}
        </div>
      )}

      {testMode === 'words' && (
        <div className={styles.optionGroup}> {/* Use styles.optionGroup */}
          <span className={styles.optionLabel}>Words:</span> {/* Use styles.optionLabel */}
          {WORD_COUNT_OPTIONS.map(option => (
            <button
              key={option}
              className={`${styles.optionButton} ${wordCount === option ? styles.activeOption : ''}`} 
              onClick={() => { setWordCount(option); resetGame(); }}
              disabled={status === 'started'}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

export default TestOptions;