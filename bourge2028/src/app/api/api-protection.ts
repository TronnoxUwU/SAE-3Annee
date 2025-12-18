import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";

export type AuthResult =
  | { access: true }
  | { access: false; status: number; error: string };

export async function AuthAdmin(): Promise<AuthResult> {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      access: false,
      status: 401,
      error: "Non authentifié",
    };
  }

  if (session.user.role !== "Admin" && session.user.role !== "admin") {
    return {
      access: false,
      status: 403,
      error: "Accès refusé",
    };
  }

  return { access: true };
}

export async function AuthUser(id: Number): Promise<AuthResult>{
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      access: false,
      status: 401,
      error: "Non authentifié",
    };
  }

  if (session.user.id !== id) {
    return {
      access: false,
      status: 403,
      error: "Accès refusé",
    };
  }

  return { access: true };
}
