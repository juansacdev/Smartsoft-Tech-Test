import jwt from 'jsonwebtoken'
import config from '../config/index'
import { UsersEntity } from '../entities/User'

const createToken = (user: UsersEntity): string => {
	const token = jwt.sign(
		{
			sub: user.id,
		},
		config.jwtSecret,
		{
			// Should be a environment var
			expiresIn: 3600000,
		},
	)
	return token
}

export default createToken
