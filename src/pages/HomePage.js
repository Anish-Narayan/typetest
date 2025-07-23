import React from 'react';
import useTypingTest from '../hooks/useTypingTest';
import Header from '../components/Header';
import InputField from '../components/InputField';
import WordDisplay from '../components/WordDisplay';
import RestartButton from '../components/RestartButton';

// Define available options for time and word count (can be moved to a constants file if preferred)
const TIME_OPTIONS = [15, 30, 60, 120]; // seconds
const WORD_COUNT_OPTIONS = [10, 25, 50, 75, 100];

function HomePage() {
  // Use the custom hook to get all game state and logic
  const {
    words, userInput, activeWordIndex, correctWordArray, typedCharState,
    status, timer, timeTaken, wpm, rawWpm, accuracy,
    testDuration, setTestDuration, wordCount, setWordCount, testMode, setTestMode,
    inputRef, wordContainerRef,
    handleInputChange, resetGame
  } = useTypingTest(TIME_OPTIONS, WORD_COUNT_OPTIONS); // Pass options to the hook

  return (
    <>
      <Header
        testMode={testMode}
        setTestMode={setTestMode}
        resetGame={resetGame}
        status={status}
        TIME_OPTIONS={TIME_OPTIONS}
        WORD_COUNT_OPTIONS={WORD_COUNT_OPTIONS}
        testDuration={testDuration}
        setTestDuration={setTestDuration}
        wordCount={wordCount}
        setWordCount={setWordCount}
        timer={timer}
        wpm={wpm}
        accuracy={accuracy}
        rawWpm={rawWpm}
        activeWordIndex={activeWordIndex}
        timeTaken={timeTaken}
      />

      <InputField
        inputRef={inputRef}
        userInput={userInput}
        handleInputChange={handleInputChange}
        status={status}
      />

      <WordDisplay
        words={words}
        activeWordIndex={activeWordIndex}
        correctWordArray={correctWordArray}
        userInput={userInput}
        typedCharState={typedCharState}
        wordContainerRef={wordContainerRef}
        wordCount={wordCount}
        testMode={testMode}
      />

      <RestartButton onClick={resetGame} />
    </>
  );
}

export default HomePage;