// src/twenty/sync.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meeting } from '../meetings/entities/meeting.entity';
import { Repository } from 'typeorm';
import { TwentyService } from './twenty.service';

@Injectable()
export class SyncService {
  constructor(
    private readonly twentyService: TwentyService,
    @InjectRepository(Meeting)
    private readonly meetingRepository: Repository<Meeting>,
  ) {}

  async syncAllMeetings() {
    const meetings = await this.meetingRepository.find();

    for (const meeting of meetings) {
      if (!meeting.twentyActivityId) {
        await this.processMeeting(meeting);
      }
    }
  }

  private async processMeeting(meeting: Meeting) {
    // Similar logic to processor
    // Create activity and update record
  }
}
