import { CommonEntity } from 'src/core/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AccountEntity } from '../accounts/account.entity';

@Entity('shopping_list')
export class ShoppingListEntity extends CommonEntity {
  @Column({ default: '', type: 'varchar' })
  name: string;

  @Column({ name: 'is_completed', nullable: true, default: false })
  isCompleted: boolean;

  @Column({ name: 'is_archived', nullable: true, default: false })
  isArchived: boolean;

  @Column({ nullable: true, default: '' })
  description: string;

  @ManyToOne(() => AccountEntity, (account) => account.id)
  @JoinColumn({ name: 'account_id' })
  account: AccountEntity;
}
