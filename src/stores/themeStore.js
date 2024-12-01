import { persistentAtom } from "@nanostores/persistent";

// 创建主题状态存储
export const themeState = persistentAtom("theme", "system", {
  encode: JSON.stringify,
  decode: JSON.parse,
});

// 更新主题的函数
export function setTheme(theme) {
  const root = window.document.documentElement;
  root.classList.remove("light", "dark");

  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
  
  themeState.set(theme);
}

// 初始化主题
export function initTheme() {
  const theme = themeState.get();
  setTheme(theme);

  // 监听系统主题变化
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", (e) => {
    if (themeState.get() === "system") {
      const systemTheme = e.matches ? "dark" : "light";
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(systemTheme);
    }
  });
} 