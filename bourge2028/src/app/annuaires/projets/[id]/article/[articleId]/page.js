// app/editor/page.tsx
import { Editor } from "@/app/components/article/zoneEdition";
import "@/app/components/article/global.css";
import Topbar from "@/components/Topbar";

export default async function Page({ params }) {
  const id = await params
  return (
    <>
      <Topbar title="Bourges 2028 - Projet"/>
      <Editor realisation={id.id}/>
    </>
  );
}
