import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import { loadFeeds } from "@/stores/feedsStore.js";
import { isSyncing, lastSync } from "@/stores/syncStore.js";
import SyncButton from "@/components/FeedList/components/SyncButton.jsx";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpenText } from "lucide-react";
import ArticlesGroup from "@/components/FeedList/components/ArticlesGroup.jsx";
import FeedsGroup from "@/components/FeedList/components/FeedsGroup.jsx";
import { formatLastSync } from "@/lib/format";
import { ModeToggle } from "@/components/mode-toggle.jsx";

const FeedListSidebar = () => {
  const $lastSync = useStore(lastSync);
  const $isSyncing = useStore(isSyncing);
  useEffect(() => {
    loadFeeds();
  }, [$lastSync]);

  return (
    <Sidebar variant="sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2">
              <div className="flex aspect-square size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <BookOpenText className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">ReactFlux</span>
                <span className="truncate text-xs text-muted-foreground">
                  {$isSyncing ? "同步中..." : formatLastSync($lastSync)}
                </span>
              </div>
              <SyncButton />
              <ModeToggle />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <ScrollArea>
        <SidebarContent>
          <ArticlesGroup />
          <FeedsGroup />
        </SidebarContent>
      </ScrollArea>
    </Sidebar>
  );
};

export default FeedListSidebar;
