import { Controller, Post, Body } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { AppWebSocketGateway } from '../websocket/websocket.gateway';

@Controller('meetings')
export class MeetingsController {
  constructor(
    @InjectQueue('meeting-processing') private readonly queue: Queue,
    private readonly wsGateway: AppWebSocketGateway,
  ) {}

  @Post('process')
  async processMeeting(@Body('meetingId') meetingId: string) {
    const job = await this.queue.add('process-meeting', { meetingId });
    return {
      jobId: job.id,
      listenUrl: `/ws/job:${job.id}`,
    };
  }
}
