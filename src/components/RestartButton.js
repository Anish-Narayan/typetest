import React from 'react';
import styles from './RestartButton.module.css'; // Import the CSS Module

const RestartButton = React.memo(({ onClick }) => {
  return (
    <button className={styles.restartButton} onClick={onClick}> {/* Use styles.restartButton */}
      Restart Test
    </button>
  );
});

export default RestartButton;