import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class globalResponseWrapper implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = exception;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'object') {
        message = (res as any).message || message;
        error = (res as any).error || error;
      } else {
        message = res as string;
      }
    }

    response.status(status).json({
      success: status < 400,
      status,
      message,
      error,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
