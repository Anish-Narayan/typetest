import React from 'react';
import styles from './TestStats.module.css'; // Make sure you have this CSS file

const TestStats = React.memo(({
  testMode,
  timer,
  wpm,
  accuracy,
  rawWpm,
  status,
  activeWordIndex,
  wordCount
}) => {

  // --- Case 1: Test is currently running ---
  // Show ONLY the primary progress metric (timer or word count)
  if (status === 'started') {
    return (
      <div className={styles.stats}>
        {testMode === 'time' && (
          <div className={styles.focusStat}>Time: {timer}s</div>
        )}
        {testMode === 'words' && (
          <div className={styles.focusStat}>Words: {activeWordIndex}/{wordCount}</div>
        )}
      </div>
    );
  }

  // --- Case 2: Test is finished ---
  // Show all the final results
  if (status === 'finished') {
    return (
      <div className={styles.stats}>
        <div>WPM: {wpm}</div>
        <div>Raw WPM: {rawWpm}</div>
        <div>Accuracy: {accuracy}%</div>
      </div>
    );
  }

  // --- Case 3: Test is waiting ---
  // Don't render anything, as the configuration options are visible.
  return null;
});

export default TestStats;