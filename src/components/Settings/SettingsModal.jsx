import { settingsModalOpen } from "@/stores/settingsStore.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog.jsx";
import { useStore } from "@nanostores/react";
import { useState } from "react";
import { Cog, Paintbrush } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar.jsx";
import Appearance from "@/components/Settings/Appearance.jsx";
import General from "@/components/Settings/General.jsx";
import { useIsMobile } from "@/hooks/use-mobile.jsx";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer.jsx";

const SETTINGS_TABS = [
  {
    id: "通用",
    icon: <Cog />,
    component: General,
  },
  {
    id: "外观",
    icon: <Paintbrush />,
    component: Appearance,
  },
];

export default function SettingsModal() {
  const $settingsModalOpen = useStore(settingsModalOpen);
  const [activeTab, setActiveTab] = useState("通用");
  const isMobile = useIsMobile();

  const data = {
    nav: SETTINGS_TABS.map((tab) => ({
      name: tab.id,
      icon: tab.icon,
    })),
  };
  if (!isMobile) {
    return (
      <Dialog
        open={$settingsModalOpen}
        onOpenChange={(value) => settingsModalOpen.set(value)}
      >
        <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
          <DialogTitle className="sr-only">设置</DialogTitle>
          <DialogDescription className="sr-only">个性化设置</DialogDescription>
          <SidebarProvider className="items-start">
            <Sidebar collapsible="none" className="hidden md:flex">
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {data.nav.map((item) => (
                        <SidebarMenuItem key={item.name}>
                          <SidebarMenuButton
                            asChild
                            isActive={item.name === activeTab}
                          >
                            <span onClick={() => setActiveTab(item.name)}>
                              {item.icon}
                              <span>{item.name}</span>
                            </span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
            <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
              <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4"></div>
              </header>
              <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
                {SETTINGS_TABS.map((tab) => {
                  const Component = tab.component;
                  return activeTab === tab.id ? (
                    <Component key={tab.id} />
                  ) : null;
                })}
              </div>
            </main>
          </SidebarProvider>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={$settingsModalOpen}
      onOpenChange={(value) => settingsModalOpen.set(value)}
    >
      <DrawerContent className="h-[90vh] border-none bg-sidebar shadow-custom">
        <DrawerHeader className="border-b">
          <DrawerTitle className="w-full flex items-center space-between">
            <span className="flex-1 text-base text-left">设置</span>
            <span
              className="text-primary text-sm"
              onClick={() => settingsModalOpen.set(false)}
            >
              关闭
            </span>
          </DrawerTitle>
          <DrawerDescription className="hidden">个性化设置</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto bg-background p-4 flex flex-col gap-4">
          <General />
          <Appearance />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
