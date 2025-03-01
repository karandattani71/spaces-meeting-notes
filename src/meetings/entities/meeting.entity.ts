import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { MeetingNotes } from './meeting-notes.entity';

@Entity()
export class Meeting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  meetingDate: Date;

  @OneToOne(() => MeetingNotes, (notes) => notes.meeting)
  notes: MeetingNotes;

  @Column({ nullable: true })
  twentyActivityId: string;

  @Column({ nullable: true })
  twentyObjectId: string;
}
