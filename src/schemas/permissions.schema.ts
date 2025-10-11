import * as z from 'zod'

export const permission = z.object({
    permissionName:z.string(),
    active:z.boolean(),
    service:z.string()
})

export type permissions = z.infer<typeof permission>