import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
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
      error: `Accès refusé adm - ${session.user.role}`,
    };
  }

  return { access: true };
}

export async function AuthUser(id: number): Promise<AuthResult>{
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      access: false,
      status: 401,
      error: `Non authentifié`,
    };
  }

  if (session.user.id !== Number(id)) {
    return {
      access: false,
      status: 403,
      error: `Accès refusé - ${session.user.role}`,
    };
  }

  return { access: true };
}



export async function AuthStructureRole(
  structureId: number,
  allowedRoles: string[]
): Promise<AuthResult> {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      access: false,
      status: 401,
      error: "Non authentifié",
    };
  }

  try {
    const appartenir = await prisma.appartenir.findFirst({
      where: {
        personneId: session.user.id,
        structureId: structureId,
      },
      include: {
        role: true,
      },
    });

    if (!appartenir) {
      return {
        access: false,
        status: 403,
        error: "Vous n'appartenez pas à cette structure",
      };
    }

    if (!allowedRoles.includes(appartenir.role.nom)) {
      return {
        access: false,
        status: 403,
        error: "Rôle insuffisant pour cette action",
      };
    }

    return { access: true };
  } catch (error) {
    console.error("Erreur lors de la vérification du rôle:", error);
    return {
      access: false,
      status: 500,
      error: "Erreur serveur lors de la vérification des permissions",
    };
  }
}

export async function AuthAdminOrStructureRole(
  structureId: number,
  allowedRoles: string[]
): Promise<AuthResult> {
  const adminCheck = await AuthAdmin();
  if (adminCheck.access) {
    return { access: true };
  }

  return await AuthStructureRole(structureId, allowedRoles);
}