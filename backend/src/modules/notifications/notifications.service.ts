import { Injectable } from '@nestjs/common';
import { config } from '../../config';
import axios from 'axios';

@Injectable()
export class NotificationsService {
  async notifyAdmin(subject: string, html: string) {
    try {
      const response = await axios.post('https://api.elasticemail.com/v2/email/send', null, {
        params: {
          apikey: config.elasticEmailApiKey,
          from: config.elasticEmailFrom,
          to: config.elasticEmailFrom,
          subject,
          bodyHtml: html,
        },
      });
      return { success: true, response: response.data };
    } catch (error) {
      return { success: false, error: (error instanceof Error ? error.message : String(error)) };
    }
  }
}
