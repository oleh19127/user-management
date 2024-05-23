import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UserRole } from './enums/user-role.enum';
import { Profile } from 'src/profile/profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, type: 'text' })
  gmail: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'text' })
  avatar: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Profile, (profile) => profile.user)
  @JoinColumn()
  profiles: Profile[];
}
