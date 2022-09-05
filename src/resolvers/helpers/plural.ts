const plural = (str: string): string => {
  if (str.substring(str.length - 1) === 'y') {
    return `${str.substring(0, str.length - 1)}ies`;
  }
  return `${str}s`;
};

export default plural;
