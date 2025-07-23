import { useEffect, useCallback } from 'react';

/**
 * Custom hook for managing the game timer and calculating real-time WPM/Accuracy.
 * This hook causes side effects (timer interval) and calls setters from its parent hook.
 *
 * @param {string} status - Current game status ('waiting', 'started', 'finished').
 * @param {string} testMode - Current test mode ('time' or 'words').
 * @param {React.MutableRefObject} startTimeRef - Ref to store the test start timestamp.
 * @param {React.MutableRefObject} correctTypedCharsRef - Ref for current correct characters (owned by useGameInitialization).
 * @param {React.MutableRefObject} totalTypedCharsRef - Ref for current total typed characters (owned by useGameInitialization).
 * @param {function} setStatus - Function to update game status (owned by useGameInitialization).
 * @param {function} setTimer - Function to update timer state (owned by useGameInitialization).
 * @param {function} setWpm - Function to update WPM state (owned by useTypingTest).
 * @param {function} setRawWpm - Function to update Raw WPM state (owned by useTypingTest).
 * @param {function} setAccuracy - Function to update Accuracy state (owned by useTypingTest).
 * @param {function} calculateFinalResults - Callback to calculate final results (owned by useTypingTest).
 * @returns {void} This hook doesn't return any state, as its primary purpose is side effects and updating parent state.
 */
const useTimerAndStats = (
  status, testMode,
  startTimeRef, correctTypedCharsRef, totalTypedCharsRef,
  setStatus, setTimer,
  setWpm, setRawWpm, setAccuracy,
  calculateFinalResults
) => {

  const calculateRealtimeStats = useCallback(() => {
    // Ensure test has started and there's elapsed time to prevent division by zero
    if (startTimeRef.current === 0) return;

    const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
    if (elapsedTime === 0) return;

    const timeMinutes = elapsedTime / 60;

    const currentNetWpm = (correctTypedCharsRef.current / 5) / timeMinutes;
    setWpm(Math.round(currentNetWpm > 0 ? currentNetWpm : 0));

    const currentRawWpm = (totalTypedCharsRef.current / 5) / timeMinutes;
    setRawWpm(Math.round(currentRawWpm > 0 ? currentRawWpm : 0));

    const currentAccuracy = totalTypedCharsRef.current > 0 ? (correctTypedCharsRef.current / totalTypedCharsRef.current) * 100 : 0;
    setAccuracy(Math.round(currentAccuracy > 0 ? currentAccuracy : 0));
  }, [setWpm, setRawWpm, setAccuracy, startTimeRef, correctTypedCharsRef, totalTypedCharsRef]);

  // Main timer and stats update effect
  useEffect(() => {
    let interval;

    if (status === 'started') {
      interval = setInterval(() => {
        calculateRealtimeStats(); // Update real-time stats

        // For 'time' mode, also decrement the timer and check for end condition
        if (testMode === 'time') {
          setTimer((prevTimer) => {
            if (prevTimer === 1) {
              clearInterval(interval);
              setStatus('finished');
              calculateFinalResults(); // Call final results calculation
              return 0;
            }
            return prevTimer - 1;
          });
        }
      }, 1000); // Update every second
    }

    // Cleanup function for interval when component unmounts or dependencies change
    return () => clearInterval(interval);
  }, [status, testMode, setTimer, setStatus, calculateRealtimeStats, calculateFinalResults]);

  // This hook primarily manages side effects and updates parent state, so it doesn't return its own state.
  return {};
};

export default useTimerAndStats;