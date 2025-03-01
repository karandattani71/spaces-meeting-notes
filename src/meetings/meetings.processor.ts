import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MeetingBaasService } from './meeting-baas.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingNotes } from './entities/meeting-notes.entity';
import { ActionItem } from './entities/action-item.entity';
import { AppWebSocketGateway } from '../websocket/websocket.gateway';
import { Process } from '@nestjs/bull';
import { TwentyService } from '../twenty/twenty.service';
import { Meeting } from './entities/meeting.entity';

@Processor('meeting-processing')
export class MeetingsProcessor extends WorkerHost {
  process(job: Job, token?: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  constructor(
    private readonly meetingBaasService: MeetingBaasService,
    @InjectRepository(MeetingNotes)
    private readonly notesRepository: Repository<MeetingNotes>,
    @InjectRepository(ActionItem)
    private readonly actionItemsRepository: Repository<ActionItem>,
    private readonly wsGateway: AppWebSocketGateway,
    private readonly twentyService: TwentyService,
    @InjectRepository(Meeting)
    private readonly meetingRepository: Repository<Meeting>,
  ) {
    super();
  }

  @Process()
  async processMeeting(job: Job<{ meetingId: string }>) {
    try {
      this.wsGateway.sendJobUpdate(job.id!, 'started');

      // Get transcript
      const transcript = await this.meetingBaasService.getTranscript(
        job.data.meetingId!,
      );
      this.wsGateway.sendJobUpdate(job.id!, 'transcript_loaded');

      // Process data
      const fullNotes = await this.generateNotes(transcript);
      const summary = await this.generateSummary(fullNotes);
      const actionItems = await this.extractActionItems(fullNotes);

      // Save to database
      const savedNotes = await this.notesRepository.save({
        fullNotes,
        summary,
        meeting: { id: parseInt(job.data.meetingId!) },
      });

      await this.actionItemsRepository.save(
        actionItems.map((item) => ({
          description: item,
          notes: savedNotes,
        })),
      );

      this.wsGateway.sendJobUpdate(job.id!, 'completed', savedNotes);

      // Get meeting entity
      const meeting = await this.meetingRepository.findOneBy({
        id: parseInt(job.data.meetingId),
      });

      // Create Twenty Activity
      const twentyActivity = await this.twentyService.createActivity({
        title: meeting.title,
        summary: savedNotes.summary,
        fullNotes: savedNotes.fullNotes,
        actionItems: savedNotes.actionItems,
      });

      // Link to Twenty Object
      await this.twentyService.linkToObject(
        twentyActivity.id,
        meeting.twentyObjectId,
      );

      // Update meeting with Twenty IDs
      await this.meetingRepository.update(meeting.id, {
        twentyActivityId: twentyActivity.id,
      });

      this.wsGateway.sendJobUpdate(job.id, 'completed', {
        ...savedNotes,
        twentyActivityId: twentyActivity.id,
      });

      return savedNotes;
    } catch (error) {
      this.wsGateway.sendJobUpdate(job.id!, 'failed', { error: error.message });
      throw error;
    }
  }

  private async generateNotes(transcript: any): Promise<string> {
    // Convert MeetingBaas transcript format to structured notes
    return transcript.segments
      .map((segment, index) => {
        return `[${segment.startTime}-${segment.endTime}] ${segment.speaker}: ${segment.text}`;
      })
      .join('\n');
  }

  private async generateSummary(notes: string): Promise<string> {
    // Basic implementation - replace with NLP model
    return notes.split('\n').slice(0, 3).join('\n');
  }

  private async extractActionItems(notes: string): Promise<string[]> {
    // Basic keyword matching - improve with NLP
    return notes
      .split('\n')
      .filter((line) => line.toLowerCase().includes('todo:'))
      .map((line) => line.replace(/todo:/i, '').trim());
  }
}
