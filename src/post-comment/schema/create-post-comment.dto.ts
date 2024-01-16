import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const CreatePostCommentSchema = z.object({
  content: z.string(),
});

// class is required for using DTO as a type
export class CreatePostCommentDto extends createZodDto(CreatePostCommentSchema) {}
