import { PurchaseEntity } from 'src/entities/Purchase'
import { RolesEntity } from 'src/entities/Role'
import { UsersEntity } from '../../entities/User'
import { PurchaseServices } from '../purchases/services'

export interface UserType {
	firts_name: string
	last_name: string
	email: string
	password: string
	money: number
	purchases: PurchaseEntity[]
	role: RolesEntity
}

export class UserServices {
	static async getAll(): Promise<UserType[]> {
		const users = await UsersEntity.find({ relations: ['role', 'purchases'] })
		return users
	}

	static getOneById(id: number | string): Promise<UsersEntity | undefined> {
		return UsersEntity.findOne({
			where: { id },
			relations: ['role', 'purchases'],
		})
	}

	static create(data: UserType): Promise<UserType> {
		const newUser = UsersEntity.create(data)
		return UsersEntity.save(newUser)
	}

	static async updateOne(
		id: number | string,
		data: UserType,
	): Promise<UserType | boolean> {
		const userFound = await this.getOneById(id)
		if (!userFound) return false

		const userUpdated = UsersEntity.merge(userFound, data)
		return UsersEntity.save(userUpdated)
	}

	static async deleteOne(id: number | string): Promise<boolean> {
		const userFound = await this.getOneById(id)
		if (!userFound) return false

		await Promise.all(
			userFound.purchases.map(async item => {
				await PurchaseServices.deleteOne(item.id)
			}),
		)

		await UsersEntity.delete(id)
		return true
	}
}
