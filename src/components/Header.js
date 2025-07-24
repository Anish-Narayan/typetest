import React from 'react';
import ModeSelector from './ModeSelector';
import TestOptions from './TestOptions';
import TestStats from './TestStats';
import TestOverMessage from './TestOverMessage';
import styles from './Header.module.css';

const Header = React.memo(({
  testMode, setTestMode, resetGame, status,
  TIME_OPTIONS, WORD_COUNT_OPTIONS,
  testDuration, setTestDuration,
  wordCount, setWordCount,
  timer, wpm, accuracy, rawWpm,
  activeWordIndex, timeTaken
}) => {
  return (
    <div className={styles.header}>
      <h1>Typing Speed Test</h1>

      {/* --- Configuration Section --- */}
      {/* Only show these options BEFORE the test starts */}
      {status === 'waiting' && (
        <>
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
        </>
      )}

      {/* --- Stats Display --- */}
      {/* TestStats is always rendered. It will decide what to show based on the 'status' prop. */}
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
      
      {/* --- Test Over Message --- */}
      {/* This component only appears when the test is finished. */}
      {status === 'finished' && (
        <TestOverMessage
          status={status}
          testMode={testMode}
          timeTaken={timeTaken}
        />
      )}
    </div>
  );
});

export default Header;