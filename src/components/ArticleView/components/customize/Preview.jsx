import { settingsState } from "@/stores/settingsStore";
import { useStore } from "@nanostores/react";
import { cn, getFontSizeClass } from "@/lib/utils";

export default function Preview() {
  const {
    lineHeight,
    fontSize,
    maxWidth,
    alignJustify,
    fontFamily,
    titleFontSize,
    titleAlignType,
  } = useStore(settingsState);

  return (
    <div
      className={cn(
        "prose dark:prose-invert p-6 h-48 overflow-hidden shrink-0",
        getFontSizeClass(fontSize),
      )}
      style={{
        fontFamily: fontFamily,
      }}
    >
      <div
        className="font-bold my-2 hover:cursor-pointer"
        style={{
          fontSize: `${titleFontSize * fontSize}px`,
          textAlign: titleAlignType,
        }}
      >
        白日依山尽，黄河入海流。
      </div>
      <div
        style={{
          lineHeight: lineHeight + "em",
          maxWidth: `${maxWidth}ch`,
          textAlign: alignJustify ? "justify" : "left",
        }}
      >
        &ldquo;白日依山尽&rdquo;写远景，写山，写的是登楼望见的景色，&ldquo;黄河入海流&rdquo;写近景，写水写得景象壮观，气势磅礴，诗人既高度形象又高度概括地把进入广大视野的万里河山，收入短短十个字中。
      </div>
    </div>
  );
}
