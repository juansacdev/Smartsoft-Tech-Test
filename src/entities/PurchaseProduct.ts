import {
	BaseEntity,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { ProductEntity } from './Product'
import { PurchaseEntity } from './Purchase'

@Entity({ name: 'purchases_products' })
export class PurchaseProductsEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => ProductEntity, product => product.purchases_products)
	@JoinColumn({
		name: 'product_id',
	})
	product: ProductEntity

	@ManyToOne(() => PurchaseEntity, purchase => purchase.purchases_products)
	@JoinColumn({
		name: 'purchase_id',
	})
	purchase: PurchaseEntity
}
