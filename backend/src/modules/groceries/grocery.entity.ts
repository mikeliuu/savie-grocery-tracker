import { CommonEntity } from 'src/core/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AccountEntity } from '../accounts/account.entity';
import { CategoryEntity } from '../categories/category.entity';
import { GroceryItemEntity } from '../grocery-items/grocery-item.entity';

@Entity('groceries')
export class GroceryEntity extends CommonEntity {
  @Column({ default: '', type: 'varchar' })
  name: string;

  @ManyToOne(() => CategoryEntity, (category) => category.id)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @ManyToOne(() => AccountEntity, (account) => account.id)
  @JoinColumn({ name: 'account_id' })
  account: AccountEntity;

  @OneToMany(() => GroceryItemEntity, (grocery) => grocery?.grocery, {
    cascade: true,
  })
  items: GroceryItemEntity[];
}
