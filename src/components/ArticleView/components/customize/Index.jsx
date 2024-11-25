import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import Preview from "./Preview";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useStore } from "@nanostores/react";
import { customizeModelOpen, resetSettings } from "@/stores/settingsStore";
import Text from "./Text";

export default function Customize() {
  const isMobile = useIsMobile();
  const $customizeModelOpen = useStore(customizeModelOpen);
  if (!isMobile) {
    return (
      <Dialog open={$customizeModelOpen} onOpenChange={customizeModelOpen.set}>
        <DialogContent className="flex flex-col sm:max-w-lg sm:max-h-[80vh] p-0 gap-0">
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
      className="max-h-[80vh]"
    >
      <DrawerContent>
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
      <Button onClick={resetSettings}>重置</Button>
    </div>
  );
}
