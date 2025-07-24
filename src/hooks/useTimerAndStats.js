import { useEffect, useCallback } from 'react';

/**
 * Manages the game timer and calculates the final WPM/Accuracy when the test is over.
 *
 * This hook has two main responsibilities:
 * 1.  If the test mode is 'time', it sets up a one-second interval to handle the countdown.
 *     When the timer reaches zero, it sets the game status to 'finished'.
 * 2.  It watches for the game status to become 'finished'. When it does, it performs a
 *     one-time calculation of the final WPM, Raw WPM, and Accuracy and updates the parent state.
 *
 * This version is more performant as it avoids recalculating stats on every second of the test.
 *
 * @param {string} status - The current status of the typing test ('waiting', 'started', 'finished').
 * @param {string} testMode - The selected test mode ('time' or 'words').
 * @param {React.MutableRefObject<number>} startTimeRef - A ref holding the timestamp when the test started.
 * @param {React.MutableRefObject<number>} correctTypedCharsRef - A ref holding the count of correctly typed characters.
 * @param {React.MutableRefObject<number>} totalTypedCharsRef - A ref holding the total number of characters typed.
 * @param {function(string): void} setStatus - State setter to update the game's status.
 * @param {function(React.SetStateAction<number>): void} setTimer - State setter to update the timer's value.
 * @param {function(number): void} setWpm - State setter to update the final net Words Per Minute.
 * @param {function(number): void} setRawWpm - State setter to update the final raw Words Per Minute.
 * @param {function(number): void} setAccuracy - State setter to update the final typing accuracy percentage.
 * @returns {void} This hook does not return any value; it operates via side effects.
 */
const useTimerAndStats = (
  status, testMode,
  startTimeRef, correctTypedCharsRef, totalTypedCharsRef,
  setStatus, setTimer,
  setWpm, setRawWpm, setAccuracy
) => {

  // Calculates the final statistics based on the total time and character counts.
  const calculateFinalStats = useCallback(() => {
    // Ensure test has started and there's elapsed time to prevent division by zero.
    if (startTimeRef.current === 0) return;

    // Use the final time for calculation. For 'words' mode, this is the total elapsed time.
    // For 'time' mode, it's the full duration of the test.
    const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
    if (elapsedTime === 0) return;

    const timeMinutes = elapsedTime / 60;

    const finalNetWpm = (correctTypedCharsRef.current / 5) / timeMinutes;
    setWpm(Math.round(finalNetWpm > 0 ? finalNetWpm : 0));

    const finalRawWpm = (totalTypedCharsRef.current / 5) / timeMinutes;
    setRawWpm(Math.round(finalRawWpm > 0 ? finalRawWpm : 0));

    const finalAccuracy = totalTypedCharsRef.current > 0
      ? (correctTypedCharsRef.current / totalTypedCharsRef.current) * 100
      : 0;
    setAccuracy(Math.round(finalAccuracy > 0 ? finalAccuracy : 0));

  }, [setWpm, setRawWpm, setAccuracy, startTimeRef, correctTypedCharsRef, totalTypedCharsRef]);


  // Effect for managing the countdown timer in 'time' mode.
  useEffect(() => {
    let interval;

    if (status === 'started' && testMode === 'time') {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setStatus('finished'); // End the game
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [status, testMode, setTimer, setStatus]);


  // Effect for calculating results when the game finishes.
  useEffect(() => {
    if (status === 'finished') {
      calculateFinalStats();
    }
  }, [status, calculateFinalStats]);

  // This hook primarily manages side effects and updates parent state.
  return {};
};

export default useTimerAndStats;