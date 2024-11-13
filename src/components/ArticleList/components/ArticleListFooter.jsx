import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui-customize/AnimatedTabs.jsx";
import { filter } from "@/stores/articlesStore";
import { CircleDot, Infinity, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator.jsx";

export default function ArticleListFooter() {
  return (
    <div className="absolute bottom-0 bg-sidebar/80 backdrop-blur-sm w-full">
      <Separator className="mx-2 w-auto" />
      <Tabs
        defaultValue="all"
        onValueChange={(value) => {
          filter.set(value);
        }}
      >
        <div className="flex items-center justify-center p-2">
          <TabsList className="rounded-full gap-3 p-1 h-auto">
            <TabsTrigger value="starred" className="rounded-full px-2 py-1">
              <Star className="size-3 mr-1" />
              <span className="text-xs">收藏</span>
            </TabsTrigger>
            <TabsTrigger value="unread" className="rounded-full px-2 py-1">
              <CircleDot className="size-3 mr-1" />
              <span className="text-xs">未读</span>
            </TabsTrigger>
            <TabsTrigger value="all" className="rounded-full px-2 py-1">
              <Infinity className="size-3 mr-1" />
              <span className="text-xs">全部</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
}
