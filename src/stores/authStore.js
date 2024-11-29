import { persistentAtom } from "@nanostores/persistent";
import { stopAutoSync } from "./syncStore";
import { feeds } from "./feedsStore";
import { filter, filteredArticles } from "./articlesStore";

const defaultValue = {
  serverUrl: "",
  apiKey: "",
  userId: "",
  username: "",
};

export const authState = persistentAtom("auth", defaultValue, {
  encode: JSON.stringify,
  decode: (str) => {
    const storedValue = JSON.parse(str);
    return { ...defaultValue, ...storedValue };
  },
});

// 登录方法
export async function login(serverUrl, apiKey) {
  try {
    // 验证 API 密钥是否有效
    const response = await fetch(`${serverUrl}/v1/me`, {
      headers: {
        "X-Auth-Token": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error("无效的服务器地址或 API 密钥");
    }

    const user = await response.json();

    // 保存认证信息
    authState.set({
      serverUrl,
      apiKey,
      userId: user.id,
      username: user.username,
    });

    return user;
  } catch (error) {
    console.error("登录失败:", error);
    throw error;
  }
}

// 登出方法
export async function logout() {
  try {
    // 停止自动同步
    stopAutoSync();

    // 重置所有状态
    authState.set(defaultValue);
    feeds.set([]);
    filteredArticles.set([]);
    filter.set("all");
    // ... 重置其他状态

    // 异步清理存储
    await Promise.all([
      // 清理 localStorage
      new Promise((resolve) => {
        localStorage.clear();
        resolve();
      }),
      // 清理 indexedDB
      new Promise((resolve, reject) => {
        const request = indexedDB.deleteDatabase("minifluxReader");
        request.onsuccess = () => resolve();
        request.onerror = () => reject();
      }),
    ]);
  } catch (error) {
    console.error("登出失败:", error);
    // 可以选择是否抛出错误
  }
}
