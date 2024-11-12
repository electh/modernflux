import { Outlet } from "react-router-dom";
import "./App.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.jsx";
import FeedListSidebar from "@/components/FeedList/FeedListSidebar.jsx";

function App() {
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
