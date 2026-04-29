import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

export type FingerprintType = 'webauthn' | 'pin' | 'biometric';

@Entity()
export class Fingerprint {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'varchar', default: 'webauthn' })
  type!: FingerprintType;

  /** Credencial WebAuthn serializada o hash de PIN */
  @Column({ type: 'text' })
  credential!: string;

  /** Identificador público del dispositivo/credencial */
  @Column({ type: 'text', nullable: true })
  credentialId?: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ nullable: true, type: 'jsonb' })
  meta?: Record<string, unknown>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
