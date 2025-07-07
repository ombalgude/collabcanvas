import { z } from "zod"

export const CreateUserSchema = z.object({
    email : z.string().email(),
    password : z.string(),
    name : z.string(),
    photo : z.string().optional()
})

export const SigninUserSchema = z.object({
    email : z.string().email(),
    password : z.string(),
})

export const CreateRoomSchema = z.object({
    name : z.string().min(3).max(20)
})