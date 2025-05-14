import React from 'react';

interface KeyCombination {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
}

const useKeybinding = (
  keyCombination: KeyCombination,
  callback: () => void
): void => {
  const handleKeyPress = React.useCallback(
    (event: KeyboardEvent) => {
      let match = event.key === keyCombination.key;

      if (keyCombination.ctrlKey !== undefined) {
        match = match && event.ctrlKey === keyCombination.ctrlKey;
      }
      if (keyCombination.shiftKey !== undefined) {
        match = match && event.shiftKey === keyCombination.shiftKey;
      }
      if (keyCombination.altKey !== undefined) {
        match = match && event.altKey === keyCombination.altKey;
      }

      if (match) {
        event.preventDefault();
        callback();
      }
    },
    [keyCombination, callback]
  );

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);
};

export default useKeybinding;
