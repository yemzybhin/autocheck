import { HttpStatus } from "@nestjs/common";
import { AppError } from "./app-error";

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string | number) {
    super(
      `${resource} not found${id ? ` (id: ${id})` : ""}`,
      HttpStatus.NOT_FOUND,
    );
  }
}
