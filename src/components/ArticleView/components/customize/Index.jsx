import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import Preview from "./Preview";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useStore } from "@nanostores/react";
import { customizeModelOpen, resetSettings } from "@/stores/settingsStore";
import Text from "./Text";
import Title from "./Title";

export default function Customize() {
  const isMobile = useIsMobile();
  const $customizeModelOpen = useStore(customizeModelOpen);

  if (!isMobile) {
    return (
      <Dialog open={$customizeModelOpen} onOpenChange={customizeModelOpen.set}>
        <DialogContent className="flex flex-col sm:max-w-lg sm:max-h-[80vh] p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-4 hidden">
            <DialogTitle>自定义阅读设置</DialogTitle>
            <DialogDescription>
              调整文章显示的字体、大小和其他设置
            </DialogDescription>
          </DialogHeader>
          <Preview />
          <Separator />
          <CustomizeForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={$customizeModelOpen} onOpenChange={customizeModelOpen.set}>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader className="hidden">
          <DrawerTitle>自定义阅读设置</DrawerTitle>
          <DrawerDescription>
            调整文章显示的字体、大小和其他设置
          </DrawerDescription>
        </DrawerHeader>
        <Preview />
        <Separator />
        <CustomizeForm />
      </DrawerContent>
    </Drawer>
  );
}

function CustomizeForm({ className }) {
  return (
    <div
      className={cn(
        "customize-form flex-1 overflow-y-auto bg-muted p-4 flex flex-col gap-4",
        className,
      )}
    >
      <Text />
      <Title />
      <Button onClick={resetSettings}>重 置</Button>
    </div>
  );
}
