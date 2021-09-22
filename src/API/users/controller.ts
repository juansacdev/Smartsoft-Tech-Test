import { reqType, resType } from '../../config/expressTypes'
import { UserServices } from './services'

export class UserController {
	static async findAllUsers(_req: reqType, res: resType): Promise<resType> {
		const users = await UserServices.getAll()
		return res.status(200).json(users)
	}

	static async findOneUserById(req: reqType, res: resType): Promise<resType> {
		const { id } = req.params
		const user = await UserServices.getOneById(id)

		if (!user)
			// Should use your middleware error
			return res.status(404).json({
				error: `User with the id ${id} doesn't exist`,
				info: { id },
			})

		return res.status(200).json(user)
	}

	static async findMe(req: reqType, res: resType): Promise<resType> {
		const { user } = req
		const userLogged = await UserServices.getOneById(user.sub)
		return res.status(200).json(userLogged)
	}

	static async updateOneUserById(req: reqType, res: resType): Promise<resType> {
		const { body: data } = req
		const { id } = req.params
		const userUpdated = await UserServices.updateOne(id, data)
		if (!userUpdated)
			// Should use your middleware error
			return res.status(404).json({
				error: `User with the id ${id} doesn't exist`,
				info: { id },
			})

		return res.status(201).json(userUpdated)
	}

	static async updateMe(req: reqType, res: resType): Promise<resType> {
		const { body: data } = req
		const { user } = req
		const userUpdated = await UserServices.updateOne(user.sub, data)

		return res.status(201).json(userUpdated)
	}

	static async deleteOneUserById(req: reqType, res: resType): Promise<resType> {
		const { id } = req.params
		const isUserDeleted = await UserServices.deleteOne(id)
		if (!isUserDeleted)
			// Should use your middleware error
			return res.status(404).json({
				error: `User with the id ${id} doesn't exist`,
				info: { id },
			})

		return res.status(200).json(isUserDeleted)
	}

	static async deleteMe(req: reqType, res: resType): Promise<resType> {
		const { user } = req
		const isUserDeleted = await UserServices.deleteOne(user.sub)
		return res.status(200).json(isUserDeleted)
	}
}
