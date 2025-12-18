import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";


export async function AuthAdmin() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { acces: false},
        { status: 401 }
      );
    }

    if (session.user.role !== "Admin" || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Accès refusé" },
        { acces: false},
        { status: 403 }
      );
    }
    else {
      return NextResponse.json(
        { error: "Accès autorisé" },
        { acces: true},
        { status: 200 }
      );
    }


  } catch (error) {
      // console.error("Erreur auth", error);
      return NextResponse.json(
      { error: "Erreur auth" },
      { status: 500 }
      );
  }
}