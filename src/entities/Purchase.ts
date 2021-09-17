import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { PurchaseProductsEntity } from './PurchaseProduct'
import { UsersEntity } from './User'

@Entity({ name: 'purchases' })
export class PurchaseEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number

	@CreateDateColumn({
		name: 'purchased_at',
		type: 'timestamptz',
		default: () => 'CURRENT_TIMESTAMP',
	})
	purchased_at: Date

	@Column()
	total: number

	@ManyToOne(() => UsersEntity, user => user.purchases)
	@JoinColumn({
		name: 'user_id',
	})
	user: UsersEntity

	@OneToMany(
		() => PurchaseProductsEntity,
		purchaseProduct => purchaseProduct.purchase,
	)
	purchases_products: PurchaseProductsEntity[]
}
