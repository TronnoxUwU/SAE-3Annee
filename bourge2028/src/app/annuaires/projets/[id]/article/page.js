// app/editor/page.tsx
import { Editor } from "@/app/components/article/zoneEdition";
import "@/app/components/article/global.css";

export default async function Page({ params }) {
  const id = await params
  return (
    <Editor realisation={id.id}/>
  );
}
