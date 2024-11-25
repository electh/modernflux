import { updateSettings } from "@/stores/settingsStore";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem as SelectItemUI, SelectTrigger, SelectValue } from "@/components/ui/select";

export const SliderItem = ({
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

export const SwitchItem = ({
  label,
  icon,
  settingName,
  settingValue,
}) => {
  return (
    <div className="flex justify-between items-center gap-2 bg-background p-2">
      <div className="flex items-center gap-2">
        {icon}
        <div className="text-sm text-foreground">{label}</div>
      </div>
      <Switch
        checked={settingValue}
          onCheckedChange={(value) => updateSettings({ [settingName]: value })}
      />
    </div>
  );
};

export function SelectItem({ label, icon, settingName, settingValue, options }) {
  return (
    <div className="flex justify-between items-center gap-2 bg-background p-2">
      <div className="flex items-center gap-2">
        {icon}
        <div className="text-sm text-foreground">{label}</div>
      </div>
      <Select
        value={settingValue}
        onValueChange={(value) => updateSettings({ [settingName]: value })}
      >
        <SelectTrigger className="w-[140px] h-6 border-none px-0 justify-end gap-2 focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="w-48">
          {options.map((option) => (
            <SelectItemUI 
              key={option.value} 
              value={option.value}
              style={option.style || {}}
            >
              {option.label}
            </SelectItemUI>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
