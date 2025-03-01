import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { MeetingNotes } from './meeting-notes.entity';

@Entity()
export class ActionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne(() => MeetingNotes, (notes) => notes.actionItems)
  notes: MeetingNotes;
}
