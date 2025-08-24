import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async notifyAdmin(@Body('subject') subject: string, @Body('html') html: string) {
    return this.notificationsService.notifyAdmin(subject, html);
  }
}
