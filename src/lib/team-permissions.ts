import { prisma } from "@/lib/prisma";
import { TeamRole } from "@prisma/client";

/**
 * Actions possibles dans une equipe
 */
export type TeamAction =
  | "view_team"           // Voir l'equipe et ses membres
  | "edit_team"           // Modifier les infos de l'equipe
  | "delete_team"         // Supprimer l'equipe
  | "invite_member"       // Inviter un membre
  | "remove_member"       // Retirer un membre
  | "change_member_role"  // Changer le role d'un membre
  | "view_qrcodes"        // Voir les QR codes de l'equipe
  | "create_qrcode"       // Creer un QR code pour l'equipe
  | "edit_qrcode"         // Modifier un QR code de l'equipe
  | "delete_qrcode";      // Supprimer un QR code de l'equipe

/**
 * Matrice des permissions par role
 */
const ROLE_PERMISSIONS: Record<TeamRole, TeamAction[]> = {
  OWNER: [
    "view_team",
    "edit_team",
    "delete_team",
    "invite_member",
    "remove_member",
    "change_member_role",
    "view_qrcodes",
    "create_qrcode",
    "edit_qrcode",
    "delete_qrcode",
  ],
  ADMIN: [
    "view_team",
    "edit_team",
    "invite_member",
    "remove_member",
    "change_member_role",
    "view_qrcodes",
    "create_qrcode",
    "edit_qrcode",
    "delete_qrcode",
  ],
  MEMBER: [
    "view_team",
    "view_qrcodes",
    "create_qrcode",
    "edit_qrcode",
  ],
  VIEWER: [
    "view_team",
    "view_qrcodes",
  ],
};

/**
 * Resultat d'une verification de permission
 */
export type PermissionCheckResult = {
  allowed: boolean;
  error?: string;
  role?: TeamRole;
  isOwner?: boolean;
};

/**
 * Recupere le role d'un utilisateur dans une equipe
 */
export async function getUserTeamRole(
  userId: string,
  teamId: string
): Promise<{ role: TeamRole; isOwner: boolean } | null> {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: {
      ownerId: true,
      members: {
        where: { userId },
        select: { role: true },
      },
    },
  });

  if (!team) return null;

  // Verifier si l'utilisateur est le proprietaire
  if (team.ownerId === userId) {
    return { role: "OWNER", isOwner: true };
  }

  // Verifier si l'utilisateur est membre
  const membership = team.members[0];
  if (!membership) return null;

  return { role: membership.role, isOwner: false };
}

/**
 * Verifie si un utilisateur a la permission d'effectuer une action dans une equipe
 */
export async function checkTeamPermission(
  userId: string,
  teamId: string,
  action: TeamAction
): Promise<PermissionCheckResult> {
  const userRole = await getUserTeamRole(userId, teamId);

  if (!userRole) {
    return {
      allowed: false,
      error: "Vous n'etes pas membre de cette equipe",
    };
  }

  const allowedActions = ROLE_PERMISSIONS[userRole.role];
  const hasPermission = allowedActions.includes(action);

  if (!hasPermission) {
    return {
      allowed: false,
      error: `Vous n'avez pas la permission d'effectuer cette action (role: ${getRoleName(userRole.role)})`,
      role: userRole.role,
      isOwner: userRole.isOwner,
    };
  }

  return {
    allowed: true,
    role: userRole.role,
    isOwner: userRole.isOwner,
  };
}

/**
 * Verifie si un utilisateur peut modifier le role d'un autre membre
 * Les ADMIN ne peuvent pas modifier le role du OWNER ou d'autres ADMIN
 */
export async function checkCanChangeRole(
  userId: string,
  teamId: string,
  targetUserId: string,
  newRole: TeamRole
): Promise<PermissionCheckResult> {
  // Verifier la permission de base
  const baseCheck = await checkTeamPermission(userId, teamId, "change_member_role");
  if (!baseCheck.allowed) return baseCheck;

  // Recuperer le role de l'utilisateur cible
  const targetRole = await getUserTeamRole(targetUserId, teamId);
  if (!targetRole) {
    return {
      allowed: false,
      error: "L'utilisateur cible n'est pas membre de cette equipe",
    };
  }

  // Le proprietaire ne peut pas changer son propre role
  if (targetRole.isOwner) {
    return {
      allowed: false,
      error: "Impossible de modifier le role du proprietaire de l'equipe",
      role: baseCheck.role,
      isOwner: baseCheck.isOwner,
    };
  }

  // Un ADMIN ne peut pas modifier le role d'un autre ADMIN
  if (baseCheck.role === "ADMIN" && targetRole.role === "ADMIN") {
    return {
      allowed: false,
      error: "Un administrateur ne peut pas modifier le role d'un autre administrateur",
      role: baseCheck.role,
      isOwner: baseCheck.isOwner,
    };
  }

  // Un ADMIN ne peut pas promouvoir quelqu'un au role ADMIN
  if (baseCheck.role === "ADMIN" && newRole === "ADMIN") {
    return {
      allowed: false,
      error: "Seul le proprietaire peut promouvoir un membre au role d'administrateur",
      role: baseCheck.role,
      isOwner: baseCheck.isOwner,
    };
  }

  return {
    allowed: true,
    role: baseCheck.role,
    isOwner: baseCheck.isOwner,
  };
}

/**
 * Verifie si un utilisateur peut retirer un membre de l'equipe
 * Les ADMIN ne peuvent pas retirer le OWNER ou d'autres ADMIN
 */
export async function checkCanRemoveMember(
  userId: string,
  teamId: string,
  targetUserId: string
): Promise<PermissionCheckResult> {
  // Verifier la permission de base
  const baseCheck = await checkTeamPermission(userId, teamId, "remove_member");
  if (!baseCheck.allowed) return baseCheck;

  // Recuperer le role de l'utilisateur cible
  const targetRole = await getUserTeamRole(targetUserId, teamId);
  if (!targetRole) {
    return {
      allowed: false,
      error: "L'utilisateur cible n'est pas membre de cette equipe",
    };
  }

  // On ne peut pas retirer le proprietaire
  if (targetRole.isOwner) {
    return {
      allowed: false,
      error: "Impossible de retirer le proprietaire de l'equipe",
      role: baseCheck.role,
      isOwner: baseCheck.isOwner,
    };
  }

  // Un ADMIN ne peut pas retirer un autre ADMIN
  if (baseCheck.role === "ADMIN" && targetRole.role === "ADMIN") {
    return {
      allowed: false,
      error: "Un administrateur ne peut pas retirer un autre administrateur",
      role: baseCheck.role,
      isOwner: baseCheck.isOwner,
    };
  }

  return {
    allowed: true,
    role: baseCheck.role,
    isOwner: baseCheck.isOwner,
  };
}

/**
 * Verifie si un utilisateur peut modifier un QR code specifique
 * Les MEMBER ne peuvent modifier que leurs propres QR codes
 */
export async function checkCanEditQRCode(
  userId: string,
  teamId: string,
  qrcodeOwnerId: string
): Promise<PermissionCheckResult> {
  const baseCheck = await checkTeamPermission(userId, teamId, "edit_qrcode");
  if (!baseCheck.allowed) return baseCheck;

  // OWNER et ADMIN peuvent modifier tous les QR codes
  if (baseCheck.role === "OWNER" || baseCheck.role === "ADMIN") {
    return baseCheck;
  }

  // MEMBER ne peut modifier que ses propres QR codes
  if (qrcodeOwnerId !== userId) {
    return {
      allowed: false,
      error: "Vous ne pouvez modifier que vos propres QR codes",
      role: baseCheck.role,
      isOwner: baseCheck.isOwner,
    };
  }

  return baseCheck;
}

/**
 * Verifie si un utilisateur peut supprimer un QR code specifique
 * Les MEMBER ne peuvent supprimer que leurs propres QR codes
 */
export async function checkCanDeleteQRCode(
  userId: string,
  teamId: string,
  qrcodeOwnerId: string
): Promise<PermissionCheckResult> {
  const baseCheck = await checkTeamPermission(userId, teamId, "delete_qrcode");
  if (!baseCheck.allowed) return baseCheck;

  // OWNER et ADMIN peuvent supprimer tous les QR codes
  if (baseCheck.role === "OWNER" || baseCheck.role === "ADMIN") {
    return baseCheck;
  }

  // MEMBER ne peut supprimer que ses propres QR codes
  if (qrcodeOwnerId !== userId) {
    return {
      allowed: false,
      error: "Vous ne pouvez supprimer que vos propres QR codes",
      role: baseCheck.role,
      isOwner: baseCheck.isOwner,
    };
  }

  return baseCheck;
}

/**
 * Verifie si l'utilisateur a le plan BUSINESS (requis pour les equipes)
 */
export async function checkHasBusinessPlan(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });

  return user?.plan === "BUSINESS";
}

/**
 * Retourne le nom francais du role
 */
export function getRoleName(role: TeamRole): string {
  const names: Record<TeamRole, string> = {
    OWNER: "Proprietaire",
    ADMIN: "Administrateur",
    MEMBER: "Membre",
    VIEWER: "Lecteur",
  };
  return names[role];
}

/**
 * Retourne la description du role
 */
export function getRoleDescription(role: TeamRole): string {
  const descriptions: Record<TeamRole, string> = {
    OWNER: "Acces complet, peut supprimer l'equipe",
    ADMIN: "Peut gerer les membres et tous les QR codes",
    MEMBER: "Peut creer et modifier ses QR codes",
    VIEWER: "Peut uniquement consulter les QR codes",
  };
  return descriptions[role];
}

/**
 * Liste des roles disponibles pour l'invitation (sans OWNER)
 */
export const INVITABLE_ROLES: TeamRole[] = ["ADMIN", "MEMBER", "VIEWER"];
