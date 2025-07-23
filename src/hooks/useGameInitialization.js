import { useState, useEffect, useCallback, useRef } from 'react';
import generateWords from '../words';

/**
 * Custom hook for initializing and resetting core game state.
 * @param {string} testMode - Current test mode ('time' or 'words').
 * @param {number} wordCount - Target word count for 'words' mode.
 * @param {number} testDuration - Target duration for 'time' mode.
 * @param {React.MutableRefObject} wordContainerRef - Ref for the word display container.
 * @param {React.MutableRefObject} inputRef - Ref for the input field.
 * @returns {object} An object containing reset logic and initial states.
 */
const useGameInitialization = (testMode, wordCount, testDuration, wordContainerRef, inputRef) => {
  const [words, setWords] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [correctWordArray, setCorrectWordArray] = useState([]);
  const [typedCharState, setTypedCharState] = useState([]);
  const [status, setStatus] = useState('waiting');
  const [timer, setTimer] = useState(testDuration);
  const [timeTaken, setTimeTaken] = useState(0); // Only for words mode final display

  // Refs for character tracking (to be passed to input logic)
  const correctTypedCharsRef = useRef(0);
  const totalTypedCharsRef = useRef(0);
  const typedCharStateRef = useRef([]); // To hold the latest typedCharState

  const resetGame = useCallback(() => {
    if (wordContainerRef.current) {
      wordContainerRef.current.scrollTop = 0;
    }

    setWords(generateWords(testMode === 'words' ? wordCount : 200));
    setActiveWordIndex(0);
    setUserInput('');
    setCorrectWordArray([]);
    setTypedCharState([]);
    setStatus('waiting');
    setTimer(testDuration);
    setTimeTaken(0);
    correctTypedCharsRef.current = 0;
    totalTypedCharsRef.current = 0;
    typedCharStateRef.current = [];

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [testMode, wordCount, testDuration, wordContainerRef, inputRef]);

  // Effect to initialize game on component mount and when resetGame's dependencies change
  useEffect(() => {
    resetGame();
  }, [resetGame]);

  return {
    words, setWords,
    userInput, setUserInput,
    activeWordIndex, setActiveWordIndex,
    correctWordArray, setCorrectWordArray,
    typedCharState, setTypedCharState,
    status, setStatus,
    timer, setTimer,
    timeTaken, setTimeTaken,
    correctTypedCharsRef, totalTypedCharsRef, typedCharStateRef,
    resetGame
  };
};

export default useGameInitialization;