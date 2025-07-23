import React from 'react';
import styles from './InputField.module.css'; // Import the CSS Module

const InputField = React.memo(({ inputRef, userInput, handleInputChange, status }) => {
  return (
    <input
      ref={inputRef}
      type="text"
      className={styles.inputField}
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
  );
});

export default InputField;