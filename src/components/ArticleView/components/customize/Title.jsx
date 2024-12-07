import { settingsState } from "@/stores/settingsStore";
import { Separator } from "@/components/ui/separator.jsx";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlignStartVertical,
  CaseSensitive,
} from "lucide-react";
import { useStore } from "@nanostores/react";
import {
  GroupItem,
  SliderItem,
} from "@/components/ui-customize/settingItem.jsx";

export default function Title() {
  const { titleFontSize, titleAlignType } = useStore(settingsState);
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-muted-foreground ml-2">标题</div>
      <div className="rounded-lg overflow-hidden border border-border/50">
        <GroupItem
          label="对齐"
          icon={<AlignStartVertical className="shrink-0 size-4" />}
          settingName="titleAlignType"
          settingValue={titleAlignType}
          options={[
            { value: "left", icon: <AlignLeft className="size-4" /> },
            { value: "center", icon: <AlignCenter className="size-4" /> },
            { value: "right", icon: <AlignRight className="size-4" /> },
          ]}
        />
        <Separator className="bg-border/50" />
        <SliderItem
          label="大小"
          icon={<CaseSensitive className="shrink-0 size-4" />}
          settingName="titleFontSize"
          settingValue={titleFontSize}
          max={3.0}
          min={1.0}
          step={0.2}
        />
      </div>
    </div>
  );
}
