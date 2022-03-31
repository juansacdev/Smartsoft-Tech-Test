import {
	BaseEntity,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { PurchaseProductsEntity } from './PurchaseProduct'

export enum CategoryEnum {
	FOOD = 'Food',
	TECHNOLOGY = 'Technology',
	GAMES = 'Games',
}

export type CategoryTypes = 'Food' | 'Technology' | 'Games'

@Entity({ name: 'products' })
export class ProductEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ unique: true })
	name: string

	@Column({
		type: 'enum',
		enum: CategoryEnum,
	})
	category: CategoryTypes

	@Column()
	price: number

	// Use camelCase, the naming should be quantityStock in JS and in quantity_stock in DB
	@Column()
	quantity_stock: number

	@OneToMany(
		() => PurchaseProductsEntity,
		purchaseProduct => purchaseProduct.product,
	)
	// Use camelCase
	purchases_products: PurchaseProductsEntity[]
}
