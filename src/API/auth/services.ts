import { RolesEntity } from '../../entities/Role'
import { UsersEntity } from '../../entities/User'
import createToken from '../../utils/createJWT'
import { hashPassword, isValidPassword } from '../../utils/hashPassword'
import { UserType } from '../users/services'

interface UserCredentials {
	email: string
	password: string
}

export class AuthServices {
	static async findByEmail(email: string): Promise<UsersEntity | undefined> {
		const userFound = await UsersEntity.findOne({ email })
		return userFound
	}

	static async isPassMatch(
		rawPass: string,
		hashPass: string,
	): Promise<boolean> {
		const isMatch = await isValidPassword(rawPass, hashPass)
		return isMatch
	}

	static async getRole(id: number): Promise<RolesEntity | undefined> {
		const roleFound = RolesEntity.findOne(id)
		if (!roleFound) return undefined
		return roleFound
	}

	static async signUpUser(
		userData: UserType,
		roleId: number,
	): Promise<boolean> {
		const hash = await hashPassword(userData.password)
		userData.password = hash

		const newUser = UsersEntity.create(userData)
		const roleFound = await this.getRole(roleId)

		if (!roleFound) return false

		newUser.role = roleFound
		const userCreated = await UsersEntity.save(newUser)
		return !!userCreated
	}

	static async signUpUserAdmin(
		userData: UserType,
		roleId: number,
	): Promise<boolean> {
		const hash = await hashPassword(userData.password)
		userData.password = hash

		const newUser = UsersEntity.create(userData)
		const roleFound = await this.getRole(roleId)

		if (!roleFound) return false

		newUser.role = roleFound
		const userCreated = await UsersEntity.save(newUser)
		return !!userCreated
	}

	static async signInUser({
		email,
		password,
	}: UserCredentials): Promise<string | boolean> {
		const userFound = await this.findByEmail(email)
		if (!userFound) return false

		const isMatch = await this.isPassMatch(password, userFound.password)
		if (!isMatch) return false

		const token = createToken(userFound)
		return token
	}
}
