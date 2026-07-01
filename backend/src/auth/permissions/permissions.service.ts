import { Injectable } from '@nestjs/common';
import { RoleKeys } from '../../role/constant/role-keys.constants';

@Injectable()
export class PermissionsService {
  // ¿Quién puede crear qué roles?
  canCreate(creatorRole: string, targetRole: string): boolean {
    const rules: Record<string, string[]> = {
      [RoleKeys.ROOT]: [RoleKeys.ROOT, RoleKeys.SUPERVISOR, RoleKeys.WORKER],
      [RoleKeys.SUPERVISOR]: [RoleKeys.WORKER],
      [RoleKeys.WORKER]: [],
    };
    return rules[creatorRole]?.includes(targetRole) ?? false;
  }

  // ¿Quién puede leer qué? (aplica a findAll y findOne)
  canRead(requesterRole: string): boolean {
    return requesterRole !== RoleKeys.WORKER;
  }

  // ¿Quién puede modificar a quién? (update)
  canModify(editorRole: string, targetRole: string): boolean {
    const rules: Record<string, string[]> = {
      [RoleKeys.ROOT]: [RoleKeys.ROOT, RoleKeys.SUPERVISOR, RoleKeys.WORKER],
      [RoleKeys.SUPERVISOR]: [RoleKeys.WORKER],
      [RoleKeys.WORKER]: [],
    };
    return rules[editorRole]?.includes(targetRole) ?? false;
  }

  // ¿Quién puede eliminar a quién? (delete)
  canDelete(deleterRole: string, targetRole: string): boolean {
    const rules: Record<string, string[]> = {
      [RoleKeys.ROOT]: [RoleKeys.ROOT, RoleKeys.SUPERVISOR, RoleKeys.WORKER],
      [RoleKeys.SUPERVISOR]: [RoleKeys.WORKER],
      [RoleKeys.WORKER]: [],
    };
    return rules[deleterRole]?.includes(targetRole) ?? false;
  }
}
