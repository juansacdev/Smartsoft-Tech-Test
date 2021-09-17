import { reqType, resType } from '../../config/expressTypes'
import { ProductServices } from './services'

export class ProducController {
	static async findAllProds(_req: reqType, res: resType): Promise<resType> {
		const produtcs = await ProductServices.getAll()
		return res.status(200).json(produtcs)
	}

	static async findOneProdById(req: reqType, res: resType): Promise<resType> {
		const { id } = req.params
		const product = await ProductServices.getOneById(id)
		if (!product)
			return res.status(404).json({
				error: `Product with the id ${id} doesn't exist`,
				info: { id },
			})
		return res.status(200).json(product)
	}

	static async createOneProd(req: reqType, res: resType): Promise<resType> {
		const { body: data } = req
		const prodCreated = await ProductServices.create(data)
		return res.status(201).json(prodCreated)
	}

	static async updateOneProdById(req: reqType, res: resType): Promise<resType> {
		const { body: data } = req
		const { id } = req.params
		const prodUpdated = await ProductServices.updateOne(id, data)
		if (!prodUpdated)
			return res.status(404).json({
				error: `Product with the id ${id} doesn't exist`,
				info: { id },
			})
		return res.status(201).json(prodUpdated)
	}

	static async deleteOneProdById(req: reqType, res: resType): Promise<resType> {
		const { id } = req.params
		const isProdDeleted = await ProductServices.deleteOne(id)
		if (!isProdDeleted)
			return res.status(404).json({
				error: `Product with the id ${id} doesn't exist`,
				info: { id },
			})
		return res.status(200).json(isProdDeleted)
	}
}
