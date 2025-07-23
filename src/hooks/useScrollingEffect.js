import { useEffect } from 'react';

/**
 * Custom hook for handling scrolling behavior of the word container.
 * @param {number} activeWordIndex - Index of the currently active word.
 * @param {Array<string>} words - Array of words for the test.
 * @param {React.MutableRefObject} wordContainerRef - Ref for the word display container.
 */
const useScrollingEffect = (activeWordIndex, words, wordContainerRef) => {
  useEffect(() => {
    if (activeWordIndex > 0 && wordContainerRef.current) {
      const activeWordEl = wordContainerRef.current.querySelector('.word.active');
      if (activeWordEl) {
        const container = wordContainerRef.current;
        const containerHeight = container.clientHeight;

        // Scroll the container so the active word is roughly in the middle-third
        const targetScrollTop = activeWordEl.offsetTop - (containerHeight / 3);

        container.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });
      }
    }
  }, [activeWordIndex, words, wordContainerRef]);
};

export default useScrollingEffect;