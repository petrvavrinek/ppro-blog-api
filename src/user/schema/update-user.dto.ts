import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const UpdateUserSchema = z.object({
  username: z.string().optional(),
});

// class is required for using DTO as a type
export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
