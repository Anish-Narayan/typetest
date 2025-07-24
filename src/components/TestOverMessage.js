import React from 'react';
// CSS Modules automatically converts kebab-case to camelCase
import styles from './TestOverMessage.module.css';

const TestOverMessage = React.memo(({ status, testMode, timeTaken }) => {
  // Return null if the test isn't finished.
  if (status !== 'finished') {
    return null;
  }

  return (
    <div className={styles.testOverMessage}>
      <h2>Test Complete!</h2>
      {/* Only show the time for 'words' mode and if a valid time was recorded */}
      {testMode === 'words' && timeTaken > 0 && (
        <p>
          Time Taken:
          <span className={styles.timeTakenDisplay}>
            {timeTaken.toFixed(1)}s
          </span>
        </p>
      )}
    </div>
  );
});

export default TestOverMessage;