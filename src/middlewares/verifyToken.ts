import boom from '@hapi/boom'
import jwt from 'jsonwebtoken'
import { nextType, reqType, resType } from '../config/expressTypes'
import config from '../config/index'

interface Payload {
	sub: number | string
}

async function verifyToken(
	req: reqType,
	_res: resType,
	next: nextType,
): Promise<void> {
	const bearerToken = req.headers.authorization
	if (!bearerToken) return next(boom.unauthorized('Token required'))

	const [bearer, token] = bearerToken.split(' ')
	if (bearer !== 'Bearer' || !token)
		return next(boom.unauthorized('Invalid token format'))

	try {
		const decoded = jwt.verify(token, config.jwtSecret) as Payload
		if (decoded) {
			req.user = decoded
			return next()
		}
		return next(boom.badData('Bad Data'))
	} catch (error) {
		return next(boom.forbidden())
	}
}

export default verifyToken
