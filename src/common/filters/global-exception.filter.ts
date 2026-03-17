import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code: string | number = 'INTERNAL_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const payload = exception.getResponse();

      if (status === HttpStatus.BAD_REQUEST) {
        code = 'VALIDATION_ERROR';
      }

      if (typeof payload === 'string') {
        message = payload;
      } else if (payload && typeof payload === 'object') {
        const maybeMessage = (payload as { message?: string | string[] })
          .message;
        if (Array.isArray(maybeMessage)) {
          message = maybeMessage.join('; ');
        } else if (typeof maybeMessage === 'string') {
          message = maybeMessage;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    if (status >= 500) {
      this.logger.error(message, (exception as Error)?.stack);
    } else {
      this.logger.warn(message);
    }

    response.status(status).json({
      success: false,
      error: {
        message,
        code,
      },
    });
  }
}
