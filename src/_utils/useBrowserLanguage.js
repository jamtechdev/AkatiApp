import { useEffect, useState } from "react";

const useBrowserLanguage = () => {
  const fullLocale = navigator.language || navigator.userLanguage;
  const languageOnly = fullLocale.split("-")[0]; // Extract only the language part
  return languageOnly;
};

export default useBrowserLanguage;
