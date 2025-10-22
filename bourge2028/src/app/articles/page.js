// app/editor/page.tsx
import { Editor } from "@/app/components/article/zoneEdition";
import { Palette } from "@/app/components/article/palette";
import "@/app/components/article/global.css";

export default function EditorPage() {
  return (
    <div className="page-container">
        <Palette />
        <Editor />
      
    </div>
  );
}
