import { settingsState } from "@/stores/settingsStore";
import { ClockArrowDown, ClockArrowUp, Eye } from "lucide-react";
import { useStore } from "@nanostores/react";
import {
  SelectItem,
  SwitchItem,
} from "@/components/ui-customize/settingItem.jsx";

export default function General() {
  const { sortDirection, showHiddenFeeds } = useStore(settingsState);

  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-muted-foreground ml-2">订阅源</div>
      <div className="rounded-lg overflow-hidden border border-border/50">
        <SwitchItem
          label="显示隐藏的订阅源"
          icon={<Eye className="shrink-0 size-4" />}
          settingName="showHiddenFeeds"
          settingValue={showHiddenFeeds}
        />
      </div>
      <div className="my-1"></div>
      <div className="text-xs text-muted-foreground ml-2">文章列表</div>
      <div className="rounded-lg overflow-hidden border border-border/50">
        <SelectItem
          label="排序"
          icon={
            sortDirection === "desc" ? (
              <ClockArrowDown className="shrink-0 size-4" />
            ) : (
              <ClockArrowUp className="shrink-0 size-4" />
            )
          }
          settingName="sortDirection"
          settingValue={sortDirection}
          options={[
            { value: "desc", label: "新文章优先" },
            { value: "asc", label: "旧文章优先" },
          ]}
        />
      </div>
    </div>
  );
}
