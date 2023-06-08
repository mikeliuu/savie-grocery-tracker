import { IsEmail, Length } from 'class-validator';
import { CommonEntity } from 'src/core/entities/common.entity';
import { AccountEntity } from 'src/modules/accounts/account.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest',
}

export enum UserProvider {
  Local = 'local',
  Google = 'google',
  Facebook = 'facebook',
}

@Entity('users')
export class UserEntity extends CommonEntity {
  @Column({ nullable: true, default: '' })
  name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ nullable: true })
  @Length(4)
  password: string;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  //* oauth
  @Column({ name: 'provider_id', default: '', nullable: true })
  providerId: string;

  //* oauth
  @Column({
    type: 'enum',
    enum: UserProvider,
    default: UserProvider.Local,
  })
  provider: UserProvider;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.User,
  })
  role: UserRole;
}
