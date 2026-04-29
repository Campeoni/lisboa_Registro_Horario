import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { LocationUser } from '../location-user/location-user.entity';
import { CheckIn } from '../checkin/checkin.entity';

@Entity()
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  code!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  address?: string;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  latitude?: number;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  longitude?: number;

  @Column('int', { default: 50 })
  geofenceRadiusMeters!: number;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ nullable: true, type: 'jsonb' })
  meta?: any;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => LocationUser, (lu: LocationUser) => lu.location)
  locationUsers!: LocationUser[];

  @OneToMany(() => CheckIn, (ci: CheckIn) => ci.location)
  checkIns!: CheckIn[];
}
