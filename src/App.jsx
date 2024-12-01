import { Outlet } from "react-router-dom";
import "./App.css";
import { useEffect } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.jsx";
import FeedListSidebar from "@/components/FeedList/FeedListSidebar.jsx";
import { authState } from "@/stores/authStore.js";
import { startAutoSync } from "@/stores/syncStore.js";
import { initTheme } from "@/stores/themeStore.js";

function App() {
  useEffect(() => {
    // 初始化主题
    initTheme();
    
    // 检查认证状态并启动自动同步
    const auth = authState.get();
    if (auth.serverUrl && auth.apiKey) {
      startAutoSync();
    }
  }, []);

  return (
    <SidebarProvider>
      <FeedListSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
