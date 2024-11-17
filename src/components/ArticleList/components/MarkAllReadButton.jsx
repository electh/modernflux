import { useParams } from "react-router-dom";
import { CircleCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { markAllAsRead } from "@/stores/articlesStore";

export default function MarkAllReadButton() {
  const { feedId, categoryId } = useParams();

  const handleMarkAllRead = async (type) => {
    try {
      switch (type) {
        case 'feed':
          await markAllAsRead('feed', feedId);
          break;
        case 'category':
          await markAllAsRead('category', categoryId);
          break;
        default:
          await markAllAsRead();
      }
    } catch (err) {
      console.error('标记已读失败:', err);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost" 
          size="icon"
          className="h-8 w-8"
        >
          <CircleCheck className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => {
          if (feedId) {
            handleMarkAllRead('feed');
          } else if (categoryId) {
            handleMarkAllRead('category'); 
          } else {
            handleMarkAllRead();
          }
        }}>
          {feedId ? '标记当前订阅源为已读' : 
           categoryId ? '标记当前分类为已读' : 
           '标记所有文章为已读'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 