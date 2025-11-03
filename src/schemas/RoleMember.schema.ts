
import * as z from 'zod'
export const Rolemembervalidation=z.object({
    MemberId:z.string().optional(),
    FullName:z.string(),
    ContactDetails:z.string(),
    Role:z.string(),
    Status:z.enum(['Active','InActive'])
})
export type RolememberInput=z.infer<typeof Rolemembervalidation>