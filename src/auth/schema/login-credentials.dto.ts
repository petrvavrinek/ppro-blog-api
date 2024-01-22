import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

const LoginCredentialsSchema = z.object({
  username: z.string().min(6),
  password: z.string().min(6),
})

// class is required for using DTO as a type
export class LoginCredentialsDto extends createZodDto(LoginCredentialsSchema) {}