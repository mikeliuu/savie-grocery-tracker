import { CommonEntity } from 'src/core/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AccountEntity } from '../accounts/account.entity';
import { GroceryEntity } from '../groceries/grocery.entity';
import { LocationEntity } from '../locations/location.entity';

@Entity('grocery_items')
export class GroceryItemEntity extends CommonEntity {
  @Column({ name: 'expiry_date', nullable: true })
  expiryDate: Date;

  @Column({ nullable: true, default: 0, type: 'float' })
  price: number;

  @Column({ nullable: true, default: '', type: 'varchar' })
  barcode: string;

  @Column({ nullable: true, default: '', type: 'varchar' })
  vendor: string;

  @Column({ nullable: true, default: false, type: 'boolean' })
  done: boolean;

  // @Column({ nullable: true, default: '', type: 'varchar' })
  // remark: string;

  @ManyToOne(() => LocationEntity, (location) => location.id)
  @JoinColumn({ name: 'location_id' })
  location: LocationEntity;

  @ManyToOne(() => AccountEntity, (account) => account.id)
  @JoinColumn({ name: 'account_id' })
  account: AccountEntity;

  @ManyToOne(() => GroceryEntity, (grocery) => grocery.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'grocery_id' })
  grocery: GroceryEntity;
}
