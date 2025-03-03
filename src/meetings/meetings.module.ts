import { Module } from '@nestjs/common';
import { MeetingsController } from './meetings.controller';
import { MeetingsProcessor } from './meetings.processor';
import { MeetingBaasService } from './meeting-baas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingNotes } from './entities/meeting-notes.entity';
import { ActionItem } from './entities/action-item.entity';
import { AppWebSocketGateway } from '../websocket/websocket.gateway';
import { Meeting } from './entities/meeting.entity';
import { BullModule } from '@nestjs/bullmq';
import { TwentyService } from '../twenty/twenty.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MeetingNotes, ActionItem, Meeting]),
    BullModule.registerQueue({
      name: 'meeting-processing',
    }),
  ],
  controllers: [MeetingsController],
  providers: [MeetingsProcessor, MeetingBaasService, AppWebSocketGateway, TwentyService],
})
export class MeetingModule {}
