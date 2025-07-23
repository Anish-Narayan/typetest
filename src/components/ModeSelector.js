import React from 'react';
import styles from './ModeSelector.module.css'; // Import the CSS Module

const ModeSelector = React.memo(({ testMode, setTestMode, status, resetGame }) => {
  return (
    <div className={styles.modeOptions}> {/* Use styles.modeOptions */}
      <button
        className={`${styles.modeButton} ${testMode === 'time' ? styles.activeMode : ''}`}
        onClick={() => { setTestMode('time'); resetGame(); }}
        disabled={status === 'started'}
      >
        Time
      </button>
      <button
        className={`${styles.modeButton} ${testMode === 'words' ? styles.activeMode : ''}`}
        onClick={() => { setTestMode('words'); resetGame(); }}
        disabled={status === 'started'}
      >
        Words
      </button>
    </div>
  );
});

export default ModeSelector;