import boom from '@hapi/boom'
import { UserType } from '../API/users/services'
import { nextType, reqType, resType } from '../config/expressTypes'
import { UsersEntity } from '../entities/User'

async function isAdmin(
	req: reqType,
	_res: resType,
	next: nextType,
): Promise<void> {
	const { user } = req
	try {
		// Also is possible use JWT for valid permissions
		const userFound = (await UsersEntity.findOne({
			relations: ['role'],
			where: { id: user?.sub },
		})) as UserType

		if (userFound.role.name !== 'Admin') next(boom.forbidden())
		next()
	} catch (error) {
		next(boom.badData())
	}
}

export default isAdmin
