import { settingsState, updateSettings } from "@/stores/settingsStore";
import { CaseSensitive, UnfoldHorizontal, UnfoldVertical } from "lucide-react";
import { useStore } from "@nanostores/react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const SliderItem = ({
  label,
  icon,
  settingName,
  settingValue,
  max,
  min,
  step,
}) => {
  return (
    <div className="grid gap-2 bg-background p-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="flex items-center gap-2">
        {icon}
        <Slider
          value={[settingValue]}
          onValueChange={(value) => updateSettings({ [settingName]: value[0] })}
          max={max}
          min={min}
          step={step}
        />
        <Badge className="w-12 justify-center" variant="secondary">
          {settingValue}
        </Badge>
      </div>
    </div>
  );
};

export default function Text() {
  const { lineHeight, fontSize, maxWidth } = useStore(settingsState);
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-muted-foreground ml-2">文字</div>
      <div className="rounded-lg overflow-hidden">
        <SliderItem
          label="行间距"
          icon={<UnfoldVertical />}
          settingName="lineHeight"
          settingValue={lineHeight}
          max={2.5}
          min={1.2}
          step={0.1}
        />
        <Separator />
        <SliderItem
          label="大小"
          icon={<CaseSensitive />}
          settingName="fontSize"
          settingValue={fontSize}
          max={24}
          min={14}
          step={2}
        />
        <Separator />
        <SliderItem
          label="最大宽度"
          icon={<UnfoldHorizontal />}
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
