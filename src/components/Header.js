import React from 'react';
import ModeSelector from './ModeSelector';
import TestOptions from './TestOptions';
import TestStats from './TestStats';
import TestOverMessage from './TestOverMessage';
import styles from './Header.module.css'; // Import the CSS Module

const Header = React.memo(({
  testMode, setTestMode, resetGame, status,
  TIME_OPTIONS, WORD_COUNT_OPTIONS,
  testDuration, setTestDuration,
  wordCount, setWordCount,
  timer, wpm, accuracy, rawWpm,
  activeWordIndex, timeTaken
}) => {
  return (
    <div className={styles.header}> {/* Use styles.header */}
      <h1>Typing Speed Test</h1>
      <ModeSelector
        testMode={testMode}
        setTestMode={setTestMode}
        status={status}
        resetGame={resetGame}
      />
      <TestOptions
        testMode={testMode}
        TIME_OPTIONS={TIME_OPTIONS}
        WORD_COUNT_OPTIONS={WORD_COUNT_OPTIONS}
        testDuration={testDuration}
        setTestDuration={setTestDuration}
        wordCount={wordCount}
        setWordCount={setWordCount}
        status={status}
        resetGame={resetGame}
      />
      <TestStats
        testMode={testMode}
        timer={timer}
        wpm={wpm}
        accuracy={accuracy}
        rawWpm={rawWpm}
        status={status}
        activeWordIndex={activeWordIndex}
        wordCount={wordCount}
      />
      <TestOverMessage
        status={status}
        testMode={testMode}
        timeTaken={timeTaken}
      />
    </div>
  );
});

export default Header;