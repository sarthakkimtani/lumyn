export const getFirstWords = (value: string) => {
  const words = value.trim().split(/\s+/).filter(Boolean);

  return words.slice(0, 8).join(" ");
};
