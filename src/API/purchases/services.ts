import { ProductEntity } from '../../entities/Product'
import { PurchaseEntity } from '../../entities/Purchase'
import { PurchaseProductsEntity } from '../../entities/PurchaseProduct'
import { UsersEntity } from '../../entities/User'
import { ProductServices } from '../products/services'

type ID = number | string | undefined

interface PurchaseType {
	purchased_at: Date
	total: number
	user: UsersEntity
}

interface ProductData {
	productId: ID
	quantity: number
}

export class PurchaseServices {
	static async getAll(userId?: ID): Promise<PurchaseType[]> {
		let purchases: PurchaseEntity[]

		if (userId) {
			purchases = await PurchaseEntity.find({
				where: { user: { id: userId } },
				relations: ['purchases_products', 'purchases_products.product'],
			})
			return purchases
		}

		purchases = await PurchaseEntity.find({
			relations: [
				'purchases_products',
				'purchases_products.product',
				'user',
				'user.role',
			],
		})

		return purchases
	}

	static async getOneById(
		id: ID,
		userId?: ID,
	): Promise<PurchaseEntity | undefined> {
		let purchase: PurchaseEntity

		if (userId) {
			purchase = await PurchaseEntity.findOne({
				where: { user: { id: userId }, id },
				relations: ['purchases_products', 'purchases_products.product'],
			})
			return purchase
		}

		purchase = await PurchaseEntity.findOne({
			where: { id },
			relations: [
				'purchases_products',
				'purchases_products.product',
				'user',
				'user.role',
			],
		})

		return purchase
	}

	static async create(
		userId: ID,
		productsToBuy: ProductData[],
	): Promise<PurchaseType | boolean> {
		const userLogged = await UsersEntity.findOne({ where: { id: userId } })

		const productsIds = productsToBuy.map(item => item.productId)
		const prodsFound = await ProductEntity.findByIds(productsIds)

		const prodsAvailableToPurchase = prodsFound.filter(item => {
			const currentProd = productsToBuy.find(prod => prod.productId === item.id)
			return currentProd.quantity <= item.quantity_stock
		})

		const totalMount = prodsAvailableToPurchase.reduce(
			(acum, current): number => {
				const currentProd = productsToBuy.find(
					prod => prod.productId === current.id,
				)
				return (acum += currentProd.quantity * current.price)
			},
			0,
		)

		const isEnougthMoney = userLogged.money >= totalMount
		if (!isEnougthMoney) return false

		userLogged.money = userLogged.money - totalMount
		await userLogged.save()

		const prodsUpdated = prodsAvailableToPurchase.map(item => {
			const currentProd = productsToBuy.find(prod => prod.productId === item.id)
			return {
				...item,
				quantity_stock: item.quantity_stock - currentProd.quantity,
			}
		})

		const newPurchase = PurchaseEntity.create({
			total: totalMount,
			user: userLogged,
		})

		const purchase = await PurchaseEntity.save(newPurchase)

		try {
			await Promise.all([
				prodsUpdated.map(async item => {
					const prodUpdated = await ProductServices.updateOne(item.id, item)
					const newPurchaseProd = PurchaseProductsEntity.create({
						product: item,
						purchase: newPurchase,
					})
					const purchProdUpdated = await PurchaseProductsEntity.save(
						newPurchaseProd,
					)
					return { prodUpdated, purchProdUpdated }
				}),
			])
		} catch (error) {
			console.log(error)
			throw new Error(error as string)
		}
		return purchase
	}

	static async update(
		purchaseId: ID,
		data: ProductData[],
	): Promise<PurchaseType | boolean> {
		const purchasesFound = await this.getOneById(purchaseId)
		if (!purchasesFound) return false

		const userLogged = await UsersEntity.findOne({
			where: { id: purchasesFound.user.id },
		})

		const productsIds = data.map(item => item.productId)
		const prodsFound = await ProductEntity.findByIds(productsIds)
		if (!prodsFound) return false

		const totalMount = prodsFound.reduce((acum, current): number => {
			const currentProd = data.find(prod => prod.productId === current.id)
			return (acum += currentProd.quantity * current.price)
		}, 0)

		userLogged.money = userLogged.money + totalMount
		purchasesFound.total = purchasesFound.total - totalMount

		await userLogged.save()
		await purchasesFound.save()

		const prodsUpdated = prodsFound.map(item => {
			const currentProd = data.find(prod => prod.productId === item.id)
			return {
				...item,
				quantity_stock: item.quantity_stock + currentProd.quantity,
			}
		})

		try {
			await Promise.all([
				prodsUpdated.map(
					async item => await ProductServices.updateOne(item.id, item),
				),
			])
		} catch (error) {
			console.log(error)
			throw new Error(error as string)
		}

		return purchasesFound
	}

	static async deleteOne(purchaseId: ID): Promise<boolean> {
		const purchasesFound = await this.getOneById(purchaseId)
		if (!purchasesFound) return false

		await Promise.all(
			purchasesFound.purchases_products.map(
				async item => await PurchaseProductsEntity.delete({ id: item.id }),
			),
		)

		await PurchaseEntity.delete(purchaseId)
		return true
	}
}
