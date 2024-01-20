import { UseGuards, applyDecorators } from '@nestjs/common';
import { JwtAuthGuard } from '../guards';
import { ApiBearerAuth } from '@nestjs/swagger';

export const Authorized = () =>
  applyDecorators(UseGuards(JwtAuthGuard), ApiBearerAuth());
