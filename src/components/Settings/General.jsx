import { settingsState } from "@/stores/settingsStore";
import { ClockArrowDown, ClockArrowUp } from "lucide-react";
import { useStore } from "@nanostores/react";
import { SelectItem } from "@/components/ui-customize/settingItem.jsx";

export default function General() {
  const { sortDirection } = useStore(settingsState);

  return (
    <div className="flex flex-col gap-1">
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
