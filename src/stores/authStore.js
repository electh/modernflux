import { persistentAtom } from "@nanostores/persistent";
import { startAutoSync, stopAutoSync } from "./syncStore";

const defaultValue = {
  serverUrl: "",
  apiKey: "",
  userId: "",
  username: "",
}

export const authState = persistentAtom("auth", defaultValue, {
  encode: JSON.stringify,
  decode: (str) => {
    const storedValue = JSON.parse(str)
    return { ...defaultValue, ...storedValue }
  },
})

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

    // 启动自动同步
    startAutoSync();

    return user;
  } catch (error) {
    console.error("登录失败:", error);
    throw error;
  }
}

// 登出方法
export function logout() {
  // 停止自动同步
  stopAutoSync();
  
  authState.set(defaultValue);
  // 删除 localStorage 中的全部信息
  localStorage.clear();
  // 删除 indexedDB 中的全部信息
  indexedDB.deleteDatabase("minifluxReader");
}
