import { settingsState } from "@/stores/settingsStore";
import {
  AlignJustify,
  CaseSensitive,
  Type,
  UnfoldHorizontal,
  UnfoldVertical,
} from "lucide-react";
import { useStore } from "@nanostores/react";
import { SelectItem, SliderItem, SwitchItem } from "./settingItem";
import { Separator } from "@/components/ui/separator";

const fontOptions = [
  { label: "系统默认", value: "system-ui", style: { fontFamily: "system-ui" } },
  {
    label: "Sans-serif",
    value: "sans-serif",
    style: { fontFamily: "sans-serif" },
  },
  { label: "Serif", value: "serif", style: { fontFamily: "serif" } },
  {
    label: "思源宋体",
    value: "'Noto Serif SC'",
    style: { fontFamily: "'Noto Serif SC', serif" },
  },
  {
    label: "思源黑体",
    value: "'Noto Sans SC'",
    style: { fontFamily: "'Noto Sans SC', sans-serif" },
  },
  {
    label: "霞鹜文楷",
    value: "'LXGW WenKai'",
    style: { fontFamily: "'LXGW WenKai', serif" },
  },
];

export default function Text() {
  const { lineHeight, fontSize, maxWidth, alignJustify, fontFamily } =
    useStore(settingsState);
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-muted-foreground ml-2">文字</div>
      <div className="rounded-lg overflow-hidden">
        <SelectItem
          label="字体"
          icon={<Type className="shrink-0 size-4" />}
          settingName="fontFamily"
          settingValue={fontFamily}
          options={fontOptions}
        />
        <Separator />
        <SwitchItem
          label="使文本两端对齐"
          icon={<AlignJustify className="shrink-0 size-4" />}
          settingName="alignJustify"
          settingValue={alignJustify}
        />
        <Separator />
        <SliderItem
          label="行间距"
          icon={<UnfoldVertical className="shrink-0 size-4" />}
          settingName="lineHeight"
          settingValue={lineHeight}
          max={2.5}
          min={1.2}
          step={0.1}
        />
        <Separator />
        <SliderItem
          label="大小"
          icon={<CaseSensitive className="shrink-0 size-4" />}
          settingName="fontSize"
          settingValue={fontSize}
          max={24}
          min={14}
          step={2}
        />
        <Separator />
        <SliderItem
          label="最大宽度"
          icon={<UnfoldHorizontal className="shrink-0 size-4" />}
          settingName="maxWidth"
          settingValue={maxWidth}
          max={80}
          min={50}
          step={5}
        />
      </div>
    </div>
  );
}
