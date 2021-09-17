import boom from '@hapi/boom'
import { reqType, resType } from '../config/expressTypes'

const notFoundHandler = (_req: reqType, res: resType): void => {
	const {
		output: { statusCode, payload },
	} = boom.notFound()

	res.status(statusCode).json(payload)
}

export default notFoundHandler
