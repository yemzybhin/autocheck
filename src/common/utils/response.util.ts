/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

export function successResponse(message: string, data: any = null) {
  return {
    status: "success",
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

export function errorResponse(
  message: string,
  status: HttpStatus = HttpStatus.BAD_REQUEST,
  type: "default" | "user" = "default",
) {
  const payload = {
    status: "error",
    message,
    statusCode: status,
    type,
    timestamp: new Date().toISOString(),
  };

  switch (status) {
    case HttpStatus.NOT_FOUND:
      throw new NotFoundException(payload);

    case HttpStatus.BAD_REQUEST:
      throw new BadRequestException(payload);

    case HttpStatus.UNAUTHORIZED:
      throw new UnauthorizedException(payload);

    case HttpStatus.FORBIDDEN:
      throw new ForbiddenException(payload);

    default:
      throw new HttpException(payload, status);
  }
}
