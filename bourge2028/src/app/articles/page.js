// app/editor/page.tsx
import EditorCanvas from "@/app/components/article/zoneEdition";
import { ComponentPalette } from "@/app/components/article/palette";

export default function EditorPage() {
  return (
    <div className="flex">
      <EditorCanvas />
      <ComponentPalette />
    </div>
  );
}
