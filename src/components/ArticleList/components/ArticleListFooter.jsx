import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { filter } from "@/stores/articlesStore";

export default function ArticleListFooter() {
  return (
    <div className="border-t absolute bottom-0 bg-background/80 backdrop-blur-sm w-full z-10">
      <Tabs
        defaultValue="all"
        onValueChange={(value) => {
          filter.set(value);
        }}
      >
        <div className="flex items-center px-4 py-2">
          <TabsList className="w-full">
            <TabsTrigger
              value="starred"
              className="flex-1 text-zinc-600 dark:text-zinc-200"
            >
              收藏
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="flex-1 text-zinc-600 dark:text-zinc-200"
            >
              未读
            </TabsTrigger>
            <TabsTrigger
              value="all"
              className="flex-1 text-zinc-600 dark:text-zinc-200"
            >
              全部
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
}
