import {
  Check,
  Cog,
  Keyboard,
  Laptop,
  LogOut,
  Moon,
  Sun,
  User,
} from "lucide-react";
import { useStore } from "@nanostores/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authState, logout } from "@/stores/authStore.js";
import { setTheme, themeState } from "@/stores/themeStore.js";

export function Profile() {
  const { username } = useStore(authState);
  const theme = useStore(themeState);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <User />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuLabel>{username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {theme === "light" ? (
              <Sun className="size-4" />
            ) : theme === "dark" ? (
              <Moon className="size-4" />
            ) : (
              <Laptop className="size-4" />
            )}
            <span>外观</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Check
                  className={theme === "light" ? "opacity-100" : "opacity-0"}
                />
                <span>浅色</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Check
                  className={theme === "dark" ? "opacity-100" : "opacity-0"}
                />
                <span>深色</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Check
                  className={theme === "system" ? "opacity-100" : "opacity-0"}
                />
                <span>跟随系统</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Cog />
            <span>设置</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Keyboard />
            <span>快捷键</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => logout()}>
          <LogOut />
          <span>注销</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
