import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/old route"

export async function GET(req) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new Response(JSON.stringify({ error: "Non autorisé" }), { status: 401 })
  }

  return new Response(JSON.stringify({
    message: "Données sécurisées 🔒",
    personne: session.personne
  }), { status: 200 })
}
