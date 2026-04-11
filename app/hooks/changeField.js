
export const changeField = ({ setDict, field, value }) => {
    setDict(prevState => {
      if (prevState[field] === value) {
        // No state change required
        return prevState;
      }
      // Update state only if the value is different
      return {
        ...prevState,
        [field]: value,
      };
    });
  };   