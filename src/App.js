import React, { useState, useEffect, useRef, useCallback } from 'react';
import generateWords from './words'; // Your local words.js file
import './App.css'; // The updated CSS for UI

// Define available options for time and word count
const TIME_OPTIONS = [15, 30, 60, 120]; // seconds
const WORD_COUNT_OPTIONS = [10, 25, 50, 75, 100];

function App() {
  // State for words and user input
  const [words, setWords] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [activeWordIndex, setActiveWordIndex] = useState(0);

  // State for tracking correctness (word-level and character-level)
  const [correctWordArray, setCorrectWordArray] = useState([]); // True/false for entire words
  const [typedCharState, setTypedCharState] = useState([]); // Nested array for char-by-char feedback: [[null, true, false], ...]

  // State for game status and timer
  const [status, setStatus] = useState('waiting'); // 'waiting', 'started', 'finished'
  const [timer, setTimer] = useState(30); // Dynamic: will be set by `testDuration`

  // State for results
  const [wpm, setWpm] = useState(0);       // Net WPM (correct characters)
  const [rawWpm, setRawWpm] = useState(0); // Gross WPM (all typed characters)
  const [accuracy, setAccuracy] = useState(0); // Character-level accuracy

  // State for tracking all typed characters (used for WPM/Accuracy)
  const [totalTypedChars, setTotalTypedChars] = useState(0);
  const [correctTypedChars, setCorrectTypedChars] = useState(0);

  // State for user-selected options
  const [testDuration, setTestDuration] = useState(TIME_OPTIONS[1]); // Default to 30 seconds
  const [wordCount, setWordCount] = useState(WORD_COUNT_OPTIONS[2]); // Default to 50 words

  // State to manage whether it's a 'time' or 'words' based test
  const [testMode, setTestMode] = useState('time'); // 'time' or 'words'

  // Refs for DOM manipulation (focus and scrolling)
  const inputRef = useRef(null);
  const wordContainerRef = useRef(null);
  const startTimeRef = useRef(0); // Stores the exact timestamp when typing begins

  // *** NEW: Refs to hold the latest state values for setInterval to access ***
  const correctTypedCharsRef = useRef(0);
  const totalTypedCharsRef = useRef(0);
  const typedCharStateRef = useRef([]); // To hold the latest typedCharState

  // --- Core Game Logic ---

  /**
   * Calculates and sets the final WPM, Raw WPM, and Accuracy when the test finishes.
   */
  const calculateResults = useCallback(() => {
    // Calculate actual elapsed time based on when the test started
    const actualElapsedTimeSeconds = (Date.now() - startTimeRef.current) / 1000;
    const totalTimeMinutes = actualElapsedTimeSeconds / 60;

    let finalCorrectChars = 0;
    let finalTotalTypedChars = 0;

    // Use the ref to get the latest typedCharState
    typedCharStateRef.current.forEach(wordChars => {
      if (wordChars) {
        wordChars.forEach(isCorrect => {
          if (isCorrect !== null) {
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
  }, []); // No dependencies needed for useCallback because it uses refs now

  /**
   * Resets all game state to initial values, preparing for a new test.
   * Uses `testDuration` and `wordCount` from state for setup.
   */
  const resetGame = useCallback(() => {
    if (wordContainerRef.current) {
      wordContainerRef.current.scrollTop = 0;
    }

    setWords(generateWords(Math.max(wordCount, 200)));
    setActiveWordIndex(0);
    setUserInput('');
    setCorrectWordArray([]);
    setTypedCharState([]);
    setStatus('waiting');
    setTimer(testDuration);
    setWpm(0);
    setRawWpm(0);
    setAccuracy(0);
    setTotalTypedChars(0);
    setCorrectTypedChars(0);
    startTimeRef.current = 0;

    // Reset refs as well
    correctTypedCharsRef.current = 0;
    totalTypedCharsRef.current = 0;
    typedCharStateRef.current = [];

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [testDuration, wordCount]);

  // Effect to initialize game on component mount and when resetGame changes
  useEffect(() => {
    resetGame();
  }, [resetGame]);

  /**
   * Calculates and updates real-time WPM, Raw WPM, and Accuracy during the test.
   * This is called by the dedicated timer effect.
   * @param {number} elapsedTime - The time that has elapsed in seconds since the test started.
   * @param {number} currentCorrectChars - The current count of correctly typed characters.
   * @param {number} currentTotalTypedChars - The current count of total typed characters.
   */
  const calculateRealtimeStats = useCallback((elapsedTime, currentCorrectChars, currentTotalTypedChars) => {
    if (elapsedTime === 0) return;

    const timeMinutes = elapsedTime / 60;

    let currentNetWpm = (currentCorrectChars / 5) / timeMinutes;
    setWpm(Math.round(currentNetWpm > 0 ? currentNetWpm : 0));

    let currentRawWpm = (currentTotalTypedChars / 5) / timeMinutes;
    setRawWpm(Math.round(currentRawWpm > 0 ? currentRawWpm : 0));

    let currentAccuracy = currentTotalTypedChars > 0 ? (currentCorrectChars / currentTotalTypedChars) * 100 : 0;
    setAccuracy(Math.round(currentAccuracy > 0 ? currentAccuracy : 0));
  }, []); // No dependencies for this useCallback, as parameters are passed in


  /**
   * EFFECT: Manages the main game timer and real-time stats updates.
   * This interval runs continuously when the test is 'started'.
   */
  useEffect(() => {
    let interval;

    if (status === 'started') {
      interval = setInterval(() => {
        const elapsedTime = (Date.now() - startTimeRef.current) / 1000;

        // Use the refs to get the latest character counts
        calculateRealtimeStats(elapsedTime, correctTypedCharsRef.current, totalTypedCharsRef.current);

        // For 'time' mode, also decrement the timer and check for end condition
        if (testMode === 'time') {
          setTimer((prevTimer) => {
            if (prevTimer === 1) {
              clearInterval(interval);
              setStatus('finished');
              calculateResults(); // Call final results calculation
              return 0;
            }
            return prevTimer - 1;
          });
        }
      }, 1000); // Update every second
    }

    // Cleanup function for interval
    return () => clearInterval(interval);
  }, [status, testMode, testDuration, calculateRealtimeStats, calculateResults]); // Dependencies are now minimal and don't include character counts


  /**
   * Scrolls the word container to keep the active typing line visible.
   */
  useEffect(() => {
    if (activeWordIndex > 0 && wordContainerRef.current) {
      const activeWordEl = wordContainerRef.current.querySelector('.word.active');
      if (activeWordEl) {
        const container = wordContainerRef.current;
        const containerHeight = container.clientHeight;

        const targetScrollTop = activeWordEl.offsetTop - (containerHeight / 3);

        container.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });
      }
    }
  }, [activeWordIndex, words]); // Dependencies: re-run when active word changes or words reload


  // --- Input Handling ---

  /**
   * Handles user input in the text field. Manages test start, word completion, and character feedback.
   * @param {Object} e - The event object from the input change.
   */
  const handleInputChange = (e) => {
    if (status === 'finished') return;

    const value = e.target.value;
    const currentWord = words[activeWordIndex];

    if (status === 'waiting' && value.length === 1 && currentWord && value.trim() !== '') {
      setStatus('started');
      startTimeRef.current = Date.now();
      setTimer(testDuration);
    }

    if (status !== 'started' || !currentWord) {
      setUserInput(value);
      return;
    }

    // Logic for handling word completion (when user presses space)
    if (value.endsWith(' ')) {
      if (userInput.trim() === '') {
        setUserInput('');
        return;
      }

      const wordToCompare = currentWord;
      const isCorrectWord = wordToCompare === userInput.trim();

      setCorrectWordArray(prev => [...prev, isCorrectWord]);

      setTypedCharState(prev => {
        const newTypedCharState = [...prev];
        const charsInWord = [];
        for (let i = 0; i < Math.max(wordToCompare.length, userInput.trim().length); i++) {
          charsInWord.push(wordToCompare[i] === userInput.trim()[i]);
        }
        newTypedCharState[activeWordIndex] = charsInWord;
        typedCharStateRef.current = newTypedCharState; // *** UPDATE THE REF HERE ***
        return newTypedCharState;
      });

      setActiveWordIndex(activeWordIndex + 1);
      setUserInput('');

      if (testMode === 'words' && activeWordIndex + 1 >= wordCount) {
        setStatus('finished');
        calculateResults();
        setTimer(0);
      }

    } else {
      // Logic for character-by-character typing within the current word
      setUserInput(value);

      setTypedCharState(prev => {
        const newTypedCharState = [...prev];
        const currentWordChars = [];

        for (let i = 0; i < Math.max(currentWord.length, value.length); i++) {
          const charTyped = value[i];
          const charExpected = currentWord[i];
          let isCharCorrect = null;

          if (charTyped !== undefined) {
            if (charTyped === charExpected) {
              isCharCorrect = true;
            } else {
              isCharCorrect = false;
            }
          }
          currentWordChars.push(isCharCorrect);
        }
        newTypedCharState[activeWordIndex] = currentWordChars;
        typedCharStateRef.current = newTypedCharState; // *** UPDATE THE REF HERE ***

        let globalCorrect = 0;
        let globalTotal = 0;
        newTypedCharState.forEach(wordCharArr => {
          if (wordCharArr) {
            wordCharArr.forEach(charStatus => {
              if (charStatus !== null) {
                globalTotal++;
                if (charStatus === true) {
                  globalCorrect++;
                }
              }
            });
          }
        });
        setCorrectTypedChars(globalCorrect);
        setTotalTypedChars(globalTotal);

        // *** UPDATE THE REFS FOR LATEST CHARACTER COUNTS HERE ***
        correctTypedCharsRef.current = globalCorrect;
        totalTypedCharsRef.current = globalTotal;

        return newTypedCharState;
      });
    }
  };

  // --- Word Component ---
  const Word = React.memo(({ word, wordIndex, active, correctWordStatus, userInput, typedCharStatuses }) => {
    const wordClasses = ['word'];
    if (active) {
      wordClasses.push('active');
    }
    if (!active && correctWordStatus === true) {
      wordClasses.push('correct-word');
    } else if (!active && correctWordStatus === false) {
      wordClasses.push('incorrect-word');
    }

    return (
      <span className={wordClasses.join(' ')}>
        {word.split('').map((char, charIndex) => {
          let charClass = '';
          const isTyped = active && charIndex < userInput.length;
          const isCursor = active && charIndex === userInput.length;

          if (isTyped) {
            charClass = char === userInput[charIndex] ? 'correct' : 'incorrect';
          }
          if (!active && typedCharStatuses && typedCharStatuses[charIndex] !== null) {
            charClass = typedCharStatuses[charIndex] === true ? 'correct' : 'incorrect';
          }

          return (
            <span key={charIndex} className={`char ${charClass} ${isCursor ? 'cursor' : ''}`}>
              {char}
            </span>
          );
        })}
        {active && userInput.length > word.length && (
          <span className="char incorrect extra">
            {userInput.slice(word.length)}
            <span className="cursor extra-cursor"></span>
          </span>
        )}
        {active && userInput.length === word.length && <span className="char cursor"> </span>}
      </span>
    );
  });

  // --- Render ---

  return (
    <div className="app" onClick={() => inputRef.current.focus()}>
      <div className="header">
        <h1>Typing Speed Test</h1>
        <div className="option-group">
          <button
            className={`option-button ${testMode === 'time' ? 'active-option' : ''}`}
            onClick={() => { setTestMode('time'); resetGame(); }}
            disabled={status === 'started'}
          >
            Time
          </button>
          <button
            className={`option-button ${testMode === 'words' ? 'active-option' : ''}`}
            onClick={() => { setTestMode('words'); resetGame(); }}
            disabled={status === 'started'}
          >
            Words
          </button>
        </div>

        {testMode === 'time' && (
          <div className="options">
            <div className="option-group">
              <span className="option-label">Time:</span>
              {TIME_OPTIONS.map(option => (
                <button
                  key={option}
                  className={`option-button ${testDuration === option ? 'active-option' : ''}`}
                  onClick={() => { setTestDuration(option); resetGame(); }}
                  disabled={status === 'started'}
                >
                  {option}s
                </button>
              ))}
            </div>
          </div>
        )}

        {testMode === 'words' && (
          <div className="options">
            <div className="option-group">
              <span className="option-label">Words:</span>
              {WORD_COUNT_OPTIONS.map(option => (
                <button
                  key={option}
                  className={`option-button ${wordCount === option ? 'active-option' : ''}`}
                  onClick={() => { setWordCount(option); resetGame(); }}
                  disabled={status === 'started'}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {status === 'finished' && (
          <div className="test-over-message">
            <h2>Test Over!</h2>
          </div>
        )}

        <div className="stats">
          {testMode === 'time' && <div>Time: {timer}s</div>}
          {testMode === 'words' && <div>Words: {activeWordIndex}/{wordCount}</div>}
          <div>WPM: {wpm}</div>
          <div>Accuracy: {accuracy}%</div>
          {(status === 'started' || status === 'finished') && <div>Raw WPM: {rawWpm}</div>}
        </div>
      </div>

      <input
        ref={inputRef}
        type="text"
        className="input-field"
        value={userInput}
        onChange={handleInputChange}
        disabled={status === 'finished'}
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        placeholder={status === 'waiting' ? 'Type to start' : ''}
      />

      <div className="word-container" ref={wordContainerRef}>
        {words.map((word, wordIndex) => (
          <Word
            key={wordIndex}
            word={word}
            wordIndex={wordIndex}
            active={wordIndex === activeWordIndex}
            correctWordStatus={correctWordArray[wordIndex]}
            userInput={wordIndex === activeWordIndex ? userInput : ''}
            typedCharStatuses={typedCharState[wordIndex]}
          />
        ))}
      </div>

      <button className="restart-button" onClick={resetGame}>
        Restart Test
      </button>
    </div>
  );
}

export default App;