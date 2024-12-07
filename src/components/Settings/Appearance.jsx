import { settingsState } from "@/stores/settingsStore";
import { Separator } from "@/components/ui/separator.jsx";
import { useStore } from "@nanostores/react";
import {
  SelectItem,
  SwitchItem,
} from "@/components/ui-customize/settingItem.jsx";
import { Circle, Rss, Square } from "lucide-react";

export default function Appearance() {
  const { feedIconShape, useGrayIcon } = useStore(settingsState);
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-muted-foreground ml-2">订阅源图标</div>
      <div className="rounded-lg overflow-hidden border border-border/50">
        <SelectItem
          label="形状"
          icon={
            feedIconShape === "circle" ? (
              <Circle className="shrink-0 size-4" />
            ) : (
              <Square className="shrink-0 size-4" />
            )
          }
          settingName="feedIconShape"
          settingValue={feedIconShape}
          options={[
            { value: "circle", label: "圆形" },
            { value: "square", label: "方形" },
          ]}
        />
        <Separator className="bg-border/50" />
        <SwitchItem
          label="使用灰阶图标"
          icon={<Rss className="shrink-0 size-4" />}
          settingName="useGrayIcon"
          settingValue={useGrayIcon}
        />
      </div>
    </div>
  );
}
