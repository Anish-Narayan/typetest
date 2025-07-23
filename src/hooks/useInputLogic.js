import { useCallback } from 'react';

/**
 * Custom hook for handling user input logic in the typing test.
 * @param {Array<string>} words - Array of words for the test.
 * @param {string} userInput - Current user input.
 * @param {number} activeWordIndex - Index of the currently active word.
 * @param {string} status - Current game status.
 * @param {string} testMode - Current test mode ('time' or 'words').
 * @param {number} wordCount - Target word count for 'words' mode.
 * @param {function} setUserInput - State setter for user input.
 * @param {function} setActiveWordIndex - State setter for active word index.
 * @param {function} setCorrectWordArray - State setter for word correctness.
 * @param {function} setTypedCharState - State setter for character correctness.
 * @param {function} setStatus - State setter for game status.
 * @param {function} setTimer - State setter for timer.
 * @param {React.MutableRefObject} startTimeRef - Ref for the test start timestamp.
 * @param {function} calculateFinalResults - Callback to calculate final results.
 * @param {React.MutableRefObject} correctTypedCharsRef - Ref for current correct characters.
 * @param {React.MutableRefObject} totalTypedCharsRef - Ref for current total typed characters.
 * @param {React.MutableRefObject} typedCharStateRef - Ref for current typedCharState.
 * @returns {function} The handleInputChange function.
 */
const useInputLogic = (
  words, userInput, activeWordIndex, status, testMode, wordCount,
  setUserInput, setActiveWordIndex, setCorrectWordArray, setTypedCharState, setStatus, setTimer,
  startTimeRef, calculateFinalResults,
  correctTypedCharsRef, totalTypedCharsRef, typedCharStateRef
) => {

  const handleInputChange = useCallback((e) => {
    if (status === 'finished') return;

    const value = e.target.value;
    const currentWord = words[activeWordIndex];

    // Start the test on the first valid character
    if (status === 'waiting' && value.length === 1 && currentWord && value.trim() !== '') {
      setStatus('started');
      startTimeRef.current = Date.now();
      if (testMode === 'words') {
        setTimer(0); // Timer is not a countdown in words mode
      }
    }

    if (status !== 'started' || !currentWord) {
      setUserInput(value);
      return;
    }

    // Logic for handling word completion (when user presses space)
    if (value.endsWith(' ')) {
      if (userInput.trim() === '') {
        setUserInput(''); // Prevent adding empty words on multiple spaces
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
        typedCharStateRef.current = newTypedCharState;
        return newTypedCharState;
      });

      const nextActiveWordIndex = activeWordIndex + 1;
              setActiveWordIndex(nextActiveWordIndex);
      setUserInput('');

      // Check for end condition based on word count
      if (testMode === 'words' && nextActiveWordIndex >= wordCount) {
        setStatus('finished');
        calculateFinalResults();
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
        typedCharStateRef.current = newTypedCharState;

        // Update global character counts for real-time stats
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
        correctTypedCharsRef.current = globalCorrect;
        totalTypedCharsRef.current = globalTotal;

        return newTypedCharState;
      });
    }
  }, [
    words, userInput, activeWordIndex, status, testMode, wordCount,
    setUserInput, setActiveWordIndex, setCorrectWordArray, setTypedCharState, setStatus, setTimer,
    startTimeRef, calculateFinalResults,
    correctTypedCharsRef, totalTypedCharsRef, typedCharStateRef
  ]);

  return handleInputChange;
};

export default useInputLogic;