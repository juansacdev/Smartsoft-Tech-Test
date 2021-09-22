import { reqType, resType } from '../../config/expressTypes'
import { PurchaseServices as PurchServ } from './services'

export class PurchaseController {
	static async findAllPurch(_req: reqType, res: resType): Promise<resType> {
		const purchases = await PurchServ.getAll()
		return res.status(200).json(purchases)
	}

	static async findAllMe(req: reqType, res: resType): Promise<resType> {
		const { user } = req
		const purchases = await PurchServ.getAll(user.sub)
		return res.status(200).json(purchases)
	}

	static async findOneById(req: reqType, res: resType): Promise<resType> {
		const { id } = req.params

		const purchase = await PurchServ.getOneById(id)
		if (!purchase)
			// Should use your middleware error
			return res.status(404).json({
				error: `Purchase with the id ${id} doesn't exist`,
				info: { id },
			})
		return res.status(200).json(purchase)
	}

	static async findOneMe(req: reqType, res: resType): Promise<resType> {
		const { id } = req.params
		const { user } = req

		const purchase = await PurchServ.getOneById(id, user?.sub)
		if (!purchase)
			// Should use your middleware error
			return res.status(404).json({
				error: `Purchase with the id ${id} doesn't exist`,
				info: { id },
			})
		return res.status(200).json(purchase)
	}

	static async createOne(req: reqType, res: resType): Promise<resType> {
		const { user, body: productsToBuy } = req
		const purchCreated = await PurchServ.create(user?.sub, productsToBuy)

		if (!purchCreated) {
			// Should use your middleware error
			return res
				.status(400)
				.json({ error: 'No enougth money for this operation' })
		}

		return res.status(201).json(purchCreated)
	}

	static async updateOneOrMany(req: reqType, res: resType): Promise<resType> {
		const { body: data } = req
		const { purchaseId } = req.params

		const purchUpdated = await PurchServ.update(purchaseId, data)
		if (!purchUpdated)
			// Should use your middleware error
			return res.status(404).json({
				error: `Purchase with the id ${purchaseId} doesn't exist`,
				info: { purchaseId },
			})
		return res.status(201).json(purchUpdated)
	}

	static async deleteOneById(req: reqType, res: resType): Promise<resType> {
		const { purchaseId } = req.params

		const isPurchDeleted = await PurchServ.deleteOne(purchaseId)
		if (!isPurchDeleted)
			// Should use your middleware error
			return res.status(404).json({
				error: `Purchase with the id ${purchaseId} doesn't exist`,
				info: { purchaseId },
			})
		return res.status(200).json(isPurchDeleted)
	}
}
