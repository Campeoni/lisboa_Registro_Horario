import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Location } from '../location/location.entity';

@Entity()
export class CheckIn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  locationId: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Location, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'locationId' })
  location: Location;

  @Column({ type: 'varchar', default: 'in' })
  type: 'in' | 'out' | string;

  @Column({ nullable: true, type: 'jsonb' })
  meta?: any;

  @CreateDateColumn()
  createdAt: Date;
}
