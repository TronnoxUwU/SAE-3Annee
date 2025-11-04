// app/editor/page.tsx
import EditorCanvas from "@/components/zoneEdition";
import { ComponentPalette } from "@/components/palette";

export default function EditorPage() {
  return (
    <div className="flex">
      <EditorCanvas />
      <ComponentPalette />
    </div>
  );
}
