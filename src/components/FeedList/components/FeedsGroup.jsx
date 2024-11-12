import { useStore } from "@nanostores/react";
import {
  feedsByCategory,
  getCategoryCount,
  getFeedCount,
} from "@/stores/feedsStore.js";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible.jsx";
import { Link } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar.jsx";
import FeedIcon from "@/components/ui-customize/FeedIcon";

const FeedsGroup = () => {
  const $feedsByCategory = useStore(feedsByCategory);
  const $getCategoryCount = useStore(getCategoryCount);
  const $getFeedCount = useStore(getFeedCount);
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>订阅源</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {$feedsByCategory.map((category) => (
            <Collapsible key={category.title}>
              <SidebarMenuItem key={`menu-${category.title}`}>
                <SidebarMenuButton asChild>
                  <Link
                    to={`/category/${category.title}`}
                    onClick={() => isMobile && setOpenMobile(false)}
                  >
                    <span className={"pl-6"}>{category.title}</span>
                  </Link>
                </SidebarMenuButton>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction className="left-2 hover:bg-sidebar-accent text-sidebar-accent-foreground data-[state=open]:rotate-90">
                    <ChevronRight />
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <SidebarMenuBadge className="justify-end">
                  {$getCategoryCount(category.feeds)}
                </SidebarMenuBadge>
                <CollapsibleContent>
                  <SidebarMenuSub className="m-0 px-0 border-none">
                    {category.feeds.map((feed) => (
                      <SidebarMenuSubItem key={feed.id}>
                        <SidebarMenuSubButton asChild className="pl-8 pr-2">
                          <Link
                            to={`/feed/${feed.id}`}
                            onClick={() => isMobile && setOpenMobile(false)}
                          >
                            <FeedIcon url={feed.site_url} />
                            <span className="flex-1 truncate">
                              {feed.title}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              {$getFeedCount(feed.id) !== 0 &&
                                $getFeedCount(feed.id)}
                            </span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default FeedsGroup;
