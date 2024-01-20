import { Injectable, PipeTransform } from '@nestjs/common';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';
import { Stream } from 'stream';

type SharpPipeInput = (instance: sharp.Sharp) => sharp.Sharp;

export const SharpPipe = (input: SharpPipeInput, extension?: string) => {
  @Injectable()
  class _SharpPipe
    implements PipeTransform<Express.Multer.File, Promise<Express.Multer.File>>
  {
    async transform(image: Express.Multer.File): Promise<Express.Multer.File> {
      console.log(image);
      let instance = sharp(image.buffer);
      instance = input(instance);

      let filename: string | null;
      // Locally saved image
      if (image.path) {
        const originalDirectory = path.dirname(image.path);
        const originalName = path.parse(image.originalname).name;
        const newExtension = extension ?? path.extname(image.path);

        filename = Date.now() + '-' + originalName + newExtension;
        const outFilePath = path.join(originalDirectory, filename);
        await instance.toFile(outFilePath);

        const metadata = await instance.metadata();

        return {
          destination: originalDirectory,
          fieldname: image.fieldname,
          filename,
          path: outFilePath,
          mimetype: metadata.format ?? '',
          originalname: image.originalname,
          size: metadata.size ?? 0,
          stream: null as never,
          buffer: null as never,
          encoding: image.encoding,
        };
      }

      const [buffer, metadata] = await Promise.all([
        instance.toBuffer(),
        instance.metadata(),
      ]);

      return {
        fieldname: image.fieldname,
        originalname: image.originalname,
        encoding: image.encoding,
        mimetype: metadata.format ?? '',
        buffer,
        size: metadata.size ?? 0,
      } as never;
    }
  }
  return _SharpPipe;
};
