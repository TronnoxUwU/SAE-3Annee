import ProjetView from "@/app/components/realisation/Realisation";
import Topbar from "@/components/Topbar";

export default async function Page({ params }) {
  const { id } = await params;

  return (
    <div>
        <Topbar title="Bourges 2028 - Projet"/>
        <ProjetView id={id} />
    </div>
  );
}

