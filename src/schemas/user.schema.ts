import * as z from 'zod'

export const user = z.object({
    name:z.string(),
    email:z.email(),
    contactNumber:z.string() , 
    photo:z.string().optional() ,
    refreshToken:z.string().optional() , 
    password:z.string().optional() ,
    isActive:z.boolean()
})

export type UserInput = z.infer<typeof user>