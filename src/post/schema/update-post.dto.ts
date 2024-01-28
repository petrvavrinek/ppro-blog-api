import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const UpdatePostSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// class is required for using DTO as a type
export class UpdatePostDto extends createZodDto(UpdatePostSchema) {}
