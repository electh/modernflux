import { ArrowLeft, CircleDot, Forward, Reply, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  handleMarkStatus,
  handleToggleStar,
} from "@/handlers/articleHandlers.js";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

export default function ActionButtons({ article }) {
  return (
    <div className="border-b absolute top-0 left-0 right-0 bg-background/80 backdrop-blur-sm w-full z-10 p-2 ">
      <div className="flex items-center space-between">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">关闭</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>关闭</TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="h-6" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Reply className="h-4 w-4" />
                <span className="sr-only">上一篇</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>上一篇</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Forward className="h-4 w-4" />
                <span className="sr-only">下一篇</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>下一篇</TooltipContent>
          </Tooltip>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handleToggleStar(article, e)}
              >
                <Star className="h-4 w-4" />
                <span className="sr-only">收藏</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>收藏</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handleMarkStatus(article, e)}
              >
                <CircleDot className="h-4 w-4" />
                <span className="sr-only">已读</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>已读</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
