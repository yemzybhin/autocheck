import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as
        | string
        | { message?: string | string[]; error?: string };

      message =
        typeof res === "string"
          ? res
          : Array.isArray(res.message)
            ? res.message.join(", ")
            : res.message || res.error || message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    this.logger.error(`[${status}] ${message}`);

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
