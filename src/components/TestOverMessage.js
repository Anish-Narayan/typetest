import React from 'react';
import styles from './TestOverMessage.module.css'; // Import the CSS Module

const TestOverMessage = React.memo(({ status, testMode, timeTaken }) => {
  if (status !== 'finished') {
    return null;
  }

  return (
    <div className={styles.testOverMessage}> {/* Use styles.testOverMessage */}
      <h2>Test Over!</h2>
      {testMode === 'words' && <p>Time Taken: <span className={styles.timeTakenDisplay}>{timeTaken.toFixed(1)}s</span></p>} {/* Use styles.timeTakenDisplay */}
    </div>
  );
});

export default TestOverMessage;