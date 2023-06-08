import { CommonEntity } from 'src/core/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AccountEntity } from '../accounts/account.entity';

@Entity('categories')
export class CategoryEntity extends CommonEntity {
  @Column()
  name: string;

  @ManyToOne(() => AccountEntity, (account) => account.id)
  @JoinColumn({ name: 'account_id' })
  account: AccountEntity;
}
