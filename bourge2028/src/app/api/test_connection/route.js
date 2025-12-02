import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ status: "non connecté ❌" }), { status: 401 });
  }
  return new Response(JSON.stringify({ status: "connecté ✅", personne: session.personne }), { status: 200 });
}
