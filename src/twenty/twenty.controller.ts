// src/twenty/twenty.controller.ts
import { Controller, Post, Body } from '@nestjs/common';

@Controller('twenty/webhooks')
export class TwentyWebhookController {
  @Post('activity-updated')
  handleActivityUpdate(@Body() payload: any) {
    // Handle updates from Twenty.com
    console.log('Activity updated:', payload);
    // Implement logic to sync changes back to your system
  }
}
