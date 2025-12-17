// app/editor/page.tsx
import { Editor } from "@/app/components/article/zoneEdition";
import "@/app/components/article/global.css";
import Topbar from "@/components/Topbar";

// app/editor/page.tsx
export default async function Page({ params }) {
  const id = await params;
  
  // ✅ Fetch seulement si on est en mode édition (id existe)
  let articleData = null;
  
  if (id.id) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${id.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    
    articleData = await response.json();
  }

  return (
    <>
      <Topbar title="Bourges 2028 - Projet"/>
      <Editor 
        realisation={-1} 
        article={articleData}
      />
    </>
  );
}