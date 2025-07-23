import React from 'react';
import styles from './TestStats.module.css'; // Import the CSS Module

const TestStats = React.memo(({ testMode, timer, wpm, accuracy, rawWpm, status, activeWordIndex, wordCount }) => {
  return (
    <div className={styles.stats}> {/* Use styles.stats */}
      {testMode === 'time' && <div>Time: {timer}s</div>}
      {testMode === 'words' && <div>Words: {activeWordIndex}/{wordCount}</div>}
      <div>WPM: {wpm}</div>
      <div>Accuracy: {accuracy}%</div>
      {(status === 'started' || status === 'finished') && <div>Raw WPM: {rawWpm}</div>}
    </div>
  );
});

export default TestStats;