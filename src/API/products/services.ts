import { CategoryTypes, ProductEntity } from '../../entities/Product'

interface ProductType {
	name: string
	category: CategoryTypes
	price: number
	quantity_stock: number
}

// Why use statics?
// Here should handle the business error like not found an entity and not in controller

export class ProductServices {
	static async getAll(): Promise<ProductType[]> {
		const products = await ProductEntity.find()
		return products
	}

	static getOneById(id: number | string): Promise<ProductEntity | undefined> {
		return ProductEntity.findOne(id)
	}

	static create(data: ProductType): Promise<ProductType> {
		const newProduct = ProductEntity.create(data)
		return ProductEntity.save(newProduct)
	}

	static async updateOne(
		id: number | string,
		data: ProductType,
	): Promise<ProductType | boolean> {
		const prodFound = await this.getOneById(id)
		if (!prodFound) return false

		const prodUpdated = ProductEntity.merge(prodFound, data)
		return ProductEntity.save(prodUpdated)
	}

	static async deleteOne(id: number | string): Promise<boolean> {
		const prodFound = await this.getOneById(id)
		if (!prodFound) return false

		await ProductEntity.delete(id)
		return true
	}
}
