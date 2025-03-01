import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Meeting } from './meeting.entity';
import { ActionItem } from './action-item.entity';

@Entity()
export class MeetingNotes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  fullNotes: string;

  @Column('text')
  summary: string;

  @OneToOne(() => Meeting)
  @JoinColumn()
  meeting: Meeting;

  @OneToMany(() => ActionItem, (item) => item.notes)
  actionItems: ActionItem[];
}
