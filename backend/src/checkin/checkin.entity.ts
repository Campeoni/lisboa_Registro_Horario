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
  type: 'in' | 'out';

  // NEW columns for geolocation
  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  lat?: number;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  lng?: number;

  @Column('int', { nullable: true })
  accuracy?: number;

  @Column({ nullable: true })
  ip?: string;

  @Column({ default: false })
  validated: boolean;

  @Column('int', { nullable: true })
  distanceMeters?: number;

  @Column({ nullable: true, type: 'jsonb' })
  meta?: any;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
