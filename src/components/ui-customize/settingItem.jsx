import { updateSettings } from "@/stores/settingsStore.js";
import { Slider } from "@/components/ui/slider.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem as SelectItemUI,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";

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
    <div className="grid gap-2 bg-muted/30 p-2">
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

export const SwitchItem = ({ label, icon, settingName, settingValue }) => {
  return (
    <div className="flex justify-between items-center gap-2 bg-muted/30 p-2">
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

export function SelectItem({
  label,
  icon,
  settingName,
  settingValue,
  options,
}) {
  return (
    <div className="flex justify-between items-center gap-2 bg-muted/30 p-2">
      <div className="flex items-center gap-2">
        {icon}
        <div className="text-sm text-foreground">{label}</div>
      </div>
      <Select
        value={settingValue}
        onValueChange={(value) => updateSettings({ [settingName]: value })}
      >
        <SelectTrigger className="w-fit h-6 border-none px-0 justify-end gap-2 bg-transparent focus:ring-transparent focus:ring-0 focus:ring-offset-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectGroup>
            {options.map((option) => (
              <SelectItemUI
                key={option.value}
                value={option.value}
                style={option.style || {}}
              >
                {option.label}
              </SelectItemUI>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export function GroupItem({ label, icon, settingName, settingValue, options }) {
  return (
    <div className="flex justify-between items-center gap-2 bg-muted/30 p-2">
      <div className="flex items-center gap-2">
        {icon}
        <div className="text-sm text-foreground">{label}</div>
      </div>
      <Tabs
        value={settingValue}
        onValueChange={(value) => {
          updateSettings({ [settingName]: value });
        }}
      >
        <div className="flex items-center justify-center">
          <TabsList className="p-0.5 h-fit">
            {options.map((option) => (
              <TabsTrigger
                key={option.value}
                value={option.value}
                className="px-2 py-0.5"
              >
                {option.icon}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
}
