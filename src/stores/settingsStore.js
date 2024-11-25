import { persistentAtom } from "@nanostores/persistent";
import { atom } from "nanostores";

export const customizeModelOpen = atom(false);

const defaultValue = {
  lineHeight: 1.8,
  fontSize: 18,
  maxWidth: 65, // 单位为ch
  alignJustify: false,
  fontFamily: "system-ui",
};

export const settingsState = persistentAtom("settings", defaultValue, {
  encode: (value) => {
    const filteredValue = Object.keys(value).reduce((acc, key) => {
      if (key in defaultValue) {
        acc[key] = value[key];
      }
      return acc;
    }, {});
    return JSON.stringify(filteredValue);
  },
  decode: (str) => {
    const storedValue = JSON.parse(str);
    return { ...defaultValue, ...storedValue };
  },
});

export const updateSettings = (settingsChanges) =>
  settingsState.set({ ...settingsState.get(), ...settingsChanges });

export const resetSettings = () => settingsState.set(defaultValue);
