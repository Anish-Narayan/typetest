import { useState, useCallback, useRef } from 'react';
import useGameInitialization from './useGameInitialization';
import useTimerAndStats from './useTimerAndStats';
import useInputLogic from './useInputLogic';
import useScrollingEffect from './useScrollingEffect';

/**
 * The main coordinating hook for the typing test application.
 * It manages global states, coordinates other specialized hooks, and provides
 * consolidated data and functions to the HomePage component.
 *
 * @param {Array<number>} TIME_OPTIONS - Array of available time options in seconds.
 * @param {Array<number>} WORD_COUNT_OPTIONS - Array of available word count options.
 * @returns {object} An object containing all necessary states, refs, and functions for the UI.
 */
const useTypingTest = (TIME_OPTIONS, WORD_COUNT_OPTIONS) => {
  // Configured test options (owned by this hook)
  const [testDuration, setTestDuration] = useState(TIME_OPTIONS[1]); // Default to 30 seconds
  const [wordCount, setWordCount] = useState(WORD_COUNT_OPTIONS[2]); // Default to 50 words
  const [testMode, setTestMode] = useState('time'); // Default to 'time' mode

  // Refs that are shared across multiple specialized hooks (owned by this coordinating hook)
  const inputRef = useRef(null);
  const wordContainerRef = useRef(null);
  const startTimeRef = useRef(0); // Stores the exact timestamp when typing begins

  // Refs to hold the latest character counts and typed char state for efficient updates in sub-hooks
  const correctTypedCharsRef = useRef(0);
  const totalTypedCharsRef = useRef(0);
  const typedCharStateRef = useRef([]);

  // States for WPM, Raw WPM, Accuracy (owned by this hook for overall test results display)
  const [wpm, setWpm] = useState(0);
  const [rawWpm, setRawWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);


  // 1. Use useGameInitialization hook for core game state and reset logic
  const {
    words, // No setter needed directly in this hook, but available if useInputLogic or others need to modify it
    userInput, setUserInput,
    activeWordIndex, setActiveWordIndex,
    correctWordArray, setCorrectWordArray,
    typedCharState, setTypedCharState,
    status, setStatus,
    timer, setTimer,
    timeTaken, setTimeTaken,
    resetGame // The combined reset function from useGameInitialization
  } = useGameInitialization(testMode, wordCount, testDuration, wordContainerRef, inputRef);


  // 2. Define the calculateFinalResults callback (owned by this hook)
  // This function calculates and sets the final WPM, Raw WPM, and Accuracy.
  const calculateFinalResults = useCallback(() => {
    const actualElapsedTimeSeconds = (Date.now() - startTimeRef.current) / 1000;
    const totalTimeMinutes = actualElapsedTimeSeconds / 60;

    if (testMode === 'words') {
      setTimeTaken(actualElapsedTimeSeconds); // Set final timeTaken for 'words' mode
    }

    let finalCorrectChars = 0;
    let finalTotalTypedChars = 0;
    typedCharStateRef.current.forEach(wordChars => {
      if (wordChars) {
        wordChars.forEach(isCorrect => {
          if (isCorrect !== null) { // Only count characters that were actually typed/evaluated
            finalTotalTypedChars++;
            if (isCorrect) {
              finalCorrectChars++;
            }
          }
        });
      }
    });

    const netWpmCalc = (finalCorrectChars / 5) / totalTimeMinutes;
    setWpm(Math.round(netWpmCalc > 0 ? netWpmCalc : 0));

    const rawWpmCalc = (finalTotalTypedChars / 5) / totalTimeMinutes;
    setRawWpm(Math.round(rawWpmCalc > 0 ? rawWpmCalc : 0));

    const accuracyCalc = finalTotalTypedChars > 0 ? (finalCorrectChars / finalTotalTypedChars) * 100 : 0;
    setAccuracy(Math.round(accuracyCalc > 0 ? accuracyCalc : 0));

  }, [testMode, setTimeTaken, typedCharStateRef, startTimeRef, setWpm, setRawWpm, setAccuracy]);


  // 3. Use useTimerAndStats hook for timer management and real-time stats calculation
  // Pass the necessary states and setters down to it.
  useTimerAndStats(
    status, testMode,
    startTimeRef, correctTypedCharsRef, totalTypedCharsRef,
    setStatus, setTimer,
    setWpm, setRawWpm, setAccuracy, // Pass the setters for WPM/Accuracy
    calculateFinalResults // Pass the final results callback
  );


  // 4. Use useInputLogic hook for handling all user input
  // Pass all relevant states, setters, and callbacks.
  const handleInputChange = useInputLogic(
    words, userInput, activeWordIndex, status, testMode, wordCount,
    setUserInput, setActiveWordIndex, setCorrectWordArray, setTypedCharState, setStatus, setTimer,
    startTimeRef, calculateFinalResults,
    correctTypedCharsRef, totalTypedCharsRef, typedCharStateRef
  );


  // 5. Use useScrollingEffect hook for automatic word container scrolling
  useScrollingEffect(activeWordIndex, words, wordContainerRef);


  // Return all states, refs, and functions that HomePage (or other consumers) needs
  return {
    words, userInput, activeWordIndex, correctWordArray, typedCharState,
    status, timer, timeTaken, wpm, rawWpm, accuracy,
    testDuration, setTestDuration, wordCount, setWordCount, testMode, setTestMode,
    inputRef, wordContainerRef,
    handleInputChange, resetGame
  };
};

export default useTypingTest;