import { reqType, resType } from '../../config/expressTypes'
import { AuthServices } from './services'

export class AuthController {
	static async signUp(req: reqType, res: resType): Promise<resType> {
		// You could use a package for validate data like Joi or Class Validator and use an middleware with this purpose
		const { body: userData } = req

		if (
			!userData.email ||
			!userData.password ||
			!userData.firts_name ||
			!userData.last_name
		) {
			// Should use your middleware error
			return res.status(400).json({ msg: 'Please. Send your personal info' })
		}

		const isUserExist = await AuthServices.findByEmail(userData.email)

		if (isUserExist) {
			// Should use your middleware error
			return res.status(400).json({
				error: 'The user already exists',
				info: { email: userData.email },
			})
		}

		// Avoid magic numbers
		const ROLE_ID_CLIENT = 2
		const userCreated = await AuthServices.signUpUser(userData, ROLE_ID_CLIENT)

		if (!userCreated)
			// Should use your middleware error
			return res.status(500).json({ error: 'Internal error. Please try later' })

		return res.status(201).json({ msg: 'User created successfully' })
	}

	static async signUpAdmin(req: reqType, res: resType): Promise<resType> {
		// You could use a package for validate data like Joi or Class Validator and use an middleware with this purpose
		const { body: userData } = req

		if (
			!userData.email ||
			!userData.password ||
			!userData.firts_name ||
			!userData.last_name
		) {
			// Should use your middleware error
			return res.status(400).json({ msg: 'Please. Send your personal info' })
		}

		const isUserExist = await AuthServices.findByEmail(userData.email)

		if (isUserExist) {
			// Should use your middleware error
			return res.status(400).json({
				error: 'The user already exists',
				info: { email: userData.email },
			})
		}

		const ROLE_ID_CLIENT = 1
		const userCreated = await AuthServices.signUpUserAdmin(
			userData,
			ROLE_ID_CLIENT,
		)

		if (!userCreated)
			// Should use your middleware error
			return res.status(500).json({ error: 'Internal error. Please try later' })

		return res.status(201).json({ msg: 'User created successfully' })
	}

	static async signIn(req: reqType, res: resType): Promise<resType> {
		const { body: userData } = req

		if (!userData.email || !userData.password) {
			return res
				.status(400)
				.json({ msg: 'Please. Send your email and password' })
		}

		const isUserExist = await AuthServices.findByEmail(userData.email)

		if (!isUserExist)
			return res.status(400).json({ error: 'The User does not exists' })

		const token = await AuthServices.signInUser(userData)

		if (!token)
			return res.status(400).json({ error: 'The credentials are incorrect' })

		return res.status(200).json({ token })
	}
}
