import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../guards";

export const Authorized = () => UseGuards(JwtAuthGuard);