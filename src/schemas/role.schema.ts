import * as z from 'zod';

export const permissionSchema=z.object({
  permissionId:z.string(), 
  status:z.enum(["Read","Write","None"]).default("None"),
});

export const role=z.object({
  roleId:z.string(),
  roleName:z.string(),
  permissions:z.array(permissionSchema).optional(),
});

export type RoleInput = z.infer<typeof role>;
