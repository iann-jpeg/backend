import { BadRequestException } from '@nestjs/common';

export class BaseController {
  protected handleSuccess(data: any, message?: string) {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }

  protected handleError(error: any) {
    const message = error.message || 'An unexpected error occurred';
    throw new BadRequestException({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  }
}
