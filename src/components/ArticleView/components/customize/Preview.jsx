import { settingsState } from "@/stores/settingsStore";
import { useStore } from "@nanostores/react";
import { cn, getFontSizeClass } from "@/lib/utils";

export default function Preview() {
  const { lineHeight, fontSize, maxWidth } = useStore(settingsState);

  return (
    <div
      className={cn(
        "prose dark:prose-invert p-6 h-48 overflow-hidden shrink-0",
        getFontSizeClass(fontSize),
      )}
      style={{
        lineHeight: lineHeight + "em",
        maxWidth: `${maxWidth}ch`,
      }}
    >
      <blockquote>白日依山尽，黄河入海流。欲穷千里目，更上一层楼。</blockquote>
      <div>
        &ldquo;白日依山尽&quot;写远景，写山，写的是登楼望见的景色，&ldquo;黄河入海流&quot;写近景，写水写得景象壮观，气势磅礴，诗人既高度形象又高度概括地把进入广大视野的万里河山，收入短短十个字中。
      </div>
    </div>
  );
}
