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
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Customize() {
  const isMobile = useIsMobile();
  const $customizeModelOpen = useStore(customizeModelOpen);
  const { articleId } = useParams();

  useEffect(() => {
    customizeModelOpen.set(false);
  }, [articleId]);

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
    <Drawer
      open={$customizeModelOpen}
      onOpenChange={customizeModelOpen.set}
      modal={false}
    >
      <DrawerContent className="max-h-[50vh] border-none bg-sidebar shadow-custom">
        <DrawerHeader className="border-b">
          <DrawerTitle className="w-full flex items-center space-between">
            <span className="flex-1 text-base text-left">自定义阅读设置</span>
            <span
              className="text-primary text-sm"
              onClick={() => customizeModelOpen.set(false)}
            >
              关闭
            </span>
          </DrawerTitle>
          <DrawerDescription className="hidden">
            调整文章显示的字体、大小和其他设置
          </DrawerDescription>
        </DrawerHeader>
        <CustomizeForm />
      </DrawerContent>
    </Drawer>
  );
}

function CustomizeForm({ className }) {
  return (
    <div
      className={cn(
        "customize-form flex-1 overflow-y-auto bg-background p-4 flex flex-col gap-4",
        className,
      )}
    >
      <Text />
      <Title />
      <Button onClick={resetSettings}>重 置</Button>
    </div>
  );
}
