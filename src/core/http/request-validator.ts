import type { Request } from "express";

export interface RequestValidator<TRequestDto> {
  validate(request: Request): TRequestDto;
}
