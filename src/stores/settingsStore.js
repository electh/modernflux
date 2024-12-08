import { persistentAtom } from "@nanostores/persistent";
import { atom } from "nanostores";

export const customizeModelOpen = atom(false);
export const settingsModalOpen = atom(false);
const defaultValue = {
  lineHeight: 1.8,
  fontSize: 16,
  maxWidth: 70, // 单位为ch
  alignJustify: false,
  fontFamily: "system-ui",
  titleFontSize: 1.8, // 标题相对于正文大小的倍数
  titleAlignType: "left",
  feedIconShape: "square", // circle, square
  useGrayIcon: false,
  sortDirection: "desc", // asc, desc
  showHiddenFeeds: false,
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
