const languageCodeMap = {
  English: "en",
  French: "fr",
  German: "de",
  Hindi: "hi",
};
export const languageMap = {
  1: "en",
  2: "fr",
  3: "de",
  4: "hi",
};

export function getLanguageCode(languageTitle) {
  return languageCodeMap[languageTitle] || null;
}

export const invertedLanguageMap = Object.fromEntries(
  Object.entries(languageMap).map(([key, value]) => [value, key])
);
