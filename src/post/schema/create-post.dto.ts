import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const CreatePostSchema = z.object({
  title: z.string(),
  content: z.string(),
});

// class is required for using DTO as a type
export class CreatePostDto extends createZodDto(CreatePostSchema) {}
