import { CommonEntity } from 'src/core/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';

@Entity('accounts')
export class AccountEntity extends CommonEntity {
  @Column()
  name: string;

  @Column({ name: 'is_default', default: true })
  isDefault: boolean;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
